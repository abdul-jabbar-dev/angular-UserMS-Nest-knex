export interface TProduct {
  id?: string; // UUID
  title: string;
  desc: string;
  price: number;
  image: string;
  user_id: number|string;
}
