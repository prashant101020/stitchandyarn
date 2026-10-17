// ═══ Core Types ═══

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'style';
  options: string[];
  price_adjustment: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_price?: number;
  category_id: string;
  category?: Category;
  is_active: boolean;
  is_made_to_order: boolean;
  stock_count: number;
  processing_days: number;
  care_instructions: string;
  images: ProductImage[];
  variants: ProductVariant[];
  created_at: string;
}

export interface PersonalisationData {
  initial_letter?: string;
  name_text?: string;
  colour_choice?: string;
  notes?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant_selections: Record<string, string>;
  personalisation: PersonalisationData;
  quantity: number;
  unit_price: number;
}

export interface Address {
  full_name: string;
  phone: string;
  email: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = 'new' | 'confirmed' | 'making' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'razorpay' | 'whatsapp' | 'cod';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: 'pending' | 'paid' | 'failed';
  coupon_code?: string;
  gift_note?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  variant_selections: Record<string, string>;
  personalisation: PersonalisationData;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order: number;
  is_active: boolean;
  usage_count: number;
  max_uses: number;
  expires_at?: string;
}

export interface CustomRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  description: string;
  reference_image_url?: string;
  colours: string;
  deadline: string;
  status: 'new' | 'reviewing' | 'accepted' | 'completed' | 'declined';
  created_at: string;
}

export interface SiteSettings {
  free_shipping_threshold: number;
  shipping_cost: number;
  whatsapp_number: string;
  instagram_url: string;
  email: string;
  razorpay_enabled: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  product_name?: string;
  avatar_initial: string;
}
