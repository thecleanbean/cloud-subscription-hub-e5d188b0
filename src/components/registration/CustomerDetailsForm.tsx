
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CustomerDetailsFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    postcode: string;
    address?: string;
  };
  onChange: (field: string, value: string) => void;
  isValidPostcode: boolean;
  onPostcodeValidate: (postcode: string) => void;
}

const CustomerDetailsForm = ({
  formData,
  onChange,
  isValidPostcode,
  onPostcodeValidate,
}: CustomerDetailsFormProps) => {
  const { toast } = useToast();
  const [addressInput, setAddressInput] = useState<HTMLInputElement | null>(null);

  // For now, let's make the address field work without Google Places
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input
          id="mobile"
          type="tel"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={(e) => onChange("mobile", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          placeholder="Enter your full address"
          value={formData.address || ''}
          onChange={(e) => onChange("address", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="postcode">Postcode</Label>
        <Input
          id="postcode"
          type="text"
          placeholder="Enter your postcode"
          value={formData.postcode}
          onChange={(e) => {
            onChange("postcode", e.target.value);
            onPostcodeValidate(e.target.value);
          }}
          className={!isValidPostcode ? "border-red-500" : ""}
          required
        />
        {!isValidPostcode && (
          <p className="text-red-500 text-sm mt-1">Please enter a valid UK postcode</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsForm;
