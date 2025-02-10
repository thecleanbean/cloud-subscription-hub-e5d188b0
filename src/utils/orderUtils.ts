
import { ServiceTypes } from "@/types/locker";
import { cleanCloudAPI } from "@/services/cleanCloud";

export const calculateTotal = (serviceTypes: ServiceTypes): number => {
  let total = 0;
  if (serviceTypes.laundry) total += 25.00;
  if (serviceTypes.duvets) total += 35.00;
  if (serviceTypes.dryCleaning) total += 45.00;
  return total;
};

export const createOrderItems = (serviceTypes: ServiceTypes) => {
  return Object.entries(serviceTypes)
    .filter(([_, isSelected]) => isSelected)
    .map(([service]) => {
      switch (service) {
        case 'laundry':
          return {
            name: "Regular Laundry",
            quantity: 1,
            price: 25.00,
            service_type: "laundry"
          };
        case 'duvets':
          return {
            name: "Duvets & Bedding",
            quantity: 1,
            price: 35.00,
            service_type: "duvets"
          };
        case 'dryCleaning':
          return {
            name: "Dry Cleaning",
            quantity: 1,
            price: 45.00,
            service_type: "dry_cleaning"
          };
        default:
          return null;
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
};

export const createOrders = async (
  customerId: string,
  items: ReturnType<typeof createOrderItems>,
  lockerNumbers: string[],
  notes: string,
  serviceTypes: ServiceTypes,
  collectionDate: Date,
  total: number
) => {
  const perLockerTotal = total / lockerNumbers.length;
  
  return Promise.all(lockerNumbers.map(async (lockerNum) => {
    return cleanCloudAPI.orders.createOrder({
      customerId,
      items,
      lockerNumber: lockerNum,
      notes,
      serviceTypes,
      collectionDate,
      total: perLockerTotal
    });
  }));
};
