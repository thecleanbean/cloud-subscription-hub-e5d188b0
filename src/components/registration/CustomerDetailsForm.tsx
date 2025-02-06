
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerDetailsFormProps {
  formData: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    postcode: string;
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
}: CustomerDetailsFormProps) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="name">Full Name</Label>
      <Input
        id="name"
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => onChange("name", e.target.value)}
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
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => onChange("password", e.target.value)}
        required
        minLength={6}
      />
    </div>
    <div>
      <Label htmlFor="phone">Phone Number</Label>
      <Input
        id="phone"
        type="tel"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) => onChange("phone", e.target.value)}
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

export default CustomerDetailsForm;
