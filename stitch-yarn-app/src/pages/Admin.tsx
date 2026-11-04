import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, ShoppingBag, Tag, Plus, Edit3, Trash2, Search,
  Download, LogIn, LogOut, BarChart3,
  X, Check, Image as ImageIcon, Save, MapPin, Phone, Mail,
  RefreshCw, ExternalLink, RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { products as mockProducts, categories, formatPrice } from '@/data';
import type { Product, OrderStatus, Order } from '@/types';
import {
  getAllOrdersForAdmin,
  updateOrderStatusInDb,
  softDeleteOrderInDb,
  restoreOrderInDb,
  verifyAdminLogin,
  checkIsAdmin,
  signOutAdmin,
} from '@/lib/supabase';

// ═══ Mock admin data ═══
const mockOrders = [
  {
    id: 'ord-1', order_number: 'SY-20261010-001',
    customer_name: 'Priya Mehta', customer_phone: '9876543210',
    total: 649, status: 'making' as OrderStatus,
    items: [{ name: 'Sunflower Hair Bun Stick', qty: 1, personalisation: '' }],
    created_at: '2026-10-10T14:30:00Z',
  },
  {
    id: 'ord-2', order_number: 'SY-20261011-002',
    customer_name: 'Ananya Srinivas', customer_phone: '9123456789',
    total: 598, status: 'new' as OrderStatus,
    items: [{ name: 'Personalised Initial Keychain', qty: 2, personalisation: 'Letters: A, R' }],
    created_at: '2026-10-11T09:15:00Z',
  },
  {
    id: 'ord-3', order_number: 'SY-20261009-003',
    customer_name: 'Kavitha Desai', customer_phone: '9988776655',
    total: 699, status: 'shipped' as OrderStatus,
    items: [{ name: 'Crochet Flower Pot — Spring Blooms', qty: 1, personalisation: '' }],
    created_at: '2026-10-09T16:45:00Z',
  },
];

type Tab = 'dashboard' | 'products' | 'orders' | 'coupons';

const statusColors: Record<OrderStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-amber-100 text-amber-700',
  making: 'bg-purple-100 text-purple-700',
  shipped: 'bg-teal-100 text-teal-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusFlow: OrderStatus[] = ['new', 'confirmed', 'making', 'shipped', 'delivered'];

export function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersView, setOrdersView] = useState<'active' | 'deleted'>('active');
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [adminProducts, setAdminProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // Validate session on mount
  useEffect(() => {
    async function verifyAdminSession() {
      const stored = localStorage.getItem('stitch_yarn_admin_session') === 'true';
      if (stored) {
        const hasAccess = await checkIsAdmin();
        if (hasAccess) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          try {
            localStorage.removeItem('stitch_yarn_admin_session');
          } catch {
            // Ignore
          }
        }
      } else {
        setIsLoggedIn(false);
      }
      setAuthChecking(false);
    }
    verifyAdminSession();
  }, []);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await getAllOrdersForAdmin();
      if (res.orders && res.orders.length > 0) {
        setOrders(res.orders);
      } else {
        setOrders(mockOrders as unknown as Order[]);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  // Loading spinner while verifying credentials
  if (authChecking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-medium text-cocoa">Verifying admin credentials...</p>
        </div>
      </main>
    );
  }

  // Login screen
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-cream px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <img src="/logo.jpeg" alt="Stitch & Yarn" className="h-16 mx-auto rounded-full mb-4 shadow-soft" />
            <h1 className="font-heading text-2xl font-semibold text-cocoa">Admin Portal</h1>
            <p className="text-sm text-cocoa-light mt-1">Manage orders, items & customer updates</p>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email || !password) {
                toast.error('Please enter email and password');
                return;
              }
              setLoginLoading(true);
              const res = await verifyAdminLogin(email, password);
              setLoginLoading(false);

              if (res.success) {
                setIsLoggedIn(true);
                try {
                  localStorage.setItem('stitch_yarn_admin_session', 'true');
                } catch {
                  // Ignore
                }
                toast.success('Welcome back, Deepa! 💕');
              } else {
                toast.error(res.error || 'Invalid credentials');
              }
            }}
            className="bg-surface rounded-3xl p-6 sm:p-8 border border-rose-line/30 shadow-card space-y-4"
          >
            <div>
              <label htmlFor="admin-email" className="label-caps text-cocoa-light block mb-1.5">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deepa@stitchandyarn.in"
                className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa focus:border-primary focus:outline-none text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="label-caps text-cocoa-light block mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa focus:border-primary focus:outline-none text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="btn btn-primary w-full justify-center py-3 text-sm font-semibold shadow-soft"
            >
              {loginLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} /> Sign In as Admin
                </>
              )}
            </button>
          </form>
          <div className="mt-4 p-3 bg-blush-light/40 border border-rose-line/20 rounded-2xl text-center text-xs text-cocoa-light">
            <p>Admin credentials can be managed directly in Supabase Auth or SQL.</p>
          </div>
        </motion.div>
      </main>
    );
  }

  const filteredProducts = adminProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeOrders = orders.filter((o) => !o.is_deleted);
  const deletedOrders = orders.filter((o) => o.is_deleted);
  const displayedOrders = ordersView === 'active' ? activeOrders : deletedOrders;

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic state update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order status updated to "${newStatus}"! ✨`);
    await updateOrderStatusInDb(orderId, newStatus);
  };

  const handleDeleteOrder = async (orderId: string) => {
    setIsDeleting(true);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.order_number === orderId
          ? { ...o, is_deleted: true, deleted_at: new Date().toISOString() }
          : o
      )
    );
    toast.success('Order deleted from active list');
    setOrderToDelete(null);
    setIsDeleting(false);
    await softDeleteOrderInDb(orderId);
  };

  const handleRestoreOrder = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.order_number === orderId
          ? { ...o, is_deleted: false, deleted_at: undefined }
          : o
      )
    );
    toast.success('Order restored to active orders ✨');
    await restoreOrderInDb(orderId);
  };

  const exportOrdersCSV = () => {
    const headers = ['Order ID', 'Customer', 'Phone', 'Email', 'Address', 'Items', 'Total', 'Status', 'Date'];
    const rows = (ordersView === 'active' ? activeOrders : orders).map(o => {
      const itemsList = o.items || o.order_items || [];
      const addr = `${o.address_line1 || o.address?.address_line1 || ''}, ${o.city || o.address?.city || ''} ${o.pincode || o.address?.pincode || ''}`;
      return [
        o.order_number,
        o.customer_name,
        o.customer_phone,
        o.customer_email || '',
        addr,
        itemsList.map(i => `${i.product_name || i.name} x${i.quantity || i.qty || 1}`).join('; '),
        o.total,
        o.is_deleted ? 'DELETED' : o.status,
        new Date(o.created_at).toLocaleDateString('en-IN'),
      ];
    });
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Orders exported!');
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
    { key: 'products', label: 'Products', icon: <Package size={18} /> },
    { key: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
    { key: 'coupons', label: 'Coupons', icon: <Tag size={18} /> },
  ];

  return (
    <main className="min-h-screen bg-cream">
      {/* Admin header */}
      <header className="bg-cocoa text-cream sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="" className="h-8 rounded-full" />
            <span className="font-heading text-lg hidden sm:inline">Admin Panel</span>
          </div>
          <button
            onClick={async () => {
              await signOutAdmin();
              setIsLoggedIn(false);
              toast.success('Signed out of Admin Panel');
            }}
            className="flex items-center gap-2 text-sm text-cream/70 hover:text-cream transition-colors"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tab navigation — scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-cream shadow-glow'
                  : 'bg-surface text-cocoa-light hover:bg-cream-dark'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ Dashboard Tab ═══ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: 'Total Orders',
                  value: orders.length.toString(),
                  color: 'text-primary',
                  subtitle: deletedOrders.length > 0 ? `${activeOrders.length} active · ${deletedOrders.length} deleted` : undefined,
                },
                {
                  label: 'Active Revenue',
                  value: formatPrice(activeOrders.reduce((s, o) => s + o.total, 0)),
                  color: 'text-sage',
                },
                {
                  label: 'Products',
                  value: adminProducts.length.toString(),
                  color: 'text-gold',
                },
                {
                  label: 'Pending Orders',
                  value: activeOrders.filter(o => o.status === 'new').length.toString(),
                  color: 'text-primary',
                },
              ].map(stat => (
                <div key={stat.label} className="bg-surface rounded-2xl p-5 border border-rose-line/20 shadow-soft">
                  <p className="label-caps text-cocoa-light text-xs">{stat.label}</p>
                  <p className={`font-heading text-2xl font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-[0.7rem] text-cocoa-light mt-1 font-medium">{stat.subtitle}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-rose-line/20 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-medium text-cocoa">Recent Orders</h3>
                {deletedOrders.length > 0 && (
                  <span className="text-xs text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full font-medium">
                    {deletedOrders.length} deleted order{deletedOrders.length > 1 ? 's' : ''} tracked
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {orders.slice(0, 8).map(order => (
                  <div
                    key={order.id}
                    className={`flex items-center justify-between py-2.5 border-b border-rose-line/10 last:border-0 ${
                      order.is_deleted ? 'bg-red-50/40 -mx-2 px-2 rounded-lg' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${order.is_deleted ? 'line-through text-cocoa-light/70' : 'text-cocoa'}`}>
                          {order.customer_name}
                        </p>
                        {order.is_deleted && (
                          <span className="text-[0.65rem] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-1.5 py-0.2 rounded border border-red-200 flex items-center gap-0.5">
                            <Trash2 size={10} /> Deleted
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-cocoa-light">{order.order_number} · {formatPrice(order.total)}</p>
                    </div>
                    {order.is_deleted ? (
                      <span className="badge bg-red-100 text-red-700 border border-red-200 font-semibold text-xs">
                        DELETED
                      </span>
                    ) : (
                      <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ Products Tab ═══ */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa-light" />
                <input
                  type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-rose-line/30 bg-surface text-cocoa text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <button
                onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                className="btn btn-primary text-sm"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* Product list */}
            <div className="bg-surface rounded-2xl border border-rose-line/20 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-rose-line/15">
                      <th className="text-left p-4 label-caps text-cocoa-light font-semibold">Product</th>
                      <th className="text-left p-4 label-caps text-cocoa-light font-semibold hidden md:table-cell">Category</th>
                      <th className="text-right p-4 label-caps text-cocoa-light font-semibold">Price</th>
                      <th className="text-center p-4 label-caps text-cocoa-light font-semibold">Stock</th>
                      <th className="text-right p-4 label-caps text-cocoa-light font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => {
                      const cat = categories.find(c => c.id === product.category_id);
                      return (
                        <tr key={product.id} className="border-b border-rose-line/10 last:border-0 hover:bg-cream/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={product.images[0]?.url} alt="" className="w-10 h-12 object-cover rounded-lg" />
                              <div>
                                <p className="font-medium text-cocoa">{product.name}</p>
                                <p className="text-xs text-cocoa-light md:hidden">{cat?.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-cocoa-light hidden md:table-cell">{cat?.name}</td>
                          <td className="p-4 text-right font-medium text-cocoa">{formatPrice(product.price)}</td>
                          <td className="p-4 text-center">
                            {product.is_made_to_order ? (
                              <span className="badge badge-gold">MTO</span>
                            ) : product.stock_count > 0 ? (
                              <span className="text-sage font-medium">{product.stock_count}</span>
                            ) : (
                              <span className="text-red-400 font-medium">0</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <button
                                onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                                className="p-2 rounded-lg hover:bg-cream-dark transition-colors"
                                aria-label={`Edit ${product.name}`}
                              >
                                <Edit3 size={14} className="text-cocoa-light" />
                              </button>
                              <button
                                onClick={() => {
                                  setAdminProducts(prev => prev.filter(p => p.id !== product.id));
                                  toast.success('Product removed');
                                }}
                                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                aria-label={`Delete ${product.name}`}
                              >
                                <Trash2 size={14} className="text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Form Modal */}
            <AnimatePresence>
              {showProductForm && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-cocoa/40 backdrop-blur-sm z-50"
                    onClick={() => setShowProductForm(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                    className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-surface rounded-2xl shadow-elevated z-50 overflow-y-auto max-h-[90vh]"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-heading text-xl font-medium text-cocoa">
                          {editingProduct ? 'Edit Product' : 'Add Product'}
                        </h2>
                        <button onClick={() => setShowProductForm(false)} className="p-2 hover:bg-cream-dark rounded-lg">
                          <X size={18} />
                        </button>
                      </div>

                      <form onSubmit={e => {
                        e.preventDefault();
                        toast.success(editingProduct ? 'Product updated!' : 'Product added!');
                        setShowProductForm(false);
                      }} className="space-y-4">
                        <div>
                          <label className="label-caps text-cocoa-light block mb-1.5">Product Name</label>
                          <input
                            defaultValue={editingProduct?.name || ''}
                            required placeholder="e.g., Sunflower Hair Bun Stick"
                            className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa text-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="label-caps text-cocoa-light block mb-1.5">Description</label>
                          <textarea
                            defaultValue={editingProduct?.description || ''}
                            rows={3} placeholder="Describe your handmade piece..."
                            className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa text-sm focus:border-primary focus:outline-none resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="label-caps text-cocoa-light block mb-1.5">Price (₹)</label>
                            <input
                              type="number" defaultValue={editingProduct?.price || ''}
                              required placeholder="299"
                              className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa text-sm focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="label-caps text-cocoa-light block mb-1.5">Compare Price (₹)</label>
                            <input
                              type="number" defaultValue={editingProduct?.compare_price || ''}
                              placeholder="399"
                              className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa text-sm focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="label-caps text-cocoa-light block mb-1.5">Category</label>
                            <select
                              defaultValue={editingProduct?.category_id || ''}
                              className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa text-sm focus:border-primary focus:outline-none"
                            >
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="label-caps text-cocoa-light block mb-1.5">Stock</label>
                            <input
                              type="number" defaultValue={editingProduct?.stock_count || 0}
                              className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa text-sm focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-sm text-cocoa cursor-pointer">
                            <input type="checkbox" defaultChecked={editingProduct?.is_made_to_order || false} className="accent-primary w-4 h-4" />
                            Made to order
                          </label>
                          <label className="flex items-center gap-2 text-sm text-cocoa cursor-pointer">
                            <input type="checkbox" defaultChecked={editingProduct?.is_active ?? true} className="accent-primary w-4 h-4" />
                            Active
                          </label>
                        </div>

                        <div>
                          <label className="label-caps text-cocoa-light block mb-1.5">Product Images</label>
                          <label className="flex items-center justify-center py-6 border-2 border-dashed border-rose-line/30 rounded-xl bg-cream/50 hover:bg-cream-dark cursor-pointer transition-colors">
                            <ImageIcon size={20} className="text-cocoa-light mr-2" />
                            <span className="text-sm text-cocoa-light">Click to upload images</span>
                            <input type="file" accept="image/*" multiple className="sr-only" />
                          </label>
                        </div>

                        <button type="submit" className="btn btn-primary w-full justify-center mt-4">
                          <Save size={16} /> {editingProduct ? 'Update Product' : 'Add Product'}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ═══ Orders Tab ═══ */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="font-heading text-xl font-medium text-cocoa">
                    Customer Orders
                  </h2>
                  <div className="flex items-center bg-cream-dark/60 p-0.5 rounded-xl border border-rose-line/20 text-xs">
                    <button
                      onClick={() => setOrdersView('active')}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        ordersView === 'active'
                          ? 'bg-surface text-cocoa shadow-soft font-semibold'
                          : 'text-cocoa-light hover:text-cocoa'
                      }`}
                    >
                      Active ({activeOrders.length})
                    </button>
                    {deletedOrders.length > 0 && (
                      <button
                        onClick={() => setOrdersView('deleted')}
                        className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                          ordersView === 'deleted'
                            ? 'bg-red-100 text-red-700 shadow-soft font-semibold'
                            : 'text-cocoa-light hover:text-red-700'
                        }`}
                      >
                        <Trash2 size={12} />
                        Trash ({deletedOrders.length})
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-cocoa-light mt-0.5">
                  {ordersView === 'active'
                    ? "Live active orders. Deleted orders are removed from this list and tracked in Dashboard."
                    : "Archived deleted orders. You can restore any order back to Active anytime."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchOrders}
                  disabled={ordersLoading}
                  className="btn btn-ghost text-sm gap-1.5 border border-rose-line/30 rounded-xl px-3 py-2"
                  title="Refresh orders from database"
                >
                  <RefreshCw size={15} className={ordersLoading ? 'animate-spin' : ''} />
                  Refresh
                </button>
                <button onClick={exportOrdersCSV} className="btn btn-secondary text-sm py-2 px-3 rounded-xl">
                  <Download size={15} /> Export CSV
                </button>
              </div>
            </div>

            {ordersLoading ? (
              <div className="bg-surface rounded-2xl p-12 text-center border border-rose-line/20 shadow-soft">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-cocoa-light">Loading orders from Supabase...</p>
              </div>
            ) : displayedOrders.length === 0 ? (
              <div className="bg-surface rounded-2xl p-12 text-center border border-rose-line/20 shadow-soft">
                <Package size={40} className="text-cocoa-light/40 mx-auto mb-3" />
                <h3 className="font-heading text-lg font-medium text-cocoa">
                  {ordersView === 'active' ? 'No active orders' : 'Trash is empty'}
                </h3>
                <p className="text-sm text-cocoa-light mt-1">
                  {ordersView === 'active'
                    ? 'Orders placed on the website or WhatsApp will appear here.'
                    : 'Deleted orders will appear here if any are removed.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedOrders.map((order) => {
                  const itemsList = order.items || order.order_items || [];
                  const cleanPhone = (order.customer_phone || '').replace(/\D/g, '');
                  const waNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
                  const fullAddress = `${order.address_line1 || order.address?.address_line1 || ''}${
                    order.address_line2 ? ', ' + order.address_line2 : ''
                  }, ${order.city || order.address?.city || ''}, ${order.state || order.address?.state || ''} - ${
                    order.pincode || order.address?.pincode || ''
                  }`;

                  return (
                    <div
                      key={order.id || order.order_number}
                      className="bg-surface rounded-2xl p-5 sm:p-6 border border-rose-line/25 shadow-soft transition-all hover:shadow-card"
                    >
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-line/15">
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono font-bold text-base text-cocoa">
                              {order.order_number}
                            </span>
                            {order.is_deleted ? (
                              <span className="badge bg-red-100 text-red-700 font-bold border border-red-200 text-[0.65rem] flex items-center gap-1">
                                <Trash2 size={10} /> DELETED
                              </span>
                            ) : (
                              <span className={`badge ${statusColors[order.status] || 'badge-sage'}`}>
                                {order.status.toUpperCase()}
                              </span>
                            )}
                            {order.payment_status === 'paid' ? (
                              <span className="badge bg-green-100 text-green-800 text-[0.65rem] font-semibold flex items-center gap-1">
                                <Check size={11} /> PAID ({order.payment_method?.toUpperCase()})
                              </span>
                            ) : (
                              <span className="badge badge-blush text-[0.65rem]">
                                Via {order.payment_method?.toUpperCase()}
                              </span>
                            )}
                            {order.razorpay_payment_id && (
                              <span className="font-mono text-[0.65rem] bg-cream px-2 py-0.5 rounded border border-rose-line/30 text-cocoa-light">
                                Txn: {order.razorpay_payment_id}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-cocoa-light mt-1">
                            Placed on {new Date(order.created_at).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-xs text-cocoa-light">Total Amount</p>
                          <p className="font-heading text-2xl font-bold text-primary">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>

                      {/* Customer Contact & Delivery Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3.5 border-b border-rose-line/15 text-xs text-cocoa">
                        <div className="space-y-1">
                          <p className="label-caps text-cocoa-light text-[0.65rem]">Customer Information</p>
                          <p className="font-semibold text-sm text-cocoa">{order.customer_name}</p>
                          <div className="flex items-center gap-3 pt-0.5">
                            <a
                              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                                `Hi ${order.customer_name}! This is Deepa from Stitch & Yarn regarding your order ${order.order_number} 💕`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-600 font-medium hover:underline"
                            >
                              <Phone size={13} /> {order.customer_phone}
                              <ExternalLink size={11} />
                            </a>
                            {order.customer_email && (
                              <span className="inline-flex items-center gap-1 text-cocoa-light">
                                <Mail size={13} /> {order.customer_email}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="label-caps text-cocoa-light text-[0.65rem]">Delivery Address</p>
                          <p className="flex items-start gap-1.5 text-cocoa-light leading-relaxed">
                            <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                            <span>{fullAddress}</span>
                          </p>
                        </div>
                      </div>

                      {/* Ordered Items Breakdown */}
                      <div className="py-3.5 space-y-2.5">
                        <p className="label-caps text-cocoa-light text-[0.65rem]">
                          Ordered Items ({itemsList.length})
                        </p>
                        <div className="space-y-2">
                          {itemsList.map((item, i) => {
                            const variants = item.variant_selections
                              ? Object.entries(item.variant_selections)
                              : [];
                            const letter =
                              typeof item.personalisation === 'object'
                                ? item.personalisation?.initial_letter
                                : item.personalisation;

                            return (
                              <div
                                key={i}
                                className="flex items-center gap-3 bg-cream/50 rounded-xl p-2.5 border border-rose-line/10 text-xs"
                              >
                                {item.product_image ? (
                                  <img
                                    src={item.product_image}
                                    alt=""
                                    className="w-11 h-13 object-cover rounded-lg shrink-0 border border-rose-line/20"
                                  />
                                ) : (
                                  <div className="w-11 h-13 bg-blush-light rounded-lg flex items-center justify-center text-primary text-base shrink-0">
                                    🧶
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-cocoa text-sm truncate">
                                    {item.product_name || item.name}
                                  </p>
                                  <div className="flex flex-wrap gap-2 text-cocoa-light/80 mt-0.5">
                                    <span className="font-medium text-cocoa">
                                      Quantity: {item.quantity || item.qty || 1}
                                    </span>
                                    {variants.length > 0 && (
                                      <span>• {variants.map(([k, v]) => `${k}: ${v}`).join(', ')}</span>
                                    )}
                                    {letter && (
                                      <span className="text-primary font-medium">• Custom Letter: {letter}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-semibold text-cocoa text-sm">
                                    {formatPrice(
                                      item.total_price || (item.unit_price || 0) * (item.quantity || item.qty || 1)
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Gift Note (if any) */}
                      {order.gift_note && (
                        <div className="mb-3.5 p-3 bg-blush-light/40 border border-rose-line/30 rounded-xl text-xs">
                          <p className="font-semibold text-primary">🎁 Customer Gift Note:</p>
                          <p className="text-cocoa italic mt-0.5">"{order.gift_note}"</p>
                        </div>
                      )}

                      {/* Status Update Flow Control */}
                      <div className="pt-3 border-t border-rose-line/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-cocoa-light font-medium">
                          <span>{order.is_deleted ? 'Archived Actions:' : 'Update Status:'}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {!order.is_deleted && (
                            <>
                              {statusFlow.map((status) => (
                                <button
                                  key={status}
                                  onClick={() => updateOrderStatus(order.id, status)}
                                  disabled={order.status === status}
                                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                                    order.status === status
                                      ? 'bg-primary text-white border-primary shadow-soft cursor-default font-semibold'
                                      : 'border-rose-line/30 bg-surface text-cocoa hover:border-primary hover:text-primary cursor-pointer'
                                  }`}
                                >
                                  {status === 'making' ? '🧶 Making' : status === 'shipped' ? '🚚 Shipped' : status}
                                </button>
                              ))}
                              <button
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                disabled={order.status === 'cancelled'}
                                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                                  order.status === 'cancelled'
                                    ? 'bg-red-600 text-white border-red-600 cursor-default'
                                    : 'border-rose-line/30 text-cocoa-light hover:border-red-400 hover:text-red-600 cursor-pointer'
                                }`}
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {/* Delete from active orders / Restore button */}
                          {order.is_deleted ? (
                            <button
                              onClick={() => handleRestoreOrder(order.id || order.order_number)}
                              className="text-xs px-3 py-1.5 rounded-lg border border-sage/50 text-sage hover:bg-sage/10 font-medium transition-all flex items-center gap-1 cursor-pointer"
                              title="Restore order to active list"
                            >
                              <RotateCcw size={13} />
                              Restore to Active
                            </button>
                          ) : (
                            <button
                              onClick={() => setOrderToDelete(order)}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium transition-all flex items-center gap-1 cursor-pointer ml-auto"
                              title="Delete order from active list"
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Delete Order Confirmation Modal */}
            <AnimatePresence>
              {orderToDelete && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-cocoa/40 backdrop-blur-sm z-50"
                    onClick={() => setOrderToDelete(null)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-surface rounded-2xl shadow-elevated z-50 p-6 border border-rose-line/30"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
                      <Trash2 size={24} />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-cocoa text-center mb-2">
                      Delete Order {orderToDelete.order_number}?
                    </h3>
                    <p className="text-sm text-cocoa-light text-center leading-relaxed mb-6">
                      This order for <strong className="text-cocoa">{orderToDelete.customer_name}</strong> ({formatPrice(orderToDelete.total)}) will be hidden from the active Orders list, but will remain visible as <span className="font-semibold text-red-700">DELETED</span> in your Dashboard summary.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setOrderToDelete(null)}
                        disabled={isDeleting}
                        className="btn btn-secondary flex-1 py-2.5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(orderToDelete.id || orderToDelete.order_number)}
                        disabled={isDeleting}
                        className="btn bg-red-600 hover:bg-red-700 text-white flex-1 py-2.5 font-medium shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Trash2 size={15} />
                        {isDeleting ? 'Deleting...' : 'Yes, Delete Order'}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ═══ Coupons Tab ═══ */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-medium text-cocoa">Coupons</h2>
              <button className="btn btn-primary text-sm">
                <Plus size={16} /> Add Coupon
              </button>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-rose-line/20 shadow-soft">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-cream rounded-xl">
                  <div>
                    <p className="font-mono font-semibold text-cocoa text-lg">FIRST10</p>
                    <p className="text-xs text-cocoa-light mt-0.5">10% off · No minimum · Active</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-sage">Active</span>
                    <button className="p-2 hover:bg-cream-dark rounded-lg">
                      <Edit3 size={14} className="text-cocoa-light" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-cream rounded-xl">
                  <div>
                    <p className="font-mono font-semibold text-cocoa text-lg">WELCOME50</p>
                    <p className="text-xs text-cocoa-light mt-0.5">₹50 off · Min ₹499 · Active</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-sage">Active</span>
                    <button className="p-2 hover:bg-cream-dark rounded-lg">
                      <Edit3 size={14} className="text-cocoa-light" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
