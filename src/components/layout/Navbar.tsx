
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || !isHome ? "bg-white shadow-md" : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${
              isScrolled || !isHome ? "text-primary" : "text-white"
            }`}>
              The Clean Bean
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`hover:text-secondary transition-colors ${
                isScrolled || !isHome ? "text-primary" : "text-white"
              }`}
            >
              Home
            </Link>
            <Link 
              to="/subscriptions" 
              className={`hover:text-secondary transition-colors ${
                isScrolled || !isHome ? "text-primary" : "text-white"
              }`}
            >
              Subscriptions
            </Link>
            <Link 
              to="/locker-dropoff" 
              className={`hover:text-secondary transition-colors ${
                isScrolled || !isHome ? "text-primary" : "text-white"
              }`}
            >
              Locker Dropoff
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${
              isScrolled || !isHome ? "text-primary" : "text-white"
            }`}
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
                to="/"
                className="block text-primary hover:text-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/subscriptions"
                className="block text-primary hover:text-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Subscriptions
              </Link>
              <Link
                to="/locker-dropoff"
                className="block text-primary hover:text-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Locker Dropoff
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
