import { TProduct } from './Product';
import { TUser } from './User';
type Bill = {
  spot: string;
  cost: string;
  time: string;
}; 

type Address = {
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
};

type Product = {
  title: string;
  desc: string;
  price: number;
  image: string;
  user_id: number;
  id: number;
  status: string;
  created_at: string;
};

export type TOrder = {
  bill: Bill;
  user: TUser;
  address: Address;
  product: TProduct;
  user_id?: number;
  promocode_id?:string;
};
