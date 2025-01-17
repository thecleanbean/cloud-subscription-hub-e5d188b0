import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
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
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary-dark text-primary">
            <Link to="/" className="flex items-center gap-2">
              View Services <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;