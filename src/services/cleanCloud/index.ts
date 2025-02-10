
import { CustomerService } from "./customers";
import { OrderService } from "./orders";

class CleanCloudAPI {
  public customers: CustomerService;
  public orders: OrderService;

  constructor() {
    this.customers = new CustomerService();
    this.orders = new OrderService();
  }
}

export const cleanCloudAPI = new CleanCloudAPI();
