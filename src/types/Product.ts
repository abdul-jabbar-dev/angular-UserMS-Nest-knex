import { TUserResponse } from "./User";

export interface TProduct {
  id?: string; 
  title: string;
  desc: string;
  price: number;
  image: string;
  user_id: number|string|TUserResponse;
}
