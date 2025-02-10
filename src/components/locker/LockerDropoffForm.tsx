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
import { cleanCloudAPI } from "@/services/cleanCloud";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LockerDropoffFormProps {
  onSubmit: (data: any) => void;
}

const LockerDropoffForm = ({ onSubmit }: LockerDropoffFormProps) => {
  const [step, setStep] = useState(1);
  const [customerType, setCustomerType] = useState<'new' | 'returning'>('new');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    lockerNumber: "",
    notes: "",
    serviceTypes: {
      laundry: false,
      duvets: false,
      dryCleaning: false,
    },
    collectionDate: new Date(),
  });
  const { toast } = useToast();

  const calculateTotal = () => {
    let total = 0;
    if (formData.serviceTypes.laundry) total += 25.00;
    if (formData.serviceTypes.duvets) total += 35.00;
    if (formData.serviceTypes.dryCleaning) total += 45.00;
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let customerId;

      if (customerType === 'returning') {
        const customers = await cleanCloudAPI.customers.searchCustomers(formData.email);
        if (!customers || customers.length === 0) {
          toast({
            title: "Customer Not Found",
            description: "We couldn't find your account. Please check your email or sign up as a new customer.",
            variant: "destructive",
          });
          return;
        }
        customerId = customers[0].id;
      } else {
        // Create new customer
        const customer = await cleanCloudAPI.customers.createCustomer({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
        });
        customerId = customer.id;
      }

      // Calculate total based on selected services
      const total = calculateTotal();

      // Create items array based on selected services
      const items = [];
      if (formData.serviceTypes.laundry) {
        items.push({
          name: "Regular Laundry",
          quantity: 1,
          price: 25.00,
          service_type: "laundry"
        });
      }
      if (formData.serviceTypes.duvets) {
        items.push({
          name: "Duvets & Bedding",
          quantity: 1,
          price: 35.00,
          service_type: "duvets"
        });
      }
      if (formData.serviceTypes.dryCleaning) {
        items.push({
          name: "Dry Cleaning",
          quantity: 1,
          price: 45.00,
          service_type: "dry_cleaning"
        });
      }

      // Create order in CleanCloud
      const order = await cleanCloudAPI.orders.createOrder({
        customerId,
        items,
        lockerNumber: formData.lockerNumber,
        notes: formData.notes,
        serviceTypes: formData.serviceTypes,
        collectionDate: formData.collectionDate,
        total
      });

      toast({
        title: "Success!",
        description: "Your order has been registered successfully.",
      });

      onSubmit({ ...formData, orderId: order.id });
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderCustomerTypeStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-primary mb-2">Welcome</h3>
        <p className="text-muted-foreground">
          Are you a new or returning customer?
        </p>
      </div>
      <RadioGroup
        value={customerType}
        onValueChange={(value) => setCustomerType(value as 'new' | 'returning')}
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem
            value="new"
            id="new"
            className="peer sr-only"
          />
          <Label
            htmlFor="new"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <span className="text-lg font-semibold">New Customer</span>
            <span className="text-sm text-muted-foreground">First time using our service</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="returning"
            id="returning"
            className="peer sr-only"
          />
          <Label
            htmlFor="returning"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <span className="text-lg font-semibold">Returning Customer</span>
            <span className="text-sm text-muted-foreground">Already have an account</span>
          </Label>
        </div>
      </RadioGroup>
    </motion.div>
  );

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderCustomerTypeStep();

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-primary mb-2">Welcome Back</h3>
              <p className="text-muted-foreground">
                Please enter your email to continue
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
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
              <h3 className="text-2xl font-semibold text-primary mb-2">Service Details</h3>
              <p className="text-muted-foreground">
                Tell us what services you need
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
                    <p className="text-sm text-muted-foreground">Wash, dry, and fold service</p>
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
                    <Label htmlFor="duvets" className="font-medium">Duvets & Bedding</Label>
                    <p className="text-sm text-muted-foreground">Professional cleaning for duvets</p>
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
                    <p className="text-sm text-muted-foreground">For delicate items</p>
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
              <h3 className="text-2xl font-semibold text-primary mb-2">Locker & Collection Details</h3>
              <p className="text-muted-foreground">
                Final details for your dropoff
              </p>
            </div>
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
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Collection Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
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
                      onSelect={(date) => date && updateFormData("collectionDate", date)}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="notes">Special Instructions</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateFormData("notes", e.target.value)}
                  placeholder="Any special care instructions..."
                  className="mt-1"
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
          Complete your locker dropoff in just a few steps
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
              className={cn(
                "ml-auto",
                step === 1 && "w-full"
              )}
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
