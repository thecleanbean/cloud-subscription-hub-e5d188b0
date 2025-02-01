import { motion } from "framer-motion";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface OrderConfirmationProps {
  customerName: string;
  planName: string;
  deliveryOption: string;
  onClose: () => void;
}

const OrderConfirmation = ({ customerName, planName, deliveryOption, onClose }: OrderConfirmationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <Card className="p-8 text-center bg-white shadow-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        </motion.div>
        
        <h2 className="text-4xl font-bold text-primary mb-6">Success!</h2>
        
        <div className="space-y-4 mb-8">
          <p className="text-xl text-gray-700">
            Thank you <span className="font-semibold">{customerName}</span>!
          </p>
          <p className="text-gray-600">
            Your {planName} has been successfully registered with {deliveryOption}.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              You'll receive a confirmation email shortly with all your order details.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={onClose} 
            className="w-full max-w-sm mx-auto bg-primary hover:bg-primary-light text-white"
          >
            Return to Home
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at support@cleancloud.com
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default OrderConfirmation;