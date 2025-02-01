import { motion } from "framer-motion";
import { CheckCircle, Calendar, ArrowRight, Package, Truck } from "lucide-react";
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
          className="mb-8"
        >
          <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </motion.div>
        
        <h2 className="text-4xl font-bold text-primary mb-4">All Set!</h2>
        
        <div className="space-y-6 mb-8">
          <p className="text-xl text-gray-700">
            Thanks <span className="font-semibold">{customerName}</span>! Your items are in good hands.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-primary/5 border-primary/10">
              <Package className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-primary mb-1">Service Plan</h3>
              <p className="text-gray-600">{planName}</p>
            </Card>
            
            <Card className="p-4 bg-primary/5 border-primary/10">
              <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-primary mb-1">Delivery Method</h3>
              <p className="text-gray-600">{deliveryOption}</p>
            </Card>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-primary mb-2">What's Next?</h3>
            <p className="text-gray-600">
              We'll send you a confirmation email with your order details and tracking information.
              You can expect your items to be ready within 24-48 hours.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={onClose} 
            className="w-full max-w-sm mx-auto bg-primary hover:bg-primary-light text-white font-medium"
          >
            Return to Home
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          
          <p className="text-sm text-gray-500">
            Questions? Contact our support team at{" "}
            <a href="mailto:support@cleancloud.com" className="text-primary hover:underline">
              support@cleancloud.com
            </a>
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default OrderConfirmation;