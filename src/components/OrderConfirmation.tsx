import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

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
      className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto text-center"
    >
      <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-primary mb-4">Order Confirmed!</h2>
      <p className="text-gray-600 mb-6">
        Thank you {customerName}! Your {planName} has been successfully registered.
        <br />
        <span className="font-semibold">Delivery Option:</span> {deliveryOption}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        You will receive a confirmation email shortly with your order details.
      </p>
      <Button onClick={onClose} className="w-full">
        Back to Home
      </Button>
    </motion.div>
  );
};

export default OrderConfirmation;