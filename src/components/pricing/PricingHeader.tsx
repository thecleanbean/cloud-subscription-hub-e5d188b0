import { motion } from "framer-motion";

const PricingHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-8 md:mb-16"
  >
    <h1 className="text-4xl md:text-5xl font-black text-primary mb-4">
      MORE TIME, LESS LAUNDRY
    </h1>
    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
      Choose your perfect plan and let us handle your laundry. All plans include our
      core features with flexible delivery options.
    </p>
  </motion.div>
);

export default PricingHeader;