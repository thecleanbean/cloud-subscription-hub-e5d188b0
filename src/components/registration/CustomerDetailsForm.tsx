
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();

  const handleMobileChange = (value: string) => {
    // Remove any non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    onChange("mobile", numericValue);
  };

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
        <Label htmlFor="mobile">Mobile Number <span className="text-red-500">*</span></Label>
        <Input
          id="mobile"
          type="tel"
          placeholder="Mobile Number (required)"
          value={formData.mobile}
          onChange={(e) => handleMobileChange(e.target.value)}
          className={!formData.mobile ? "border-red-500" : ""}
          required
          aria-required="true"
        />
        {!formData.mobile && (
          <p className="text-red-500 text-sm mt-1">Mobile number is required</p>
        )}
      </div>
      <div>
        <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
        <Textarea
          id="address"
          placeholder="Enter your full address (required)"
          value={formData.address || ''}
          onChange={(e) => onChange("address", e.target.value)}
          className={`min-h-[100px] resize-none ${!formData.address ? "border-red-500" : ""}`}
          required
          aria-required="true"
        />
        {!formData.address && (
          <p className="text-red-500 text-sm mt-1">Address is required</p>
        )}
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
