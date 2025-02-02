import { BackToHome } from "@/components/ui/back-to-home";
import { Navbar } from "@/components/layout/Navbar";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-32">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-gray-700">
          Welcome to The Clean Bean, your go-to laundry service! We pride ourselves on providing top-notch laundry solutions tailored to your needs. Our team is dedicated to ensuring your clothes are treated with the utmost care and returned to you fresh and clean.
        </p>
        <p className="text-lg text-gray-700 mt-4">
          With our convenient pickup and delivery options, you can spend more time doing what you love while we take care of your laundry. Our eco-friendly practices and professional-grade equipment guarantee that your garments receive the best treatment possible.
        </p>
        <p className="text-lg text-gray-700 mt-4">
          Thank you for choosing The Clean Bean. We look forward to serving you!
        </p>
      </div>
      <BackToHome />
    </div>
  );
};

export default AboutUs;
