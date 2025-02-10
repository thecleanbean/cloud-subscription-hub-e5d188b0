
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StepFourProps {
  lockerNumber: string[];
  collectionDate: Date;
  notes: string;
  updateFormData: (field: string, value: any) => void;
}

const StepFour = ({ lockerNumber, collectionDate, notes, updateFormData }: StepFourProps) => {
  const lockerNumbers = Array.from({ length: 17 }, (_, i) => (i + 1).toString());

  const handleLockerSelect = (value: string) => {
    const newLockers = lockerNumber.includes(value)
      ? lockerNumber.filter(l => l !== value)
      : [...lockerNumber, value];
    updateFormData("lockerNumber", newLockers);
  };

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
          <Label htmlFor="lockerNumber">Select Lockers</Label>
          <Select
            value={lockerNumber[0] || ""} // Use the first selected locker as the current value
            onValueChange={handleLockerSelect}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select lockers">
                {lockerNumber.length > 0 
                  ? `${lockerNumber.length} locker${lockerNumber.length > 1 ? 's' : ''} selected`
                  : 'Select lockers'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {lockerNumbers.map((number) => (
                <SelectItem key={number} value={number}>
                  <div className="flex items-center">
                    <div className={cn(
                      "w-4 h-4 border rounded-sm mr-2",
                      lockerNumber.includes(number) ? "bg-primary border-primary" : "border-input"
                    )} />
                    Locker {number}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Collection Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !collectionDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {collectionDate ? (
                  format(collectionDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={collectionDate}
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
            value={notes}
            onChange={(e) => updateFormData("notes", e.target.value)}
            placeholder="Any special care instructions..."
            className="mt-1"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StepFour;
