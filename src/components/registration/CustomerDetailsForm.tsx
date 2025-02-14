
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

declare global {
  interface Window {
    google: any;
    initGooglePlaces: () => void;
  }
}

const CustomerDetailsForm = ({
  formData,
  onChange,
  isValidPostcode,
  onPostcodeValidate,
}: CustomerDetailsFormProps) => {
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const [addressInput, setAddressInput] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadGooglePlaces = async () => {
      try {
        // Get API key from Supabase
        const { data, error } = await supabase
          .from('api_configs')
          .select('value')
          .eq('name', 'GOOGLE_PLACES_API_KEY')
          .single();

        if (error) {
          console.error('Error fetching Google Places API key:', error);
          return;
        }

        if (!data?.value) {
          console.error('Google Places API key not found');
          return;
        }

        // Initialize Google Places only once
        if (!window.google) {
          window.initGooglePlaces = () => {
            setIsGoogleScriptLoaded(true);
          };

          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${data.value}&libraries=places&callback=initGooglePlaces`;
          script.async = true;
          document.head.appendChild(script);
        } else {
          setIsGoogleScriptLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Google Places:', error);
      }
    };

    loadGooglePlaces();
  }, []);

  useEffect(() => {
    if (isGoogleScriptLoaded && addressInput) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInput, {
        componentRestrictions: { country: 'GB' },
        fields: ['address_components', 'formatted_address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.address_components) {
          let postcode = '';
          let fullAddress = place.formatted_address;

          // Extract postcode from address components
          for (const component of place.address_components) {
            if (component.types.includes('postal_code')) {
              postcode = component.long_name;
              break;
            }
          }

          // Update both address and postcode
          onChange('address', fullAddress);
          if (postcode) {
            onChange('postcode', postcode);
            onPostcodeValidate(postcode);
          }
        }
      });
    }
  }, [isGoogleScriptLoaded, addressInput, onChange, onPostcodeValidate]);

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
          placeholder="Start typing your address"
          value={formData.address || ''}
          onChange={(e) => onChange("address", e.target.value)}
          ref={setAddressInput}
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
