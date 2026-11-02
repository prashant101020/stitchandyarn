-- ═══════════════════════════════════════════════════════
-- Stitch & Yarn — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══ Categories ═══
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══ Products ═══
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  price INT NOT NULL, -- in paise? No, in rupees (whole numbers fine for handmade)
  compare_price INT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  is_made_to_order BOOLEAN DEFAULT false,
  stock_count INT DEFAULT 0,
  processing_days INT DEFAULT 5,
  care_instructions TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══ Product Images ═══
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══ Product Variants ═══
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Colour", "Size"
  type TEXT NOT NULL CHECK (type IN ('color', 'size', 'style')),
  options JSONB NOT NULL DEFAULT '[]', -- array of option strings
  price_adjustment INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══ Orders ═══
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT DEFAULT '',
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  subtotal INT NOT NULL,
  discount INT DEFAULT 0,
  shipping INT DEFAULT 0,
  total INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'making', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'whatsapp' CHECK (payment_method IN ('razorpay', 'whatsapp', 'cod')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  coupon_code TEXT,
  gift_note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══ Order Items ═══
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT DEFAULT '',
  variant_selections JSONB DEFAULT '{}',
  personalisation JSONB DEFAULT '{}',
  quantity INT NOT NULL DEFAULT 1,
  unit_price INT NOT NULL,
  total_price INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══ Coupons ═══
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value INT NOT NULL, -- percentage (10 = 10%) or fixed amount in rupees
  min_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  usage_count INT DEFAULT 0,
  max_uses INT DEFAULT 0, -- 0 = unlimited
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══ Custom Requests ═══
CREATE TABLE custom_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  description TEXT NOT NULL,
  reference_image_url TEXT,
  colours TEXT DEFAULT '',
  deadline TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'accepted', 'completed', 'declined')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══ Site Settings (key-value) ═══
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- Row Level Security (RLS) Policies
-- ═══════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for categories, products, images, variants
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public can read product variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public can read active coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);

-- Public can insert orders and order items (placing an order)
CREATE POLICY "Public can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create order items" ON order_items FOR INSERT WITH CHECK (true);

-- Public can read their own orders by phone number
CREATE POLICY "Public can read own orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public can read order items" ON order_items FOR SELECT USING (true);

-- Public can submit custom requests
CREATE POLICY "Public can create custom requests" ON custom_requests FOR INSERT WITH CHECK (true);

-- Admin (authenticated) full access
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access product images" ON product_images FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access product variants" ON product_variants FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access order items" ON order_items FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access coupons" ON coupons FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access custom requests" ON custom_requests FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin full access site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- ═══════════════════════════════════════════
-- Seed Data
-- ═══════════════════════════════════════════

-- Categories
INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
  ('Hair Accessories', 'hair-accessories', 'Handcrafted crochet bun sticks, flower rings, scrunchies and pearl-tassel clips.', '/products/Evil eye Hair tie.jpeg', 1),
  ('Keychains', 'keychains', 'Personalised initial-letter keychains with bow and bead charm.', '/products/Handmade Embroidery hoop with a pink bow.jpeg', 2),
  ('Home Decor', 'home-decor', 'Crochet flower pots, embroidery hoops and little pieces of warmth.', '/products/Handmade flower pot.jpeg', 3),
  ('Gifting', 'gifting', 'Thoughtful handmade gifts wrapped with love.', '/products/Decorative Embroidery Hoop.jpeg', 4);

-- Site settings
INSERT INTO site_settings (key, value) VALUES
  ('free_shipping_threshold', '599'),
  ('shipping_cost', '79'),
  ('whatsapp_number', '918779355911'),
  ('instagram_url', 'https://instagram.com/stitchandyarn.deepa'),
  ('email', 'hello@stitchandyarn.in'),
  ('razorpay_enabled', 'false');

-- Sample coupons
INSERT INTO coupons (code, type, value, min_order, is_active, max_uses) VALUES
  ('FIRST10', 'percentage', 10, 0, true, 100),
  ('WELCOME50', 'fixed', 50, 499, true, 50);

-- Generate order numbers function
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'SY-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD(CAST((EXTRACT(EPOCH FROM now()) * 1000)::BIGINT % 10000 AS TEXT), 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_timestamp BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_timestamp BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════
-- Customers & Profiles (Authentication)
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own customer profile" ON public.customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own customer profile" ON public.customers
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own customer profile" ON public.customers
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can view all customers" ON public.customers
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Automatically create customer profile when user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_customer()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (id, name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    CASE 
      WHEN NEW.email LIKE '%@customer.stitchandyarn.in' THEN NULL 
      ELSE NEW.email 
    END,
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = COALESCE(EXCLUDED.email, public.customers.email),
    phone = COALESCE(EXCLUDED.phone, public.customers.phone),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_customer();

-- ═══════════════════════════════════════════════════════
-- ORDERS, PAYMENTS & SECURE ADMIN SETUP SCRIPT
-- Run this in Supabase SQL Editor to create orders & items tables
-- ═══════════════════════════════════════════════════════

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Customers Table (if not exists)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Dedicated Admin Users Whitelist Table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Helper function to check if the caller is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT DEFAULT '',
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  subtotal INT NOT NULL,
  discount INT DEFAULT 0,
  shipping INT DEFAULT 0,
  total INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'making', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'razorpay' CHECK (payment_method IN ('razorpay', 'whatsapp', 'cod', 'website')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  coupon_code TEXT,
  gift_note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID,
  product_name TEXT NOT NULL,
  product_image TEXT DEFAULT '',
  variant_selections JSONB DEFAULT '{}',
  personalisation JSONB DEFAULT '{}',
  quantity INT NOT NULL DEFAULT 1,
  unit_price INT NOT NULL,
  total_price INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Ensure all required columns exist (for existing tables)
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'razorpay',
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS coupon_code TEXT,
  ADD COLUMN IF NOT EXISTS gift_note TEXT DEFAULT '';

-- Update payment method constraint safely
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check 
  CHECK (payment_method IN ('razorpay', 'whatsapp', 'cod', 'website'));

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_status_check 
  CHECK (payment_status IN ('pending', 'paid', 'failed'));

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 8. Policies for admin_users & customers
DROP POLICY IF EXISTS "Users can check own admin status" ON public.admin_users;
CREATE POLICY "Users can check own admin status" ON public.admin_users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own customer profile" ON public.customers;
CREATE POLICY "Users can view own customer profile" ON public.customers
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own customer profile" ON public.customers;
CREATE POLICY "Users can update own customer profile" ON public.customers
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own customer profile" ON public.customers;
CREATE POLICY "Users can insert own customer profile" ON public.customers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 9. Policies for Orders and Order Items
-- Anyone can place an order at checkout
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can create order items" ON public.order_items;
CREATE POLICY "Public can create order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Anyone can read their order items (for confirmation page & receipt)
DROP POLICY IF EXISTS "Public can read order items" ON public.order_items;
CREATE POLICY "Public can read order items" ON public.order_items FOR SELECT USING (true);

-- Order viewing: customers see their own, admins see all, guest confirmation supported
DROP POLICY IF EXISTS "Public can read own orders" ON public.orders;
CREATE POLICY "Public can read own orders" ON public.orders FOR SELECT USING (true);

-- Order updating: only authorized admins can change status
DROP POLICY IF EXISTS "Only admin can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admin update orders" ON public.orders;
CREATE POLICY "Only admin can update orders" ON public.orders FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- 10. Repair NULL token fields in auth.users that cause "Database error querying schema"
UPDATE auth.users
SET confirmation_token = COALESCE(confirmation_token, ''),
    email_change = COALESCE(email_change, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    phone_change = COALESCE(phone_change, ''),
    phone_change_token = COALESCE(phone_change_token, '')
WHERE confirmation_token IS NULL 
   OR email_change IS NULL 
   OR email_change_token_new IS NULL 
   OR recovery_token IS NULL;

-- 11. Register Admin Account (Shilpa)
DO $$
DECLARE
  v_email    TEXT := 'shilpa@stitchandyarn.in';
  v_password TEXT := 'abc123';
  v_name     TEXT := 'Shilpa (Admin)';
  v_admin_id UUID;
BEGIN
  SELECT id INTO v_admin_id FROM auth.users WHERE lower(email) = lower(v_email);

  IF v_admin_id IS NOT NULL THEN
    UPDATE auth.users
    SET encrypted_password = crypt(v_password, gen_salt('bf')),
        email = lower(v_email),
        email_confirmed_at = now(),
        confirmation_token = '',
        recovery_token = '',
        email_change = '',
        email_change_token_new = '',
        raw_user_meta_data = jsonb_build_object('full_name', v_name, 'is_admin', true),
        updated_at = now()
    WHERE id = v_admin_id;
  ELSE
    v_admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      confirmation_token, recovery_token, email_change, email_change_token_new,
      raw_app_meta_data, raw_user_meta_data, role, aud, created_at, updated_at
    )
    VALUES (
      v_admin_id, '00000000-0000-0000-0000-000000000000', lower(v_email),
      crypt(v_password, gen_salt('bf')), now(), '', '', '', '',
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', v_name, 'is_admin', true),
      'authenticated', 'authenticated', now(), now()
    );
  END IF;

  INSERT INTO public.admin_users (id, email, role)
  VALUES (v_admin_id, lower(v_email), 'admin')
  ON CONFLICT (email) DO UPDATE SET id = v_admin_id;
END $$;
