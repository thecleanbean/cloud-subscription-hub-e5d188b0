import { motion } from "framer-motion";

const PricingHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-16"
  >
    <h1 className="text-5xl md:text-6xl font-black text-primary mb-6 tracking-tight">
      MORE TIME, LESS LAUNDRY
    </h1>
    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
      Choose your perfect plan and let us handle your laundry. All plans include our
      core features with flexible delivery options.
    </p>
  </motion.div>
);

export default PricingHeader;