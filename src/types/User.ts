export interface TUserResponse {
  id: number;
  username: string;
  password?: string;
  first_name: string;
  last_name: string;
  email:string;
  age: number;
  phone: string;
  status: "active" | "deactive";
  role: "admin" | "subscriber";
  created_at: Date;
  updated_at: Date;
}
export interface TUser { 
  password?: string;
  role?:'admin'|'subscriber',
  first_name: string;
  email:string;
  username?:string,
  last_name: string;
  age: number;
  phone: string;
}
export interface Tlogin { 
  password: string; 
  email:string; 
}
