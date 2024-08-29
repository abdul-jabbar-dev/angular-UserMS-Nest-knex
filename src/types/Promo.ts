export interface TPromocodeResponce {
  id: number;
  code: string;
  discount_amount: number;
  discount_type: "percentage" | "fixed";
  valid_from: Date;
  valid_to: Date;
  usage_limit: number;
  times_used: number;
  is_active: boolean;
  author_id: number;
  created_at: Date;
  visible: "private" | "public";
  updated_at: Date;
}

export interface TPromocode {
  code: string;
  visible: "private" | "public";
  discount_amount: number;
  author_id?: number;
  discount_type: "percentage" | "fixed";
  valid_from: Date;
  valid_to: Date;
  usage_limit: number;
  times_used: number;
}
