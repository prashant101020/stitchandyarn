declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Retrieves the Razorpay Key ID from environment variables.
 * Checks RAZORPAY_KEY_ID (primary for Vercel) and VITE_RAZORPAY_KEY_ID.
 */
export function getRazorpayKey(): string {
  const env = import.meta.env;
  return (
    (env.RAZORPAY_KEY_ID as string) ||
    (env.VITE_RAZORPAY_KEY_ID as string) ||
    ''
  );
}

/**
 * Dynamically loads the Razorpay checkout.js script if not already loaded.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay checkout.js script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface OpenRazorpayOptions {
  keyId: string;
  amountInRupees: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemCount: number;
  deliveryCity?: string;
  giftNote?: string;
  onSuccess: (response: RazorpayPaymentSuccessResponse) => Promise<void> | void;
  onDismiss?: () => void;
  onError?: (error: any) => void;
}

/**
 * Triggers Razorpay modal with custom Stitch & Yarn branding.
 */
export function openRazorpayCheckout({
  keyId,
  amountInRupees,
  customerName,
  customerEmail,
  customerPhone,
  itemCount,
  deliveryCity = '',
  giftNote = '',
  onSuccess,
  onDismiss,
  onError,
}: OpenRazorpayOptions): void {
  if (typeof window === 'undefined' || !window.Razorpay) {
    throw new Error('Razorpay SDK is not loaded. Please refresh and try again.');
  }

  const cleanPhone = customerPhone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : cleanPhone;

  const options = {
    key: keyId,
    amount: Math.round(amountInRupees * 100), // In paise (₹599 => 59900 paise)
    currency: 'INR',
    name: 'Stitch & Yarn',
    description: `Handcrafted order (${itemCount} item${itemCount > 1 ? 's' : ''})`,
    image: '/logo.jpeg',
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: formattedPhone,
    },
    notes: {
      brand: 'Stitch & Yarn',
      destination_city: deliveryCity,
      gift_note: giftNote ? giftNote.slice(0, 100) : '',
    },
    theme: {
      color: '#b85d56', // Stitch & Yarn primary rose accent
      backdrop_color: 'rgba(56, 34, 27, 0.6)',
    },
    modal: {
      confirm_close: true,
      ondismiss: () => {
        if (onDismiss) onDismiss();
      },
    },
    handler: async (response: RazorpayPaymentSuccessResponse) => {
      try {
        await onSuccess(response);
      } catch (err) {
        if (onError) onError(err);
      }
    },
  };

  const rzpInstance = new window.Razorpay(options);

  rzpInstance.on('payment.failed', (response: any) => {
    if (onError) onError(response?.error);
  });

  rzpInstance.open();
}
