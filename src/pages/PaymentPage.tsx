import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, CreditCard } from "lucide-react";
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

    // Simulate redirect to success page
    setTimeout(() => {
      navigate('/');
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
              <h2 className="text-2xl font-bold text-primary mb-4">Complete Payment</h2>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <p className="text-sm text-gray-600">Plan: {orderDetails.plan}</p>
                  <p className="text-sm text-gray-600">
                    Billing: {orderDetails.billingPeriod === 'yearly' ? 'Annual' : 'Monthly'}
                  </p>
                  {orderDetails.addons?.homeDelivery && (
                    <p className="text-sm text-gray-600">✓ Home Delivery</p>
                  )}
                  {orderDetails.addons?.sortingService && (
                    <p className="text-sm text-gray-600">✓ Sorting Service</p>
                  )}
                  <p className="font-bold mt-2 text-primary">
                    Total: £{orderDetails.total}
                    {orderDetails.billingPeriod === 'yearly' ? '/year' : '/month'}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <CreditCard className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-semibold">Payment Details</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full p-2 border rounded"
                      disabled={isProcessing}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="p-2 border rounded"
                        disabled={isProcessing}
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="p-2 border rounded"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full bg-primary hover:bg-primary-light text-white font-semibold"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Complete Payment"}
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-primary mb-2">Payment Successful!</h2>
              <p className="text-gray-600">
                Thank you for your subscription. You will be redirected shortly.
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentPage;