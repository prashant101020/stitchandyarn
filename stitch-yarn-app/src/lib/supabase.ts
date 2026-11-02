import { createClient, type User } from '@supabase/supabase-js';
import type { CustomerUser, Address, CartItem, Order, OrderStatus, OrderItem } from '@/types';

const supabaseUrl = (
  import.meta.env.SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  ''
).trim();

const supabaseAnonKey = (
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-supabase-anon-key')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Helpers to identify email vs phone
export function isEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

export function isPhoneNumber(val: string): boolean {
  const digits = val.replace(/\D/g, '');
  return digits.length >= 10;
}

export function cleanPhoneDigits(val: string): string {
  const digits = val.replace(/\D/g, '');
  // If 12 digits starting with 91, extract the 10 digits or leave with country code
  return digits.length > 10 && digits.startsWith('91') ? digits.slice(2) : digits;
}

// Convert input (email or phone) to Supabase Auth compatible email
export function toAuthEmail(identifier: string): string {
  const clean = identifier.trim().toLowerCase();
  if (isEmail(clean)) {
    return clean;
  }
  const digits = cleanPhoneDigits(clean);
  // Phone formatted into a private auth domain so Supabase handles it effortlessly
  return `phone_${digits}@customer.stitchandyarn.in`;
}

// Transform Supabase User object into our CustomerUser
export function mapSupabaseUserToCustomer(user: User): CustomerUser {
  const meta = user.user_metadata || {};
  const authEmail = user.email || '';
  const isSyntheticPhoneEmail = authEmail.includes('@customer.stitchandyarn.in');

  const detectedEmail = !isSyntheticPhoneEmail ? authEmail : meta.email || '';
  const detectedPhone =
    meta.phone ||
    (isSyntheticPhoneEmail ? authEmail.split('@')[0].replace('phone_', '') : '');

  return {
    id: user.id,
    name: meta.full_name || meta.name || detectedEmail.split('@')[0] || 'Dear Customer',
    email: detectedEmail,
    phone: detectedPhone,
    created_at: user.created_at,
  };
}

// Local mock storage key for when Supabase is not yet configured
const LOCAL_STORAGE_KEY = 'stitch_yarn_customer_user';

export async function signUpCustomer({
  name,
  identifier,
  password,
}: {
  name: string;
  identifier: string;
  password: string;
}): Promise<{ customer: CustomerUser | null; error: string | null; isPreview?: boolean }> {
  const trimmedName = name.trim();
  const trimmedId = identifier.trim();

  if (!trimmedName) {
    return { customer: null, error: 'Please enter your name.' };
  }
  if (!trimmedId) {
    return { customer: null, error: 'Please enter an email or phone number.' };
  }
  if (password.length < 6) {
    return { customer: null, error: 'Password should be at least 6 characters.' };
  }

  const authEmail = toAuthEmail(trimmedId);
  const isPhone = !isEmail(trimmedId);
  const cleanPhone = isPhone ? cleanPhoneDigits(trimmedId) : '';

  // 1. Supabase Connected Flow
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
            phone: cleanPhone,
            is_phone_account: isPhone,
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered') || error.message.includes('already exists')) {
          return {
            customer: null,
            error: 'An account with this email or phone already exists. Please sign in instead.',
          };
        }
        if (error.message.includes('rate limit') || error.message.includes('over_email_send_rate_limit')) {
          return {
            customer: null,
            error: 'Too many signup attempts. Please wait a minute or turn off "Confirm email" in your Supabase Auth dashboard.',
          };
        }
        return { customer: null, error: error.message };
      }

      if (data.user) {
        const customer = mapSupabaseUserToCustomer(data.user);

        // Sync to custom public.customers table if exists
        try {
          await supabase.from('customers').upsert({
            id: data.user.id,
            name: trimmedName,
            email: isPhone ? null : trimmedId,
            phone: isPhone ? cleanPhone : null,
          });
        } catch {
          // Table creation is optional/handled by trigger
        }

        return { customer, error: null };
      }

      return { customer: null, error: 'Could not create account. Please try again.' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      return { customer: null, error: message };
    }
  }

  // 2. Demo / Fallback Flow (when Supabase credentials are not yet entered)
  const fallbackCustomer: CustomerUser = {
    id: 'demo_' + Date.now(),
    name: trimmedName,
    email: isPhone ? '' : trimmedId,
    phone: isPhone ? cleanPhone : '',
    created_at: new Date().toISOString(),
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackCustomer));
  } catch {
    // Ignore storage errors
  }

  return { customer: fallbackCustomer, error: null, isPreview: true };
}

export async function signInCustomer({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}): Promise<{ customer: CustomerUser | null; error: string | null; isPreview?: boolean }> {
  const trimmedId = identifier.trim();

  if (!trimmedId) {
    return { customer: null, error: 'Please enter your email or phone number.' };
  }
  if (!password) {
    return { customer: null, error: 'Please enter your password.' };
  }

  const authEmail = toAuthEmail(trimmedId);

  // 1. Supabase Connected Flow
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return {
            customer: null,
            error: 'Incorrect email/phone or password. Please try again.',
          };
        }
        if (error.message.includes('Email not confirmed')) {
          return {
            customer: null,
            error: 'Your account was created, but email confirmation is pending. Please verify your email or disable "Confirm email" in Supabase to log in instantly.',
          };
        }
        return { customer: null, error: error.message };
      }

      if (data.user) {
        const customer = mapSupabaseUserToCustomer(data.user);
        return { customer, error: null };
      }

      return { customer: null, error: 'Failed to sign in. Please try again.' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      return { customer: null, error: message };
    }
  }

  // 2. Demo / Fallback Flow
  let savedUser: CustomerUser | null = null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) savedUser = JSON.parse(raw);
  } catch {
    savedUser = null;
  }

  const isPhone = !isEmail(trimmedId);
  const fallbackCustomer: CustomerUser = savedUser || {
    id: 'demo_' + Date.now(),
    name: isPhone ? `Customer (${cleanPhoneDigits(trimmedId)})` : trimmedId.split('@')[0],
    email: isPhone ? '' : trimmedId,
    phone: isPhone ? cleanPhoneDigits(trimmedId) : '',
    created_at: new Date().toISOString(),
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackCustomer));
  } catch {
    // Ignore
  }

  return { customer: fallbackCustomer, error: null, isPreview: true };
}

export async function signOutCustomer(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out of Supabase:', err);
    }
  }
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export async function getInitialCustomer(): Promise<CustomerUser | null> {
  if (supabase) {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        return mapSupabaseUserToCustomer(data.user);
      }
    } catch {
      // Ignore network errors on init
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }

  return null;
}

// Update customer profile (Name, Phone, Email)
export async function updateCustomerProfile({
  name,
  phone,
  email,
}: {
  name: string;
  phone?: string;
  email?: string;
}): Promise<{ customer: CustomerUser | null; error: string | null }> {
  const trimmedName = name.trim();
  const trimmedPhone = (phone || '').replace(/\D/g, '');
  const trimmedEmail = (email || '').trim().toLowerCase();

  if (!trimmedName) {
    return { customer: null, error: 'Please enter your full name.' };
  }

  // 1. Live Supabase Connected Flow
  if (supabase) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { customer: null, error: 'You are not signed in.' };
      }

      // Update user metadata in Supabase Auth
      const { data: updatedAuth, error: authError } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          full_name: trimmedName,
          name: trimmedName,
          phone: trimmedPhone,
          email: trimmedEmail,
        },
      });

      if (authError) {
        console.warn('Could not update Supabase auth metadata:', authError.message);
      }

      // Sync into public.customers table
      try {
        await supabase.from('customers').upsert({
          id: user.id,
          name: trimmedName,
          email: trimmedEmail || null,
          phone: trimmedPhone || null,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Could not sync to public.customers table:', err);
      }

      const activeUser = updatedAuth?.user || user;
      const updatedCustomer: CustomerUser = {
        id: activeUser.id,
        name: trimmedName,
        email:
          trimmedEmail ||
          (activeUser.email && !activeUser.email.includes('@customer.stitchandyarn.in')
            ? activeUser.email
            : ''),
        phone: trimmedPhone,
        created_at: activeUser.created_at,
      };

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCustomer));
      } catch {
        // Ignore
      }

      return { customer: updatedCustomer, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      return { customer: null, error: msg };
    }
  }

  // 2. Fallback / Offline Demo Mode
  let existing: CustomerUser | null = null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) existing = JSON.parse(raw);
  } catch {
    // Ignore
  }

  const updated: CustomerUser = {
    id: existing?.id || 'demo_' + Date.now(),
    name: trimmedName,
    email: trimmedEmail,
    phone: trimmedPhone,
    created_at: existing?.created_at || new Date().toISOString(),
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  return { customer: updated, error: null };
}

// ═══════════════════════════════════════════════════
// Order Management (Direct Orders & Admin Sync)
// ═══════════════════════════════════════════════════

const LOCAL_ORDERS_KEY = 'stitch_yarn_orders';

export async function submitDirectOrder({
  customerId,
  address,
  items,
  subtotal,
  discount,
  shipping,
  total,
  couponCode = '',
  giftNote = '',
  paymentMethod = 'razorpay',
  paymentStatus = 'paid',
  razorpayPaymentId = '',
  razorpayOrderId = '',
}: {
  customerId?: string | null;
  address: Address;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  giftNote?: string;
  paymentMethod?: 'cod' | 'whatsapp' | 'website' | 'razorpay';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}): Promise<{ order: Order | null; error: string | null }> {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `SY-${dateStr}-${randomSuffix}`;

  const validCustomerId =
    customerId && !customerId.startsWith('demo_') ? customerId : null;

  // 1. Live Supabase Order Insertion
  if (supabase) {
    try {
      const orderPayload: Record<string, unknown> = {
        order_number: orderNumber,
        customer_name: address.full_name,
        customer_phone: address.phone,
        customer_email: address.email,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        subtotal,
        discount,
        shipping,
        total,
        status: 'new',
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        razorpay_payment_id: razorpayPaymentId || null,
        razorpay_order_id: razorpayOrderId || null,
        coupon_code: couponCode || null,
        gift_note: giftNote || '',
      };

      if (validCustomerId) {
        orderPayload.customer_id = validCustomerId;
      }

      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (orderError) {
        console.error('Supabase order creation error:', orderError);
        if (orderError.code === 'PGRST205' || orderError.message.includes('orders')) {
          return {
            order: null,
            error:
              "The 'orders' table is not yet created in Supabase. Please run the provided SQL in your Supabase SQL Editor!",
          };
        }
        return { order: null, error: orderError.message };
      }

      if (createdOrder) {
        // Prepare items
        const itemsPayload = items.map((item) => ({
          order_id: createdOrder.id,
          product_name: item.product.name,
          product_image: item.product.images[0]?.url || '',
          variant_selections: item.variant_selections || {},
          personalisation: item.personalisation || {},
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.unit_price * item.quantity,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsPayload);

        if (itemsError) {
          console.warn('Could not insert order_items:', itemsError.message);
        }

        // Cache order in local storage for instant availability
        saveOrderToLocalStorage(createdOrder, itemsPayload);

        return {
          order: {
            ...createdOrder,
            items: itemsPayload as unknown as OrderItem[],
            address,
          },
          error: null,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to place order';
      return { order: null, error: msg };
    }
  }

  // 2. Fallback / Local Storage Mode (when previewing offline)
  const fallbackOrder: Order = {
    id: 'ord_' + Date.now(),
    order_number: orderNumber,
    customer_id: customerId || null,
    customer_name: address.full_name,
    customer_phone: address.phone,
    customer_email: address.email,
    address,
    address_line1: address.address_line1,
    address_line2: address.address_line2 || '',
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    subtotal,
    discount,
    shipping,
    total,
    status: 'new',
    payment_method: paymentMethod,
    payment_status: paymentStatus,
    razorpay_payment_id: razorpayPaymentId || undefined,
    razorpay_order_id: razorpayOrderId || undefined,
    coupon_code: couponCode,
    gift_note: giftNote,
    created_at: new Date().toISOString(),
    items: items.map((i) => ({
      product_name: i.product.name,
      product_image: i.product.images[0]?.url || '',
      variant_selections: i.variant_selections,
      personalisation: i.personalisation,
      quantity: i.quantity,
      unit_price: i.unit_price,
      total_price: i.unit_price * i.quantity,
    })),
  };

  saveOrderToLocalStorage(fallbackOrder, fallbackOrder.items || []);
  return { order: fallbackOrder, error: null };
}

function saveOrderToLocalStorage(order: unknown, items: unknown[] = []) {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    const existing: unknown[] = raw ? JSON.parse(raw) : [];
    const formatted = {
      ...(typeof order === 'object' && order ? order : {}),
      items,
      order_items: items,
    };
    existing.unshift(formatted);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch {
    // Ignore storage issues
  }
}

// Fetch all orders belonging to a customer
export async function getCustomerOrders(
  customer: CustomerUser
): Promise<{ orders: Order[]; error: string | null }> {
  let cloudOrders: Order[] = [];

  if (supabase) {
    try {
      let query = supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (customer.id && !customer.id.startsWith('demo_')) {
        const filters: string[] = [`customer_id.eq.${customer.id}`];
        if (customer.phone) filters.push(`customer_phone.eq.${customer.phone}`);
        if (customer.email) filters.push(`customer_email.eq.${customer.email}`);
        query = query.or(filters.join(','));
      } else if (customer.phone) {
        query = query.eq('customer_phone', customer.phone);
      } else if (customer.email) {
        query = query.eq('customer_email', customer.email);
      }

      const { data, error } = await query;
      if (!error && data) {
        cloudOrders = data.map((o) => ({
          ...o,
          items: o.order_items || [],
        }));
      }
    } catch (err) {
      console.warn('Error fetching customer orders from cloud:', err);
    }
  }

  // Merge with any locally cached orders matching customer
  let localOrders: Order[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (raw) {
      const all: Order[] = JSON.parse(raw);
      localOrders = all.filter(
        (o) =>
          (customer.phone && o.customer_phone === customer.phone) ||
          (customer.email && o.customer_email === customer.email) ||
          (customer.id && o.customer_id === customer.id)
      );
    }
  } catch {
    // Ignore
  }

  // Deduplicate by order_number
  const seen = new Set<string>();
  const combined: Order[] = [];
  for (const o of [...cloudOrders, ...localOrders]) {
    if (!seen.has(o.order_number)) {
      seen.add(o.order_number);
      combined.push(o);
    }
  }

  return { orders: combined, error: null };
}

// Fetch all orders for Admin
export async function getAllOrdersForAdmin(): Promise<{
  orders: Order[];
  error: string | null;
}> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin orders from Supabase:', error);
      } else if (data) {
        const formatted: Order[] = data.map((o) => ({
          ...o,
          items: o.order_items || [],
        }));
        return { orders: formatted, error: null };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching orders';
      return { orders: [], error: msg };
    }
  }

  // Fallback to local storage if supabase empty or preview mode
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (raw) {
      return { orders: JSON.parse(raw), error: null };
    }
  } catch {
    // Ignore
  }

  return { orders: [], error: null };
}

// Update order status in Supabase (visible to customer immediately)
export async function updateOrderStatusInDb(
  orderId: string,
  newStatus: OrderStatus
): Promise<{ success: boolean; error: string | null }> {
  let dbSuccess = false;

  if (supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        console.error('Failed to update status in Supabase:', error);
        return { success: false, error: error.message };
      }
      dbSuccess = true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      return { success: false, error: msg };
    }
  }

  // Also update local storage cache
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (raw) {
      const all: Order[] = JSON.parse(raw);
      const updated = all.map((o) =>
        o.id === orderId || o.order_number === orderId
          ? { ...o, status: newStatus }
          : o
      );
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
    }
  } catch {
    // Ignore
  }

  return { success: true, error: null };
}

// Check if the current authenticated user is an authorized admin
export async function checkIsAdmin(): Promise<boolean> {
  if (!supabase) {
    try {
      return localStorage.getItem('stitch_yarn_admin_session') === 'true';
    } catch {
      return false;
    }
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    // 1. Check if user is in admin_users table
    const { data: adminRow, error: adminErr } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle();

    if (!adminErr && adminRow) {
      return true;
    }

    // 2. Check metadata flag if set
    if (
      user.user_metadata?.is_admin === true ||
      user.app_metadata?.role === 'admin'
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

// Sign out admin securely
export async function signOutAdmin(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  }
  try {
    localStorage.removeItem('stitch_yarn_admin_session');
  } catch {
    // Ignore
  }
}

// Admin login verification with Supabase
export async function verifyAdminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; error: string | null }> {
  const trimmedEmail = email.trim().toLowerCase();

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Incorrect email or password.' };
        }
        if (error.message.includes('querying schema')) {
          return {
            success: false,
            error:
              'Supabase schema issue detected. Please run the repair SQL or create user via Supabase Dashboard.',
          };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Strict Role Check: Verify this user is an admin, NOT a regular customer
        const { data: adminRow } = await supabase
          .from('admin_users')
          .select('id, role')
          .eq('id', data.user.id)
          .maybeSingle();

        const isMetaAdmin =
          data.user.user_metadata?.is_admin === true ||
          data.user.app_metadata?.role === 'admin';

        if (!adminRow && !isMetaAdmin) {
          // A customer attempted to log into /admin! Immediately sign out and reject
          await supabase.auth.signOut();
          return {
            success: false,
            error:
              'Access Denied: This account is registered as a customer and does not have Admin privileges.',
          };
        }

        return { success: true, error: null };
      }

      return { success: false, error: 'Authentication failed.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      return { success: false, error: msg };
    }
  }

  // Preview Mode ONLY (fallback when no Supabase project is connected)
  if (trimmedEmail && password) {
    return { success: true, error: null };
  }

  return { success: false, error: 'Please enter valid email and password' };
}


