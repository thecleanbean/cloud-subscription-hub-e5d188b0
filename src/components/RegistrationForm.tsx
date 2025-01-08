import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface RegistrationFormProps {
  selectedPlan: string;
  onSubmit: (data: any) => void;
}

const RegistrationForm = ({ selectedPlan, onSubmit }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Register for {selectedPlan}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Complete Registration
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;