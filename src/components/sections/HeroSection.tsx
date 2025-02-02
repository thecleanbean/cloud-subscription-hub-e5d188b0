import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen">
      <img 
        src="/lovable-uploads/bc797a12-8ef9-4004-9d8f-ae61d2ab8cbb.png"
        alt="Laundry Service"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            The Clean Bean
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            More Time, Less Laundry
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/book-collection" className="flex items-center gap-2">
                Book Now <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <a href="#pricing">
                View Pricing
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;