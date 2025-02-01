import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, CreditCard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    navigate('/');
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsComplete(true);
    
    toast({
      title: "Payment Successful",
      description: "Your subscription has been activated",
    });

    // Navigate to success page after a brief delay
    setTimeout(() => {
      navigate('/success', { 
        state: { 
          customerName: orderDetails.name,
          planName: orderDetails.plan,
          deliveryOption: orderDetails.addons?.homeDelivery ? "Home Delivery" : "Locker Pickup"
        }
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 text-primary hover:text-primary-dark"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 bg-white shadow-lg">
          {!isComplete ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-primary mb-2">Complete Your Payment</h2>
                <p className="text-gray-600">Your items are waiting to be cleaned!</p>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex justify-between">
                      <span>Service Type:</span>
                      <span className="font-medium">{orderDetails.plan}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Billing Period:</span>
                      <span className="font-medium">
                        {orderDetails.billingPeriod === 'yearly' ? 'Annual' : 'Monthly'}
                      </span>
                    </p>
                    {orderDetails.addons?.homeDelivery && (
                      <p className="flex justify-between">
                        <span>Home Delivery:</span>
                        <span className="font-medium text-green-600">Included</span>
                      </p>
                    )}
                    {orderDetails.addons?.sortingService && (
                      <p className="flex justify-between">
                        <span>Sorting Service:</span>
                        <span className="font-medium text-green-600">Included</span>
                      </p>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <p className="flex justify-between font-bold text-primary text-lg">
                        <span>Total:</span>
                        <span>£{orderDetails.total}
                          <span className="text-sm text-gray-500">
                            /{orderDetails.billingPeriod === 'yearly' ? 'year' : 'month'}
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <CreditCard className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-semibold">Payment Details</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full p-3 border rounded-lg bg-white"
                      disabled={isProcessing}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="p-3 border rounded-lg bg-white"
                        disabled={isProcessing}
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="p-3 border rounded-lg bg-white"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-6"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <CreditCard className="h-5 w-5" />
                    </motion.div>
                    Processing...
                  </span>
                ) : (
                  "Complete Payment"
                )}
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-primary mb-2">Payment Successful!</h2>
              <p className="text-gray-600">
                Thank you for your order. Redirecting you to the confirmation page...
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentPage;