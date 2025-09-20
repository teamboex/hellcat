import React, { useState } from 'react';
import { X, CreditCard, Smartphone, User, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CheckoutModal = ({ isOpen, onClose, product, onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'razorpay',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Payment, 3: Success

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    setStep(2);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock payment success
      const paymentResult = {
        success: true,
        paymentId: `pay_${Date.now()}`,
        credentials: {
          id: `Hellcat${Math.floor(Math.random() * 1000000)}`,
          password: `Pass${Math.floor(Math.random() * 10000)}`,
          loginType: product.loginType,
        },
      };

      setStep(3);
      toast.success('Payment successful! Account delivered.');

      // Call success callback after a delay
      setTimeout(() => {
        onPaymentSuccess({
          ...paymentResult,
          buyerName: formData.name,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
        });
        onClose();
        setStep(1);
        setFormData({
          name: '',
          email: '',
          phone: '',
          paymentMethod: 'razorpay',
        });
      }, 3000);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const calculateTotal = () => {
    const basePrice = product.price;
    const gst = Math.round(basePrice * 0.18); // 18% GST
    return {
      basePrice,
      gst,
      total: basePrice + gst,
    };
  };

  const totals = calculateTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  Complete Purchase
                </h2>
                <p className="text-sm text-slate-400">
                  Secure checkout for your Hellcat account
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 1 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Summary */}
                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🎮</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-100">
                        {product.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
                        <span className="flex items-center space-x-1">
                          <span>👑</span>
                          <span>{product.rank}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>🔐</span>
                          <span>{product.loginType}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>⚔️</span>
                          <span>{product.mythics.length} Mythics</span>
                        </span>
                      </div>
                      <div className="mt-2 text-2xl font-bold text-green-400">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buyer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Buyer Information</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="+91 98765 43210"
                      required
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      We&apos;ll send your account credentials via WhatsApp
                    </p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Method</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={formData.paymentMethod === 'razorpay'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.paymentMethod === 'razorpay'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-100">
                              Razorpay
                            </div>
                            <div className="text-sm text-slate-400">
                              Cards, UPI, Wallets
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={formData.paymentMethod === 'stripe'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.paymentMethod === 'stripe'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-100">
                              Stripe
                            </div>
                            <div className="text-sm text-slate-400">
                              Cards, UPI, Net Banking
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Account Price</span>
                      <span>{formatPrice(totals.basePrice)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>GST (18%)</span>
                      <span>{formatPrice(totals.gst)}</span>
                    </div>
                    <div className="border-t border-slate-600 pt-2">
                      <div className="flex justify-between text-lg font-bold text-slate-100">
                        <span>Total</span>
                        <span className="text-green-400">
                          {formatPrice(totals.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isProcessing
                      ? 'Processing...'
                      : `Pay ${formatPrice(totals.total)}`}
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">
                  Processing Payment
                </h3>
                <p className="text-slate-400 mb-6">
                  Please wait while we process your payment...
                </p>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-slate-400 mb-6">
                  Your Hellcat account has been delivered successfully.
                </p>

                <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-500/30 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <h4 className="font-semibold text-green-300">
                      Account Credentials Delivered
                    </h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Account ID:</span>
                      <span className="text-green-300 font-mono font-semibold">
                        Hellcat123456
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Password:</span>
                      <span className="text-green-300 font-mono font-semibold">
                        SecurePass123
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Login Type:</span>
                      <span className="text-green-300 font-semibold">
                        {product.loginType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-slate-100 mb-2 flex items-center justify-center space-x-2">
                    <span>📱</span>
                    <span>Delivery Confirmation</span>
                  </h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Credentials sent to WhatsApp</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Account status updated to "Sold Out"</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Order marked as completed</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-400">
                  This modal will close automatically in a few seconds.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
