
import { Card } from "@/components/ui/card";
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
  const handleServiceClick = (service: keyof ServiceTypes) => {
    updateServiceTypes({
      ...serviceTypes,
      [service]: !serviceTypes[service],
    });
  };

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
        <Card 
          className={`p-4 cursor-pointer transition-all duration-200 ${
            serviceTypes.laundry 
              ? "border-primary bg-primary/5" 
              : "hover:border-primary/50"
          }`}
          onClick={() => handleServiceClick("laundry")}
        >
          <div className="flex items-start space-x-3">
            <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${serviceTypes.laundry ? "border-primary bg-primary" : "border-gray-300"}`}>
              {serviceTypes.laundry && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <div>
              <Label className="font-medium">Regular Laundry</Label>
              <p className="text-sm text-muted-foreground">Wash, dry, and fold service</p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-4 cursor-pointer transition-all duration-200 ${
            serviceTypes.duvets 
              ? "border-primary bg-primary/5" 
              : "hover:border-primary/50"
          }`}
          onClick={() => handleServiceClick("duvets")}
        >
          <div className="flex items-start space-x-3">
            <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${serviceTypes.duvets ? "border-primary bg-primary" : "border-gray-300"}`}>
              {serviceTypes.duvets && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <div>
              <Label className="font-medium">Duvets & Bedding</Label>
              <p className="text-sm text-muted-foreground">Professional cleaning for duvets</p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-4 cursor-pointer transition-all duration-200 ${
            serviceTypes.dryCleaning 
              ? "border-primary bg-primary/5" 
              : "hover:border-primary/50"
          }`}
          onClick={() => handleServiceClick("dryCleaning")}
        >
          <div className="flex items-start space-x-3">
            <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${serviceTypes.dryCleaning ? "border-primary bg-primary" : "border-gray-300"}`}>
              {serviceTypes.dryCleaning && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <div>
              <Label className="font-medium">Dry Cleaning</Label>
              <p className="text-sm text-muted-foreground">For delicate items</p>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default StepThree;
