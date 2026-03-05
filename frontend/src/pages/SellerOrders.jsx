import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SellerOrders = () => {
  const { user, isBrand } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user || !isBrand) {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/seller/orders');
        setOrders(response.data.data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isBrand, navigate]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
        orderNotes: orderNotes
      });
      setOrders(orders.map(order => 
        order._id === orderId ? response.data.data : order
      ));
      setSelectedOrder(null);
      setOrderNotes('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Orders</h1>
            <p className="text-gray-400 mt-1">Manage customer orders and payments</p>
          </div>
          <Link
            to="/brand"
            className="text-gray-300 hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl shadow-xl p-12 text-center border border-gray-700">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">No Orders Yet</h2>
            <p className="text-gray-400">When customers order your products, they'll appear here</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-300 truncate max-w-[150px]">{order._id}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-white font-medium">{order.customer?.name}</p>
                          <p className="text-xs text-gray-400">{order.customer?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-300">{order.items.length} item(s)</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {order.items.map(i => i.name).join(', ')}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-white font-medium">₹{order.total}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-amber-400 hover:text-amber-300 text-sm font-medium"
                        >
                          View & Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-800 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Order Details</h2>
                <button
                  onClick={() => { setSelectedOrder(null); setOrderNotes(''); }}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Customer Information</h3>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-white font-medium">{selectedOrder.customer?.name}</p>
                    <p className="text-gray-400 text-sm">{selectedOrder.customer?.email}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Shipping Address</h3>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-white font-medium">{selectedOrder.shippingAddress.fullName}</p>
                    <p className="text-gray-400 text-sm">{selectedOrder.shippingAddress.addressLine1}</p>
                    {selectedOrder.shippingAddress.addressLine2 && (
                      <p className="text-gray-400 text-sm">{selectedOrder.shippingAddress.addressLine2}</p>
                    )}
                    <p className="text-gray-400 text-sm">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Payment Details</h3>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Payment Method: <span className="text-white">UPI</span></p>
                    <p className="text-gray-400 text-sm">
                      UPI Reference: <span className="text-white font-mono">{selectedOrder.upiReference}</span>
                    </p>
                    {selectedOrder.notes && (
                      <p className="text-gray-400 text-sm mt-2">
                        Customer Notes: <span className="text-white">{selectedOrder.notes}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 bg-gray-700/30 rounded-lg p-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-600">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400 text-sm">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <p className="text-white font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
                    <span className="text-gray-400">Total</span>
                    <span className="text-xl font-bold text-amber-400">₹{selectedOrder.total}</span>
                  </div>
                </div>

                {/* Status Update */}
                {selectedOrder.status === 'pending' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Confirm Payment & Order</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Verify the UPI reference number matches with your payment received. Once confirmed, 
                      the order will be marked as confirmed and you can ship the product.
                    </p>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Add notes for the customer (optional)"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
                      rows={3}
                    />
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder._id, 'confirmed')}
                      disabled={updating}
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {updating ? 'Processing...' : 'Confirm Order & Verify Payment'}
                    </button>
                  </div>
                )}

                {selectedOrder.status === 'confirmed' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Ship Order</h3>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder._id, 'shipped')}
                      disabled={updating}
                      className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {updating ? 'Processing...' : 'Mark as Shipped'}
                    </button>
                  </div>
                )}

                {selectedOrder.status === 'shipped' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Complete Delivery</h3>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder._id, 'delivered')}
                      disabled={updating}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {updating ? 'Processing...' : 'Mark as Delivered'}
                    </button>
                  </div>
                )}

                {selectedOrder.status === 'delivered' && (
                  <div className="bg-green-900/50 border border-green-700 rounded-lg p-4">
                    <p className="text-green-300 text-center">Order completed successfully!</p>
                    {selectedOrder.deliveryDate && (
                      <p className="text-green-400 text-sm text-center mt-1">
                        Delivered on {new Date(selectedOrder.deliveryDate).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;

