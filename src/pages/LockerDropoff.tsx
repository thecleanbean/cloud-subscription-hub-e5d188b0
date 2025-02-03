import { BackToHome } from "@/components/ui/back-to-home";
import { Navbar } from "@/components/layout/Navbar";
import { LockerDropoffForm } from "@/components/locker/LockerDropoffForm";

const LockerDropoff = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Locker Dropoff Service</h1>
          <p className="text-gray-600 mb-8">
            Please complete your details below to begin the dropoff process.
          </p>
          
          <LockerDropoffForm />
        </div>
      </div>
      <BackToHome />
    </div>
  );
};

export default LockerDropoff;