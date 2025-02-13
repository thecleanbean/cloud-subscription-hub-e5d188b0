
import { cleanCloudAPI } from "@/services/cleanCloud";
import { FormData } from "@/types/locker";

export const createNewCustomer = async (formData: FormData) => {
  console.log('Creating customer with data:', { 
    ...formData,
    email: '***' 
  });
  
  try {
    // Create customer in CleanCloud
    const customer = await cleanCloudAPI.customers.createCustomer({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobile: formData.mobile,
    });

    return customer;
  } catch (error) {
    console.error('Error in createNewCustomer:', error);
    throw error;
  }
};

export const findCustomerByEmail = async (email: string) => {
  console.log('Searching for customer:', { email: '***' });
  
  try {
    // Search directly in CleanCloud
    const customers = await cleanCloudAPI.customers.searchCustomers(email);
    return customers.length > 0 ? customers[0] : null;
  } catch (error) {
    console.error('Error searching for customer:', error);
    throw error;
  }
};
