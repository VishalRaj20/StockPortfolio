import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Shield, Lock, CheckCircle } from 'lucide-react';
import { PortfolioStock } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: PortfolioStock | null;
  onPaymentSuccess: (stock: PortfolioStock, quantity: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  stock,
  onPaymentSuccess
}: PaymentModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    bankAccount: ''
  });

  const totalAmount = stock ? stock.price * quantity : 0;
  const brokerage = totalAmount * 0.001; // 0.1% brokerage
  const taxes = totalAmount * 0.0018; // 0.18% GST
  const finalAmount = totalAmount + brokerage + taxes;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    if (!stock) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      onPaymentSuccess(stock, quantity);
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    setQuantity(1);
    setFormData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      upiId: '',
      bankAccount: ''
    });
    onClose();
  };

  if (!stock) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {isSuccess ? (
                // Success State
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-4">
                    You have successfully purchased {quantity} shares of {stock.symbol}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between text-sm">
                      <span>Total Amount:</span>
                      <span className="font-semibold">₹{finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Payment Form
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Buy {stock.symbol}</h2>
                        <p className="text-sm text-gray-500">{stock.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Stock Info */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Current Price</span>
                        <span className="text-lg font-semibold text-gray-900">₹{stock.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Sector</span>
                        <span className="text-sm font-medium text-blue-600">{stock.sector}</span>
                      </div>
                    </div>

                    {/* Quantity Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                      <div className="flex justify-between text-sm">
                        <span>Stock Value ({quantity} × ₹{stock.price.toFixed(2)})</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Brokerage (0.1%)</span>
                        <span>₹{brokerage.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxes & Charges</span>
                        <span>₹{taxes.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Amount</span>
                          <span>₹{finalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
                      <div className="space-y-2">
                        {[
                          { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                          { id: 'upi', label: 'UPI', icon: Shield },
                          { id: 'netbanking', label: 'Net Banking', icon: Lock }
                        ].map((method) => {
                          const Icon = method.icon;
                          return (
                            <label key={method.id} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={paymentMethod === method.id}
                                onChange={(e) => setPaymentMethod(e.target.value as any)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />
                              <Icon className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{method.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Payment Form */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={formData.cardholderName}
                            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'upi' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          placeholder="yourname@upi"
                          value={formData.upiId}
                          onChange={(e) => handleInputChange('upiId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {paymentMethod === 'netbanking' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Bank
                        </label>
                        <select
                          value={formData.bankAccount}
                          onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select your bank</option>
                          <option value="sbi">State Bank of India</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="axis">Axis Bank</option>
                          <option value="kotak">Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : `Pay ₹${finalAmount.toFixed(2)}`}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      <Shield className="w-3 h-3 inline mr-1" />
                      Your payment is secured with 256-bit SSL encryption
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;