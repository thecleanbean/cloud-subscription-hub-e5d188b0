import { motion } from "framer-motion";
import { User, ShoppingBag, Truck, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <User className="w-8 h-8" />,
    title: "Create Account",
    description: "Sign up for our laundry service"
  },
  {
    icon: <ShoppingBag className="w-8 h-8" />,
    title: "Place Order",
    description: "Choose your preferred plan"
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Delivery Request",
    description: "Schedule pickup & delivery"
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Done!",
    description: "Enjoy clean, fresh laundry"
  }
];

const CustomerJourney = () => {
  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-black text-primary mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience hassle-free laundry service in just a few simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 h-full border border-gray-200 hover:border-secondary transition-colors duration-300">
                <div className="flex flex-col items-center">
                  <div className="mb-4 text-secondary">{step.icon}</div>
                  <h3 className="text-lg font-bold text-primary mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm text-center">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerJourney;