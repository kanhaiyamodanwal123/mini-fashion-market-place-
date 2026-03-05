import { useLocation, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Order Found</h1>
          <Link to="/" className="text-amber-600 hover:underline">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Order Placed Successfully!</h1>
            <p className="text-green-100 mt-2">Your order is now pending confirmation from the seller</p>
          </div>

          {/* Order Details */}
          <div className="px-8 py-6">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Order ID</p>
                  <p className="font-medium text-gray-900">{order._id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <span className="inline-flex px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    Pending Confirmation
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium text-gray-900">₹{order.total}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
              <div className="text-sm">
                <p className="text-gray-500">Payment Method</p>
                <p className="font-medium text-gray-900">UPI</p>
                <p className="text-gray-500 mt-2">UPI Reference</p>
                <p className="font-medium text-gray-900">{order.upiReference}</p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 py-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Next Steps */}
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-medium text-amber-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• The seller will verify your payment and confirm the order</li>
                <li>• You'll receive a notification once the order is confirmed</li>
                <li>• Estimated delivery: 10 days after confirmation</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 py-6 bg-gray-50 flex space-x-4">
            <Link
              to="/my-orders"
              className="flex-1 bg-amber-500 text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-amber-600 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              to="/"
              className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

