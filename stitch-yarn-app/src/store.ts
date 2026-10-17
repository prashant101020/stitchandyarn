import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, PersonalisationData } from './types';
import { siteSettings } from './data';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  couponDiscount: number;
  giftNote: string;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    product: Product,
    quantity: number,
    variantSelections: Record<string, string>,
    personalisation: PersonalisationData
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string, discount: number) => void;
  clearCoupon: () => void;
  setGiftNote: (note: string) => void;

  // Computed-style getters
  getItemCount: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTotal: () => number;
}

// Generate a unique ID for cart items based on product + variant + personalisation
function generateCartItemId(
  productId: string,
  variants: Record<string, string>,
  personalisation: PersonalisationData
): string {
  const variantKey = Object.entries(variants).sort().map(([k, v]) => `${k}:${v}`).join('|');
  const personKey = Object.entries(personalisation).filter(([, v]) => v).sort().map(([k, v]) => `${k}:${v}`).join('|');
  return `${productId}__${variantKey}__${personKey}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: '',
      couponDiscount: 0,
      giftNote: '',

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity, variantSelections, personalisation) => {
        const id = generateCartItemId(product.id, variantSelections, personalisation);
        const items = get().items;
        const existing = items.find(item => item.id === id);

        if (existing) {
          set({
            items: items.map(item =>
              item.id === id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id,
                product,
                variant_selections: variantSelections,
                personalisation,
                quantity,
                unit_price: product.price,
              },
            ],
          });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter(item => item.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [], couponCode: '', couponDiscount: 0, giftNote: '' }),

      setCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      clearCoupon: () => set({ couponCode: '', couponDiscount: 0 }),
      setGiftNote: (note) => set({ giftNote: note }),

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0),

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= siteSettings.free_shipping_threshold ? 0 : siteSettings.shipping_cost;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShipping();
        const discount = get().couponDiscount;
        return Math.max(0, subtotal - discount + shipping);
      },
    }),
    {
      name: 'stitch-yarn-cart',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
        giftNote: state.giftNote,
      }),
    }
  )
);
