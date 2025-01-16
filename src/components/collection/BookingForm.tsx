import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface BookingFormProps {
  onSubmit: (bookingData: {
    date: string;
    time: string;
    items: string[];
    notes: string;
  }) => void;
  isLoading: boolean;
}

const BookingForm = ({ onSubmit, isLoading }: BookingFormProps) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    items: [] as string[],
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(bookingData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((stepNumber) => (
            <span
              key={stepNumber}
              className={`text-sm ${
                step >= stepNumber ? "text-primary font-medium" : "text-gray-400"
              }`}
            >
              Step {stepNumber}
            </span>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-secondary rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-primary mb-4">
            Select Collection Date & Time
          </h3>
          <div className="relative">
            <Input
              type="date"
              value={bookingData.date}
              onChange={(e) =>
                setBookingData({ ...bookingData, date: e.target.value })
              }
              className="w-full pl-10"
              required
            />
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div>
            <Input
              type="time"
              value={bookingData.time}
              onChange={(e) =>
                setBookingData({ ...bookingData, time: e.target.value })
              }
              className="w-full"
              required
            />
          </div>
          <Button
            type="button"
            onClick={() => setStep(2)}
            className="w-full bg-primary text-white hover:bg-primary-light"
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
          <h3 className="text-lg font-semibold text-primary mb-4">Add Items</h3>
          <div className="grid grid-cols-2 gap-4">
            {["Shirts", "Pants", "Dresses", "Suits"].map((item) => (
              <Button
                key={item}
                type="button"
                variant={bookingData.items.includes(item) ? "default" : "outline"}
                onClick={() =>
                  setBookingData({
                    ...bookingData,
                    items: bookingData.items.includes(item)
                      ? bookingData.items.filter((i) => i !== item)
                      : [...bookingData.items, item],
                  })
                }
                className={
                  bookingData.items.includes(item)
                    ? "bg-secondary text-primary hover:bg-secondary-light"
                    : "hover:bg-gray-50"
                }
              >
                {item}
              </Button>
            ))}
          </div>
          <Button
            type="button"
            onClick={() => setStep(3)}
            className="w-full bg-primary text-white hover:bg-primary-light"
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
            className="min-h-[100px]"
          />
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary-light"
            disabled={isLoading}
          >
            {isLoading ? "Confirming..." : "Confirm Booking"}
          </Button>
        </motion.div>
      )}
    </form>
  );
};

export default BookingForm;