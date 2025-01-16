import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center">
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/bc797a12-8ef9-4004-9d8f-ae61d2ab8cbb.png"
          alt="Laundry Service"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center text-white"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            More Time, Less Laundry
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Professional laundry service at your doorstep. Save time and enjoy life while we take care of your clothes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary-dark text-primary">
              <Link to="#pricing" className="flex items-center gap-2">
                View Plans <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
              <a href="#how-it-works">Learn More</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};