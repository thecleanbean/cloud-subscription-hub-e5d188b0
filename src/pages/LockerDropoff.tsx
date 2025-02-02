import { BackToHome } from "@/components/ui/back-to-home";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const LockerDropoff = () => {
  const [lockerCode, setLockerCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Your locker code has been verified.",
      });
      
      setLockerCode("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify locker code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Locker Dropoff</h1>
          <p className="text-gray-600 mb-8">
            Enter your locker code to access your designated dropoff point.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your locker code"
              value={lockerCode}
              onChange={(e) => setLockerCode(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </Button>
          </form>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Enter the locker code you received via email</li>
              <li>Wait for verification</li>
              <li>Once verified, your locker will automatically unlock</li>
              <li>Place your laundry inside and close the door securely</li>
            </ol>
          </div>
        </div>
      </div>
      <BackToHome />
    </div>
  );
};

export default LockerDropoff;