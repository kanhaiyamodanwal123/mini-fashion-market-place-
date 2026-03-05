import Product from '../models/Product.js';
import { cloudinary } from '../utils/cloudinary.js';

// @desc    Get all products with pagination, search, and filter
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: 'published' };

    // Search by name
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Get total count
    const total = await Product.countDocuments(query);

    // Get products with brand details
    const products = await Product.find(query)
      .populate('brand', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('brand', 'name email avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Brand only)
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, status } = req.body;

    // Check if images were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one product image'
      });
    }

    // Get image URLs from uploaded files
    const images = req.files.map(file => file.path);

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      images,
      brand: req.user._id,
      status: status || 'draft'
    });

    await product.populate('brand', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Brand - owner only)
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this product'
      });
    }

    const { name, description, price, category, status } = req.body;

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (category) updateData.category = category;
    if (status) updateData.status = status;

    // Handle existing images - can be sent as array or need to check req.body
    let existingImagesArray = [];
    if (req.body.existingImages) {
      // Can be a string (single) or array
      existingImagesArray = Array.isArray(req.body.existingImages) 
        ? req.body.existingImages 
        : [req.body.existingImages];
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      
      // Use existing images if provided, otherwise keep old images plus new ones
      if (existingImagesArray.length > 0) {
        updateData.images = [...existingImagesArray, ...newImages];
      } else {
        updateData.images = [...product.images, ...newImages];
      }
    } else if (existingImagesArray.length > 0) {
      // Only updating images (removing some)
      updateData.images = existingImagesArray;
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('brand', 'name email avatar');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (soft) product
// @route   DELETE /api/products/:id
// @access  Private (Brand - owner only)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this product'
      });
    }

    // Soft delete - set status to archived
    product.status = 'archived';
    await product.save();

    res.json({
      success: true,
      message: 'Product archived successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get brand's products
// @route   GET /api/products/brand/my-products
// @access  Private (Brand only)
export const getBrandProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter by status if provided
    const filter = { brand: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get brand dashboard stats
// @route   GET /api/products/brand/stats
// @access  Private (Brand only)
export const getBrandStats = async (req, res, next) => {
  try {
    const brandId = req.user._id;

    const totalProducts = await Product.countDocuments({ brand: brandId });
    const publishedProducts = await Product.countDocuments({ brand: brandId, status: 'published' });
    const archivedProducts = await Product.countDocuments({ brand: brandId, status: 'archived' });
    const draftProducts = await Product.countDocuments({ brand: brandId, status: 'draft' });

    res.json({
      success: true,
      data: {
        totalProducts,
        publishedProducts,
        archivedProducts,
        draftProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

