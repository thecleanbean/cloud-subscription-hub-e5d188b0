import { Store, Home, Clock } from "lucide-react";
import { motion } from "framer-motion";

const DeliverySection = () => {
  const deliveryOptions = [
    {
      icon: <Store className="w-12 h-12 text-primary" />,
      title: "In-store Pickup",
      description: "Available 7 days a week, 8:30-20:30",
      price: "Included",
    },
    {
      icon: <Home className="w-12 h-12 text-primary" />,
      title: "Home Delivery",
      description: "Monday to Friday, 7am-5PM",
      price: "£8.35/month or £100.20/year",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-primary text-center mb-8">
        Delivery Options
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {deliveryOptions.map((option) => (
          <motion.div
            key={option.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:border-secondary transition-colors duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              {option.icon}
              <div>
                <h3 className="text-lg font-bold text-primary">{option.title}</h3>
                <p className="text-gray-600">{option.description}</p>
              </div>
            </div>
            <p className="text-secondary-dark font-semibold">{option.price}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:border-secondary transition-colors duration-300">
        <div className="flex items-center gap-4 mb-4">
          <Clock className="w-12 h-12 text-primary" />
          <div>
            <h3 className="text-lg font-bold text-primary">Turnaround Time</h3>
            <p className="text-gray-600">
              Standard 2-day turnaround for all orders
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          *Excluding Sundays and bank holidays
        </p>
      </div>
    </div>
  );
};

export default DeliverySection;