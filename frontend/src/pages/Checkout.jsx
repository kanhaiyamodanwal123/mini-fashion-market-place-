import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Checkout = () => {
  const { user, isBrand } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get product from location state
  const product = location.state?.product;
  const quantity = location.state?.quantity || 1;

  const [sellerPayment, setSellerPayment] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(true);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    upiReference: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch seller payment details
  useEffect(() => {
    const fetchSellerPayment = async () => {
      if (product?.brand?._id) {
        try {
          const response = await api.get(`/auth/seller/${product.brand._id}/payment`);
          setSellerPayment(response.data.data);
        } catch (err) {
          console.error('Failed to fetch seller payment details', err);
        }
      }
      setLoadingPayment(false);
    };

    if (product) {
      fetchSellerPayment();
    }
  }, [product]);

  // Redirect if not a customer
  useEffect(() => {
    if (!user || isBrand) {
      navigate('/');
    }
    if (!product) {
      navigate('/');
    }
  }, [user, isBrand, product, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const orderData = {
        items: [{
          product: product._id,
          quantity,
          name: product.name,
          price: product.price,
          image: product.images?.[0]
        }],
        shippingAddress: {
          fullName: formData.fullName,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone
        },
        upiReference: formData.upiReference,
        notes: formData.notes,
        seller: product.brand._id
      };

      const response = await api.post('/orders', orderData);
      
      if (response.data.success) {
        navigate('/order/success', { 
          state: { order: response.data.data } 
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = product ? product.price * quantity : 0;

  if (!product) {
    return null;
  }

  // Dark theme for brand, light for customer
  if (isBrand) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
          <p className="text-gray-400">Customers only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="House No., Street Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Landmark, Area (Optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="6-digit PIN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="10-digit mobile"
                  />
                </div>
              </div>

              {/* UPI Payment Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
                
                {/* Seller Payment Info */}
                {loadingPayment ? (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ) : sellerPayment?.paymentDetails?.upiId || sellerPayment?.paymentDetails?.upiQrCode ? (
                  <div className="bg-amber-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-amber-800 mb-3">
                      <strong>Pay via UPI:</strong> Scan the QR code or use the UPI ID below
                    </p>
                    
                    {/* UPI QR Code */}
                    {sellerPayment?.paymentDetails?.upiQrCode && (
                      <div className="flex justify-center mb-4">
                        <div className="bg-white p-2 rounded-lg inline-block">
                          <img 
                            src={sellerPayment.paymentDetails.upiQrCode} 
                            alt="UPI QR Code" 
                            className="w-40 h-40 object-contain"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* UPI ID */}
                    {sellerPayment?.paymentDetails?.upiId && (
                      <p className="text-center text-amber-900 font-medium">
                        UPI ID: <span className="font-mono">{sellerPayment.paymentDetails.upiId}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-amber-800">
                      <strong>UPI Payment:</strong> Pay ₹{total} to the seller's UPI ID
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPI Reference Number / Transaction ID *
                  </label>
                  <input
                    type="text"
                    name="upiReference"
                    value={formData.upiReference}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter your UPI transaction reference"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    After payment, enter the UPI transaction ID/reference number
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Any special instructions for the seller"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isSubmitting ? 'Placing Order...' : `Place Order - ₹${total}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">Qty: {quantity}</p>
                <p className="text-amber-600 font-semibold">₹{product.price}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{product.price * quantity}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Delivery Estimate:</strong> 10 days from order confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

