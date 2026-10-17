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
    description: 'Handcrafted crochet bun sticks, scrunchies, flower hair clips, hairbands and floral gajras.',
    image_url: '/products/Hair Band Dark Pink.jpeg',
    sort_order: 1,
  },
  {
    id: 'cat-2',
    name: 'Keychains',
    slug: 'keychains',
    description: 'Personalised initial-letter crochet keychains and floral bag charms made with love.',
    image_url: '/products/Alphabet Key chain.jpeg',
    sort_order: 2,
  },
  {
    id: 'cat-3',
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Crochet flower pots and charming handmade accents for your favourite cosy spaces.',
    image_url: '/products/Handmade flower pot.jpeg',
    sort_order: 3,
  },
  {
    id: 'cat-4',
    name: 'Jewellery & Festive',
    slug: 'jewellery-festive',
    description: 'Festive Navratri hair tassels, boho neck collars, bracelets and festive accessories.',
    image_url: '/products/Boho (Navratri Special).jpeg',
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
    price: 249,
    compare_price: 449,
    category_id: 'cat-1',
    is_active: true,
    is_made_to_order: false,
    stock_count: 8,
    processing_days: 3,
    care_instructions: 'Gently hand wash in cold water if needed. Pat dry with a soft cloth and reshape. Avoid pulling the petals — they\'re delicate little things.',
    images: [
      { id: 'img-1', url: '/products/Decorative Embroidery Hoop.jpeg', alt_text: 'Sunflower crochet hair bun stick with pearl center', sort_order: 1, is_primary: true },
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
    price: 249,
    category_id: 'cat-1',
    is_active: true,
    is_made_to_order: true,
    stock_count: 5,
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
    name: 'Personalised Initial Keychain with Bow',
    slug: 'personalised-initial-keychain',
    description: 'Your initial, crocheted by hand, paired with a pretty bow and rose-quartz bead charm. Choose your letter, pick a colour, and carry a little piece of love everywhere.',
    price: 249,
    compare_price: 299,
    category_id: 'cat-2',
    is_active: true,
    is_made_to_order: true,
    stock_count: 10,
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
    price: 449,
    compare_price: 899,
    category_id: 'cat-3',
    is_active: true,
    is_made_to_order: true,
    stock_count: 6,
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
    name: 'Floral Crochet Gajra & Wristlet',
    slug: 'floral-crochet-gajra-wristlet',
    description: 'A lush white and green crochet floral gajra with delicate pom-pom ties. Wear it gracefully around your hair bun or as an ethnic wrist bracelet for festive celebrations.',
    price: 149,
    category_id: 'cat-1',
    is_active: true,
    is_made_to_order: false,
    stock_count: 12,
    processing_days: 3,
    care_instructions: 'Gently hand wash in cold water if needed and air dry flat. Store in a cool, dry pouch.',
    images: [
      { id: 'img-9', url: '/products/Floral bracelet.jpeg', alt_text: 'Green and white crochet floral gajra and bracelet', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-6', name: 'Colour', type: 'color', options: ['Emerald Green & White', 'Crimson & Cream', 'Rose Pink & White'], price_adjustment: 0 },
    ],
    created_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Crochet Alphabet Initial Keychain',
    slug: 'crochet-alphabet-initial-keychain',
    description: 'Chunky, two-toned handcrafted crochet alphabet keychain. Choose any letter of your choice with high-density premium yarn and sturdy silver metal keyring.',
    price: 99,
    compare_price: 329,
    category_id: 'cat-2',
    is_active: true,
    is_made_to_order: true,
    stock_count: 15,
    processing_days: 3,
    care_instructions: 'Spot clean with a damp cloth. Keep keyring dry to preserve shine.',
    images: [
      { id: 'img-12', url: '/products/Alphabet Key chain.jpeg', alt_text: 'Handmade crochet letter R alphabet keychain', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-8', name: 'Colour', type: 'color', options: ['Red & White', 'Pink & White', 'Navy & Cream', 'Pastel Lilac'], price_adjustment: 0 },
    ],
    created_at: '2026-10-01T10:00:00Z',
  },
  {
    id: 'prod-7',
    name: 'Boho Festive Hair Paranda / Tassels',
    slug: 'boho-festive-hair-paranda-tassels',
    description: 'Eye-catching Navratri special braided hair paranda featuring vibrant multicolour threads, cowrie shells, and gentle mini golden ghungroos / bells. Perfect for Garba, Dandiya, and weddings.',
    price: 99,
    compare_price: 499,
    category_id: 'cat-4',
    is_active: true,
    is_made_to_order: false,
    stock_count: 10,
    processing_days: 3,
    care_instructions: 'Keep away from water to preserve the golden bells and shells. Hang or store flat when not in use.',
    images: [
      { id: 'img-13', url: '/products/Boho (Navratri Special).jpeg', alt_text: 'Boho Navratri special braided hair tassels with cowrie shells and bells', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-9', name: 'Colour Theme', type: 'style', options: ['Multicolour Fiesta', 'Pink & Red Festive', 'Peacock Hues'], price_adjustment: 0 },
    ],
    created_at: '2026-10-05T10:00:00Z',
  },
  {
    id: 'prod-8',
    name: 'Crochet Flower Charm Keychain',
    slug: 'crochet-flower-charm-keychain',
    description: 'Charming pastel puff flower keychain finished with a golden bead center and durable silver chain. Ideal for tote bags, car keys, or backpacks.',
    price: 99,
    compare_price: 249,
    category_id: 'cat-2',
    is_active: true,
    is_made_to_order: false,
    stock_count: 14,
    processing_days: 2,
    care_instructions: 'Gently wipe with a soft dry cloth. Keep metal components moisture-free.',
    images: [
      { id: 'img-14', url: '/products/Bow 79.jpeg', alt_text: 'Pastel pink crochet flower keychain with golden center bead', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-10', name: 'Colour', type: 'color', options: ['Baby Pink', 'Lavender', 'Butter Yellow', 'Mint'], price_adjustment: 0 },
    ],
    created_at: '2026-10-08T10:00:00Z',
  },
  {
    id: 'prod-9',
    name: 'Pearl Accent Crochet Bow Clip — Light Pink',
    slug: 'pearl-accent-crochet-bow-clip-light-pink',
    description: 'Soft baby pink ribbed crochet hair bow adorned with a lustrous faux pearl center. Backed with a snag-free alligator hair clip for secure grip.',
    price: 79,
    compare_price: 249,
    category_id: 'cat-1',
    is_active: true,
    is_made_to_order: false,
    stock_count: 12,
    processing_days: 2,
    care_instructions: 'Spot clean gently with a damp cloth. Avoid submerging the metal clip in water.',
    images: [
      { id: 'img-15', url: '/products/Bow Light Pink.jpeg', alt_text: 'Baby pink crochet hair bow clip with center pearl', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-11', name: 'Attachment', type: 'style', options: ['Alligator Clip', 'French Barrette', 'Hair Elastic'], price_adjustment: 0 },
    ],
    created_at: '2026-10-10T10:00:00Z',
  },
  {
    id: 'prod-10',
    name: 'Crochet Hair Bow Clip — Magenta Pink',
    slug: 'crochet-hair-bow-clip-magenta-pink',
    description: 'Bold and charming magenta pink textured crochet bow. Elevates half-up hairstyles, ponytails, and casual outfits effortlessly.',
    price: 99,
    compare_price: 249,
    category_id: 'cat-1',
    is_active: true,
    is_made_to_order: false,
    stock_count: 10,
    processing_days: 2,
    care_instructions: 'Spot clean only. Store flat in your accessory box to preserve the bow shape.',
    images: [
      { id: 'img-16', url: '/products/Hair Band Dark Pink.jpeg', alt_text: 'Magenta pink chunky crochet hair bow clip', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-12', name: 'Attachment', type: 'style', options: ['Alligator Clip', 'French Barrette', 'Hair Elastic'], price_adjustment: 0 },
    ],
    created_at: '2026-10-11T10:00:00Z',
  },
  {
    id: 'prod-11',
    name: 'Cascading Blossom Hair Gajra',
    slug: 'cascading-blossom-hair-gajra',
    description: 'An elegant handmade hair ornament featuring an ivory flower with pearl center, green foliage accents, and twin cascading pink blossom strands. Perfect for festive updos and traditional functions.',
    price: 199,
    compare_price: 449,
    category_id: 'cat-1',
    is_active: true,
    is_made_to_order: true,
    stock_count: 8,
    processing_days: 4,
    care_instructions: 'Store flat in a dry box. Do not wash or press with heavy items.',
    images: [
      { id: 'img-17', url: '/products/Gajara.jpeg', alt_text: 'Handmade crochet hair gajra with twin pink flower cascades and ivory flower', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-13', name: 'Colour', type: 'color', options: ['Blush Pink & Ivory', 'Crimson Red & Ivory', 'Golden Yellow & Ivory'], price_adjustment: 0 },
    ],
    created_at: '2026-10-12T10:00:00Z',
  },
  {
    id: 'prod-12',
    name: 'Scalloped Pearl Crochet Hairband',
    slug: 'scalloped-pearl-crochet-hairband',
    description: 'Intricately scalloped hot pink crochet headband adorned with studded faux pearls and comfortable adjustable tie-back ribbons with pom-pom ends.',
    price: 199,
    compare_price: 379,
    category_id: 'cat-1',
    is_active: true,
    is_made_to_order: false,
    stock_count: 7,
    processing_days: 3,
    care_instructions: 'Hand wash gently in lukewarm water with mild soap. Lay flat on a towel to dry.',
    images: [
      { id: 'img-18', url: '/products/Hair Band.jpeg', alt_text: 'Scalloped hot pink crochet headband with pearl details', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-14', name: 'Colour', type: 'color', options: ['Hot Pink', 'Lavender', 'Cream Ivory'], price_adjustment: 0 },
    ],
    created_at: '2026-10-13T10:00:00Z',
  },
  {
    id: 'prod-13',
    name: 'Blooming Pearl Floral Hair Scrunchie',
    slug: 'blooming-pearl-floral-hair-scrunchie',
    description: 'A vibrant pink blooming flower with emerald leaves and pearl accents fixed securely to a durable elastic hair band. Gentle on hair with zero tugging.',
    price: 59,
    compare_price: 229,
    category_id: 'cat-1',
    is_active: true,
    is_made_to_order: false,
    stock_count: 15,
    processing_days: 2,
    care_instructions: 'Gentle spot clean. Do not over-stretch the base elastic when washing.',
    images: [
      { id: 'img-19', url: '/products/Hair_Band.jpeg', alt_text: 'Crochet flower hair tie with pearl accents on black elastic band', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-15', name: 'Colour', type: 'color', options: ['Deep Rose', 'Sunshine Yellow', 'Cornflower Blue'], price_adjustment: 0 },
    ],
    created_at: '2026-10-14T10:00:00Z',
  },
  {
    id: 'prod-14',
    name: 'Festive Cowrie Shell Crochet Choker',
    slug: 'festive-cowrie-shell-crochet-choker',
    description: 'Stunning festive crochet neckpiece handcrafted in rich vermilion red with openwork lace scallops, colourful cowrie shells, and braided tie cords with fluffy yarn tassels.',
    price: 199,
    compare_price: 549,
    category_id: 'cat-4',
    is_active: true,
    is_made_to_order: true,
    stock_count: 6,
    processing_days: 4,
    care_instructions: 'Keep away from moisture, perfumes, and sprays. Store flat in an airtight pouch.',
    images: [
      { id: 'img-20', url: '/products/Neck Accessories.jpeg', alt_text: 'Festive red crochet choker necklace with colourful shells and tassels', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-16', name: 'Colour', type: 'color', options: ['Festive Red', 'Black & Silver', 'Royal Blue'], price_adjustment: 0 },
    ],
    created_at: '2026-10-15T10:00:00Z',
  },
  {
    id: 'prod-15',
    name: 'Handcrafted Crimson Rose Hair Clip',
    slug: 'handcrafted-crimson-rose-hair-clip',
    description: 'A layered velvety-red crochet rose nestled in dark green foliage. Adds an elegant touch of romantic vintage charm to any hairstyle.',
    price: 149,
    compare_price: 299,
    category_id: 'cat-1',
    is_active: true,
    is_made_to_order: false,
    stock_count: 11,
    processing_days: 2,
    care_instructions: 'Store safely in a jewellery pouch. Avoid crushing petals under heavy items.',
    images: [
      { id: 'img-21', url: '/products/Rose Hair Clip.jpeg', alt_text: 'Detailed crimson red crochet rose hair clip with green leaves', sort_order: 1, is_primary: true },
    ],
    variants: [
      { id: 'var-17', name: 'Clip Type', type: 'style', options: ['Alligator Clip', 'Brooch Pin', 'Bobby Pin Pair'], price_adjustment: 0 },
    ],
    created_at: '2026-10-16T10:00:00Z',
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
