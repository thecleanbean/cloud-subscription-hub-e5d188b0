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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-primary mb-2">Your Details</h3>
              <p className="text-muted-foreground">
                Let us know who you are so we can take the best care of your items
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                  className="mt-1"
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
                  className="mt-1"
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
                  className="mt-1"
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
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-primary mb-2">Locker Details</h3>
              <p className="text-muted-foreground">
                Tell us which locker you've used for your items
              </p>
            </div>
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
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-2">
                You can find the locker number clearly displayed on the front of each locker
              </p>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-primary mb-2">Service Types</h3>
              <p className="text-muted-foreground">
                Select all the services you need for your items
              </p>
            </div>
            <div className="space-y-4">
              <Card className="p-4 hover:border-primary transition-colors">
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
                  <div>
                    <Label htmlFor="laundry" className="font-medium">Regular Laundry</Label>
                    <p className="text-sm text-muted-foreground">Wash, dry, and fold service for your everyday items</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:border-primary transition-colors">
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
                  <div>
                    <Label htmlFor="duvets" className="font-medium">Duvets</Label>
                    <p className="text-sm text-muted-foreground">Professional cleaning for duvets and blankets</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:border-primary transition-colors">
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
                  <div>
                    <Label htmlFor="dryCleaning" className="font-medium">Dry Cleaning</Label>
                    <p className="text-sm text-muted-foreground">Specialist care for delicate items</p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-primary mb-2">Collection Details</h3>
              <p className="text-muted-foreground">
                Choose when you'd like us to collect your items
              </p>
            </div>
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
                  className="h-32 mt-1"
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
    <Card className="max-w-2xl mx-auto p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Locker Drop-off</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We'll take great care of your items. Just fill in the details below and we'll handle the rest!
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                  ${step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
              >
                {stepNumber}
              </div>
              <span className={`text-xs ${
                step >= stepNumber ? 'text-primary font-medium' : 'text-gray-400'
              }`}>
                Step {stepNumber}
              </span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-100 rounded-full mt-2">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}

        <div className="flex justify-between pt-6">
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
              className={cn("ml-auto", step === 1 && "w-full")}
            >
              Next Step
            </Button>
          ) : (
            <Button type="submit" className="ml-auto">
              Complete Drop-off
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default LockerDropoffForm;