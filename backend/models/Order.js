import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    default: 1
  },
  image: String
});

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['upi'],
    default: 'upi'
  },
  upiReference: {
    type: String,
    required: true
  },
  upiTransactionId: String,
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryDate: {
    type: Date
  },
  notes: String,
  orderNotes: String
}, {
  timestamps: true
});

// Calculate delivery date (10 days from now)
orderSchema.pre('save', function(next) {
  if (this.isNew && this.status === 'confirmed') {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 10);
    this.deliveryDate = deliveryDate;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

