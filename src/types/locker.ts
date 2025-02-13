
export interface ServiceTypes {
  laundry: boolean;
  duvets: boolean;
  dryCleaning: boolean;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Add password for returning customers
  mobile: string;
  lockerNumber: string[];
  notes: string;
  serviceTypes: ServiceTypes;
  collectionDate: Date;
}

export interface UseLockerDropoffProps {
  onSubmit: (data: any) => void;
}

export type CustomerType = 'new' | 'returning';
