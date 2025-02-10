
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StepFourProps {
  lockerNumber: string;
  collectionDate: Date;
  notes: string;
  updateFormData: (field: string, value: any) => void;
}

const StepFour = ({ lockerNumber, collectionDate, notes, updateFormData }: StepFourProps) => {
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
            value={lockerNumber}
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
