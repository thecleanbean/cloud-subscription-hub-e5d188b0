import { BackToHome } from "@/components/ui/back-to-home";
import { Navbar } from "@/components/layout/Navbar";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-20 bg-gray-50" id="contact">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Get in Touch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
            Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
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
