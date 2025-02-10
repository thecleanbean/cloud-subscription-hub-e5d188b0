
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface ServiceTypes {
  laundry: boolean;
  duvets: boolean;
  dryCleaning: boolean;
}

interface StepThreeProps {
  serviceTypes: ServiceTypes;
  updateServiceTypes: (newTypes: ServiceTypes) => void;
}

const StepThree = ({ serviceTypes, updateServiceTypes }: StepThreeProps) => {
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
              checked={serviceTypes.laundry}
              onCheckedChange={(checked) =>
                updateServiceTypes({
                  ...serviceTypes,
                  laundry: checked as boolean,
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
              checked={serviceTypes.duvets}
              onCheckedChange={(checked) =>
                updateServiceTypes({
                  ...serviceTypes,
                  duvets: checked as boolean,
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
              checked={serviceTypes.dryCleaning}
              onCheckedChange={(checked) =>
                updateServiceTypes({
                  ...serviceTypes,
                  dryCleaning: checked as boolean,
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
};

export default StepThree;
