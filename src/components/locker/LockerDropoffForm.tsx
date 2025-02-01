import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LockerDropoffFormProps {
  onSubmit: (data: any) => void;
}

const LockerDropoffForm = ({ onSubmit }: LockerDropoffFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    lockerNumber: "",
    pin: "",
    instructions: "",
    serviceTypes: {
      laundry: false,
      duvets: false,
      dryCleaning: false,
    },
    collectionDate: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validatePin = (pin: string) => {
    return /^\d{4}$/.test(pin);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Your Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  required
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Locker Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="lockerNumber">Locker Number (1-17)</Label>
                <Input
                  id="lockerNumber"
                  type="number"
                  min="1"
                  max="17"
                  value={formData.lockerNumber}
                  onChange={(e) => updateFormData("lockerNumber", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pin">4-Digit PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  maxLength={4}
                  value={formData.pin}
                  onChange={(e) => updateFormData("pin", e.target.value)}
                  className={!validatePin(formData.pin) ? "border-red-500" : ""}
                  required
                />
                {!validatePin(formData.pin) && formData.pin && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a 4-digit PIN
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Service Types</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="laundry"
                  checked={formData.serviceTypes.laundry}
                  onCheckedChange={(checked) =>
                    updateFormData("serviceTypes", {
                      ...formData.serviceTypes,
                      laundry: checked,
                    })
                  }
                />
                <Label htmlFor="laundry">Regular Laundry</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="duvets"
                  checked={formData.serviceTypes.duvets}
                  onCheckedChange={(checked) =>
                    updateFormData("serviceTypes", {
                      ...formData.serviceTypes,
                      duvets: checked,
                    })
                  }
                />
                <Label htmlFor="duvets">Duvets</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dryCleaning"
                  checked={formData.serviceTypes.dryCleaning}
                  onCheckedChange={(checked) =>
                    updateFormData("serviceTypes", {
                      ...formData.serviceTypes,
                      dryCleaning: checked,
                    })
                  }
                />
                <Label htmlFor="dryCleaning">Dry Cleaning</Label>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Collection Details</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Preferred Collection Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.collectionDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.collectionDate ? (
                        format(formData.collectionDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.collectionDate}
                      onSelect={(date) => updateFormData("collectionDate", date)}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => updateFormData("instructions", e.target.value)}
                  placeholder="Any special care instructions or notes..."
                  className="h-32"
                />
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Locker Drop-off</h2>
        <p className="text-gray-600">Please fill in the details below</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((stepNumber) => (
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
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((prev) => prev - 1)}
            >
              Previous
            </Button>
          )}
          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep((prev) => prev + 1)}
              className="ml-auto"
            >
              Next
            </Button>
          ) : (
            <Button type="submit" className="ml-auto">
              Submit
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default LockerDropoffForm;