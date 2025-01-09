import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { mockAPI } from "@/services/mockCleanCloudAPI";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const CollectionBooking = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    items: [] as string[],
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to create collection booking
      await mockAPI.createOrder({
        customerId: "demo-customer",
        plan: "one-time",
        deliveryOption: "pickup",
      });

      toast({
        title: "Booking Confirmed!",
        description: `Your collection is scheduled for ${bookingData.date} at ${bookingData.time}`,
      });

      // Reset form
      setBookingData({
        date: "",
        time: "",
        items: [],
        notes: "",
      });
      setStep(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-primary mb-8 text-center">
            Book a Collection
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex-1">
                  <div
                    className={`h-2 rounded-full ${
                      step >= stepNumber ? "bg-secondary" : "bg-gray-200"
                    }`}
                  />
                  <p
                    className={`text-sm mt-2 ${
                      step >= stepNumber ? "text-secondary" : "text-gray-400"
                    }`}
                  >
                    Step {stepNumber}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    Select Collection Date & Time
                  </h3>
                  <div>
                    <Input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="time"
                      value={bookingData.time}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, time: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full"
                  >
                    Next
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    Add Items
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {["Shirts", "Pants", "Dresses", "Suits"].map((item) => (
                      <Button
                        key={item}
                        type="button"
                        variant={
                          bookingData.items.includes(item)
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setBookingData({
                            ...bookingData,
                            items: bookingData.items.includes(item)
                              ? bookingData.items.filter((i) => i !== item)
                              : [...bookingData.items, item],
                          })
                        }
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full"
                  >
                    Next
                  </Button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    Additional Notes
                  </h3>
                  <Textarea
                    placeholder="Any special instructions?"
                    value={bookingData.notes}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, notes: e.target.value })
                    }
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Confirming..." : "Confirm Booking"}
                  </Button>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CollectionBooking;