import { useState } from "react";
import { BackToHome } from "@/components/ui/back-to-home";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-20 bg-gray-50" id="contact">
        <div className="container mx-auto px-4 pt-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Get in Touch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
            Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Your Name"
                required
                aria-label="Your Name"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                required
                aria-label="Email Address"
              />
            </div>
            <div>
              <Textarea
                placeholder="Your Message"
                required
                className="min-h-[150px]"
                aria-label="Your Message"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </section>
      <BackToHome />
    </div>
  );
};

export default Contact;