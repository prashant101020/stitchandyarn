import { createClient, type User } from '@supabase/supabase-js';
import type { CustomerUser } from '@/types';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

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

