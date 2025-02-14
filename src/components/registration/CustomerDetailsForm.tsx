
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
        <Label htmlFor="firstName" className="flex items-center">
          First Name <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          placeholder="First Name"
          className={!formData.firstName ? "border-red-200" : ""}
          required
        />
      </div>

      <div>
        <Label htmlFor="lastName" className="flex items-center">
          Last Name <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          placeholder="Last Name"
          className={!formData.lastName ? "border-red-200" : ""}
          required
        />
      </div>

      <div>
        <Label htmlFor="email" className="flex items-center">
          Email <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="Email"
          className={!formData.email ? "border-red-200" : ""}
          required
        />
      </div>

      <div>
        <Label htmlFor="mobile" className="flex items-center">
          Mobile Number <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="mobile"
          type="tel"
          value={formData.mobile}
          onChange={(e) => onChange("mobile", e.target.value)}
          placeholder="Mobile Number"
          className={!formData.mobile ? "border-red-200" : ""}
          required
        />
      </div>

      <div>
        <Label htmlFor="address" className="flex items-center">
          Address <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="address"
          value={formData.address ?? ''}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="Enter your address"
          className={cn("h-24 resize-none", !formData.address ? "border-red-200" : "")}
          required
        />
      </div>

      <div>
        <Label htmlFor="postcode" className="flex items-center">
          Postcode <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="postcode"
          value={formData.postcode}
          onChange={(e) => {
            onChange("postcode", e.target.value);
            onPostcodeValidate(e.target.value);
          }}
          placeholder="Enter your postcode"
          className={cn(!formData.postcode || !isValidPostcode ? "border-red-200" : "")}
          required
        />
        {!isValidPostcode && formData.postcode && (
          <p className="text-sm text-red-500 mt-1">Please enter a valid UK postcode</p>
        )}
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        <span className="text-red-500">*</span> Required fields
      </p>
    </div>
  );
};

export default CustomerDetailsForm;
