
export interface ServiceTypes {
  laundry: boolean;
  duvets: boolean;
  dryCleaning: boolean;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  mobile: string;
  postcode: string; // Added postcode field
  lockerNumber: string[];
  notes: string;
  serviceTypes: ServiceTypes;
  collectionDate: Date;
}

export interface UseLockerDropoffProps {
  onSubmit: (data: any) => void;
}

export type CustomerType = 'new' | 'returning';
