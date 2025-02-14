
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
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
  const today = new Date();
  const minDate = new Date(today.setDate(today.getDate() + 2));

  const handleLockerSelect = (value: string) => {
    const newLockers = lockerNumber.includes(value)
      ? lockerNumber.filter(l => l !== value)
      : [...lockerNumber, value].sort((a, b) => Number(a) - Number(b));
    updateFormData("lockerNumber", newLockers);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-primary mb-2">Locker & Collection Details</h3>
        <p className="text-muted-foreground">
          Final details for your dropoff
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="lockerNumber">Select Lockers</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {lockerNumbers.map((number) => (
              <Button
                key={number}
                type="button"
                variant={lockerNumber.includes(number) ? "default" : "outline"}
                onClick={() => handleLockerSelect(number)}
                className="w-full"
              >
                Locker {number}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="block mb-1">Collection Date (Required)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
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
                  date < minDate || date < new Date("1900-01-01")
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
    </div>
  );
};

export default StepFour;
