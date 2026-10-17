import type { Category, Product, Testimonial, SiteSettings } from './types';

// ═══ Site Settings ═══
export const siteSettings: SiteSettings = {
  free_shipping_threshold: 599,
  shipping_cost: 79,
  whatsapp_number: '919876543210',
  instagram_url: 'https://instagram.com/stitchandyarn.deepa',
  email: 'hello@stitchandyarn.in',
  razorpay_enabled: false,
};

// ═══ Categories ═══
export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Hair Accessories',
    slug: 'hair-accessories',
    description: 'Handcrafted crochet bun sticks, flower rings, scrunchies and pearl-tassel clips that make every hairstyle feel special.',
    image_url: '/products/Evil eye Hair tie.jpeg',
    sort_order: 1,
  },
  {
    id: 'cat-2',
    name: 'Keychains',
    slug: 'keychains',
    description: 'Personalised initial-letter keychains with bow and bead charm — a tiny treasure that\'s uniquely yours.',
    image_url: '/products/Handmade Embroidery hoop with a pink bow.jpeg',
    sort_order: 2,
  },
  {
    id: 'cat-3',
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Crochet flower pots, embroidery hoops and little pieces of warmth for your favourite corners.',
    image_url: '/products/Handmade flower pot.jpeg',
    sort_order: 3,
  },
  {
    id: 'cat-4',
    name: 'Gifting',
    slug: 'gifting',
    description: 'Thoughtful handmade gifts wrapped with love — for birthdays, festivals and "just because" moments.',
    image_url: '/products/Decorative Embroidery Hoop.jpeg',
    sort_order: 4,
  },
];

// ═══ Products ═══
export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Sunflower Hair Bun Stick',
    slug: 'sunflower-hair-bun-stick',
    description: 'A cheerful sunflower bun ring paired with a matching crochet stick — handmade with sunshine-yellow yarn and finished with a tiny pearl center. Perfect for dressing up a messy bun or a sleek updo.',
    price: 349,
    compare_price: 449,
    category_id: 'cat-1',
    is_active: true,
    is_made_to_order: false,
    stock_count: 8,
    processing_days: 3,
    care_instructions: 'Gently hand wash in cold water if needed. Pat dry with a soft cloth and reshape. Avoid pulling the petals — they\'re delicate little things.',
    images: [
      { id: 'img-1', url: '/products/Decorative Embroidery Hoop.jpeg', alt_text: 'Sunflower crochet hair bun stick with pearl center', sort_order: 1, is_primary: true },
      { id: 'img-2', url: '/products/Evil eye Hair tie.jpeg', alt_text: 'Sunflower bun stick styled in hair', sort_order: 2, is_primary: false },
    ],
    variants: [
      { id: 'var-1', name: 'Colour', type: 'color', options: ['Sunshine Yellow', 'Soft Pink', 'Lavender'], price_adjustment: 0 },
    ],
    created_at: '2026-09-01T10:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Blue Bloom Bun Stick with Pearl Tassels',
    slug: 'blue-bloom-bun-stick-pearl-tassels',
    description: 'A ring of tiny blue and teal crochet flowers wraps around your bun, with pearl-strand tassels that sway softly. The matching stick holds everything in place with quiet grace.',
    price: 499,
    category_id: 'cat-1',
    is_active: true,
    is_made_to_order: true,
    stock_count: 0,
    processing_days: 5,
    care_instructions: 'Handle the pearl tassels with care. Store flat to keep the strand shape. Avoid water on the bead section.',
    images: [
      { id: 'img-3', url: '/products/Evil eye Hair tie.jpeg', alt_text: 'Blue bloom crochet bun stick with pearl tassels', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-2', name: 'Colour', type: 'color', options: ['Ocean Blues', 'Rose Pinks', 'Sage Greens'], price_adjustment: 0 },
    ],
    created_at: '2026-09-05T10:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Personalised Initial Keychain',
    slug: 'personalised-initial-keychain',
    description: 'Your initial, crocheted by hand, paired with a pretty bow and rose-quartz bead charm. Choose your letter, pick a colour, and carry a little piece of love everywhere.',
    price: 299,
    compare_price: 399,
    category_id: 'cat-2',
    is_active: true,
    is_made_to_order: true,
    stock_count: 0,
    processing_days: 4,
    care_instructions: 'Keep away from water. If it gets dusty, a quick brush with a dry cloth will do. The beads are strung securely but treat them gently.',
    images: [
      { id: 'img-5', url: '/products/Handmade Embroidery hoop with a pink bow.jpeg', alt_text: 'Personalised crochet initial R keychain with pink bow and bead charm', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-3', name: 'Colour', type: 'color', options: ['Hot Pink', 'Baby Blue', 'Mint Green', 'Lavender', 'Coral'], price_adjustment: 0 },
    ],
    created_at: '2026-09-10T10:00:00Z',
  },
  {
    id: 'prod-4',
    name: 'Crochet Flower Pot — Spring Blooms',
    slug: 'crochet-flower-pot-spring-blooms',
    description: 'A pot full of forever flowers — pink and lavender crochet blooms with green leaves, sitting in a handmade cream pot. No watering needed. Just love.',
    price: 699,
    compare_price: 899,
    category_id: 'cat-3',
    is_active: true,
    is_made_to_order: true,
    stock_count: 0,
    processing_days: 7,
    care_instructions: 'Dust gently with a soft brush. Keep away from direct sunlight to prevent colour fading. These flowers last forever — treat them like the little artwork they are.',
    images: [
      { id: 'img-7', url: '/products/Handmade flower pot.jpeg', alt_text: 'Crochet flower pot with pink and lavender blooms in cream pot', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-5', name: 'Size', type: 'size', options: ['Small (5 flowers)', 'Medium (8 flowers)', 'Large (12 flowers)'], price_adjustment: 0 },
    ],
    created_at: '2026-09-15T10:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Floral Crochet Bracelet',
    slug: 'floral-crochet-bracelet',
    description: 'A dainty bracelet of tiny crochet flowers linked together — lightweight, comfortable, and full of handmade charm. Adjustable closure fits most wrists.',
    price: 249,
    category_id: 'cat-1',
    is_active: true,
    is_made_to_order: false,
    stock_count: 12,
    processing_days: 3,
    care_instructions: 'Remove before washing hands or showering. Store flat in a dry place. The yarn is soft but sturdy — it\'ll last beautifully if you\'re gentle with it.',
    images: [
      { id: 'img-9', url: '/products/Floral bracelet.jpeg', alt_text: 'Green and white crochet floral bracelet', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-6', name: 'Colour', type: 'color', options: ['Forest Green', 'Blush Pink', 'White & Gold'], price_adjustment: 0 },
    ],
    created_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Decorative Embroidery Hoop',
    slug: 'decorative-embroidery-hoop',
    description: 'A miniature embroidery hoop wrapped with crochet flowers — hang it on your wall, on a door knob, or tuck it into a bookshelf. A warm little accent for any space.',
    price: 449,
    category_id: 'cat-3',
    is_active: true,
    is_made_to_order: false,
    stock_count: 5,
    processing_days: 3,
    care_instructions: 'Dust gently. Avoid damp areas. The hoop is wrapped tightly, but please don\'t pull at the yarn — it\'s holding all the prettiness together.',
    images: [
      { id: 'img-11', url: '/products/Decorative Embroidery Hoop.jpeg', alt_text: 'Decorative crochet embroidery hoop with flowers', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-7', name: 'Style', type: 'style', options: ['Wildflowers', 'Roses', 'Sunflowers'], price_adjustment: 0 },
    ],
    created_at: '2026-09-25T10:00:00Z',
  },
];

// ═══ Testimonials ═══
export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Priya M.',
    location: 'Mumbai',
    text: 'The flower pot is the prettiest thing in my room now. My mom thought it was real until she touched it! Deepa\'s work is pure magic.',
    rating: 5,
    product_name: 'Crochet Flower Pot',
    avatar_initial: 'P',
  },
  {
    id: 'test-2',
    name: 'Ananya S.',
    location: 'Bangalore',
    text: 'Got my initial keychain as a birthday gift and I\'ve been carrying it everywhere since. The colours are gorgeous and the packaging was so thoughtful.',
    rating: 5,
    product_name: 'Initial Keychain',
    avatar_initial: 'A',
  },
  {
    id: 'test-3',
    name: 'Ritu K.',
    location: 'Delhi',
    text: 'I wear the bun stick almost every day. People keep asking where I got it from! The pearl tassels are my favourite detail.',
    rating: 5,
    product_name: 'Bun Stick',
    avatar_initial: 'R',
  },
  {
    id: 'test-4',
    name: 'Kavitha D.',
    location: 'Chennai',
    text: 'Ordered four keychains for my bridesmaids. Everyone loved them! Deepa even added a tiny heart tag. Such a lovely personal touch.',
    rating: 5,
    product_name: 'Personalised Keychains',
    avatar_initial: 'K',
  },
];

// Helper to get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

// Helper to get products by category
export function getProductsByCategory(categorySlug: string): Product[] {
  const cat = categories.find(c => c.slug === categorySlug);
  if (!cat) return [];
  return products.filter(p => p.category_id === cat.id && p.is_active);
}

// Helper to get category by id
export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id);
}

// Format price in INR
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
