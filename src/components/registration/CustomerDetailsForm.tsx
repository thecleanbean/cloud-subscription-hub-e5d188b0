
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          placeholder="First Name"
        />
      </div>

      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          placeholder="Last Name"
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="Email"
        />
      </div>

      <div>
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input
          id="mobile"
          type="tel"
          value={formData.mobile}
          onChange={(e) => onChange("mobile", e.target.value)}
          placeholder="Mobile Number"
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address ?? ''}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="Enter your address"
          className="h-24 resize-none"
        />
      </div>

      <div>
        <Label htmlFor="postcode">Postcode</Label>
        <Input
          id="postcode"
          value={formData.postcode}
          onChange={(e) => {
            onChange("postcode", e.target.value);
            onPostcodeValidate(e.target.value);
          }}
          placeholder="Enter your postcode"
        />
      </div>
    </div>
  );
};

export default CustomerDetailsForm;
