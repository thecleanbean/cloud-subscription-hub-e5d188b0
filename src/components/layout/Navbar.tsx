import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${isScrolled ? 'text-primary' : 'text-white'}`}>
              The Clean Bean
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="#pricing" 
              className={`hover:text-secondary transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`}
            >
              Pricing
            </Link>
            <Link 
              to="#how-it-works" 
              className={`hover:text-secondary transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`}
            >
              How It Works
            </Link>
            <Link 
              to="#contact" 
              className={`hover:text-secondary transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`}
            >
              Contact
            </Link>
            <Link 
              to="/locker-dropoff" 
              className={`hover:text-secondary transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`}
            >
              Locker Dropoff
            </Link>
            <Button asChild variant={isScrolled ? "default" : "secondary"}>
              <Link to="/book-collection">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${isScrolled ? 'text-primary' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                to="#pricing"
                className="block text-primary hover:text-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="#how-it-works"
                className="block text-primary hover:text-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="#contact"
                className="block text-primary hover:text-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/locker-dropoff"
                className="block text-primary hover:text-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Locker Dropoff
              </Link>
              <Button asChild className="w-full">
                <Link to="/book-collection">Book Now</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};