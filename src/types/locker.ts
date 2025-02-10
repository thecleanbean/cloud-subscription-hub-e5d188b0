
export interface ServiceTypes {
  laundry: boolean;
  duvets: boolean;
  dryCleaning: boolean;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
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
