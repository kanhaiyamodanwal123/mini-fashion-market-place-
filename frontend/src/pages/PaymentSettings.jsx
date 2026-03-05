import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentSettings = () => {
  const { user, isBrand, updatePaymentSettings, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    upiId: '',
    upiQrCode: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: ''
  });
  const [qrCodePreview, setQrCodePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user || !isBrand) {
      navigate('/');
      return;
    }

    if (user.paymentDetails) {
      setFormData({
        upiId: user.paymentDetails.upiId || '',
        upiQrCode: user.paymentDetails.upiQrCode || '',
        bankName: user.paymentDetails.bankName || '',
        accountNumber: user.paymentDetails.accountNumber || '',
        ifscCode: user.paymentDetails.ifscCode || '',
        accountHolderName: user.paymentDetails.accountHolderName || ''
      });
      setQrCodePreview(user.paymentDetails.upiQrCode || '');
    }
  }, [user, isBrand, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQrCodeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodePreview(reader.result);
        setFormData({ ...formData, upiQrCode: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await updatePaymentSettings(formData);
      setMessage({ type: 'success', text: 'Payment settings saved successfully!' });
      setTimeout(() => navigate('/brand'), 1500);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save payment settings' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white font-serif">Payment Settings</h2>
            <p className="text-amber-100 mt-1">Configure how customers will pay you</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
            {message.text && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-900/50 text-green-300 border border-green-700' 
                  : 'bg-red-900/50 text-red-300 border border-red-700'
              }`}>
                {message.text}
              </div>
            )}

            {/* UPI Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                UPI Payment
              </h3>
              <div className="bg-gray-700/50 rounded-xl p-6 space-y-4">
                <div>
                  <label htmlFor="upiId" className="block text-sm font-medium text-gray-300 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="example@upi"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="upiQrCode" className="block text-sm font-medium text-gray-300 mb-2">
                    UPI QR Code
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {qrCodePreview ? (
                        <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-amber-500">
                          <img src={qrCodePreview} alt="UPI QR Code" className="w-full h-full object-contain bg-white" />
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-lg bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center">
                          <span className="text-gray-500 text-xs text-center">No QR Code</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label 
                        htmlFor="qr-upload" 
                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-gray-500 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upload QR Code
                      </label>
                      <input
                        id="qr-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleQrCodeChange}
                        className="hidden"
                      />
                      <p className="mt-2 text-sm text-gray-400">Upload your UPI QR code for easy payments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Account Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Bank Account (Optional)
              </h3>
              <div className="bg-gray-700/50 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-300 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="e.g., State Bank of India"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-300 mb-2">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      id="accountHolderName"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      placeholder="As per bank records"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Your account number"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-300 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    id="ifscCode"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    placeholder="e.g., SBIN0001234"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-blue-300">
                    <strong>Payment Info:</strong> Customers will see your UPI ID or bank details during checkout. Make sure your payment details are correct to receive payments smoothly.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? 'Saving...' : 'Save Payment Settings'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/brand')}
                className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;

