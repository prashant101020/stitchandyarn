import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, ShoppingBag, Tag, Plus, Edit3, Trash2, Search,
  ChevronDown, Download, Eye, LogIn, LogOut, Settings, BarChart3,
  X, Check, Image as ImageIcon, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { products as mockProducts, categories, formatPrice } from '@/data';
import type { Product, OrderStatus } from '@/types';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [orders, setOrders] = useState(mockOrders);
  const [adminProducts, setAdminProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // Login screen
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-cream px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <img src="/logo.jpeg" alt="Stitch & Yarn" className="h-16 mx-auto rounded-full mb-4" />
            <h1 className="font-heading text-2xl font-semibold text-cocoa">Admin Login</h1>
            <p className="text-sm text-cocoa-light mt-1">Manage your shop, orders & products</p>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              // Demo login — in production, use Supabase Auth
              if (email && password) {
                setIsLoggedIn(true);
                toast.success('Welcome back, Deepa! 💕');
              } else {
                toast.error('Please enter email and password');
              }
            }}
            className="bg-surface rounded-2xl p-6 border border-rose-line/20 shadow-card space-y-4"
          >
            <div>
              <label htmlFor="admin-email" className="label-caps text-cocoa-light block mb-1.5">Email</label>
              <input
                id="admin-email" type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="deepa@stitchandyarn.in"
                className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa focus:border-primary focus:outline-none text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="label-caps text-cocoa-light block mb-1.5">Password</label>
              <input
                id="admin-password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa focus:border-primary focus:outline-none text-sm"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full justify-center">
              <LogIn size={18} /> Sign In
            </button>
          </form>
          <p className="text-xs text-cocoa-light/60 text-center mt-4">
            Demo: enter any email/password to log in
          </p>
        </motion.div>
      </main>
    );
  }

  const filteredProducts = adminProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
    toast.success(`Order updated to "${newStatus}"`);
  };

  const exportOrdersCSV = () => {
    const headers = ['Order ID', 'Customer', 'Phone', 'Items', 'Total', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.order_number, o.customer_name, o.customer_phone,
      o.items.map(i => `${i.name} x${i.qty}`).join('; '),
      o.total, o.status,
      new Date(o.created_at).toLocaleDateString('en-IN'),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
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
            onClick={() => setIsLoggedIn(false)}
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
                { label: 'Total Orders', value: orders.length.toString(), color: 'text-primary' },
                { label: 'Revenue', value: formatPrice(orders.reduce((s, o) => s + o.total, 0)), color: 'text-sage' },
                { label: 'Products', value: adminProducts.length.toString(), color: 'text-gold' },
                { label: 'Pending', value: orders.filter(o => o.status === 'new').length.toString(), color: 'text-primary' },
              ].map(stat => (
                <div key={stat.label} className="bg-surface rounded-2xl p-5 border border-rose-line/20 shadow-soft">
                  <p className="label-caps text-cocoa-light text-xs">{stat.label}</p>
                  <p className={`font-heading text-2xl font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-rose-line/20 shadow-soft">
              <h3 className="font-heading text-lg font-medium text-cocoa mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-rose-line/10 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-cocoa">{order.customer_name}</p>
                      <p className="text-xs text-cocoa-light">{order.order_number} · {formatPrice(order.total)}</p>
                    </div>
                    <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
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
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-medium text-cocoa">Orders ({orders.length})</h2>
              <button onClick={exportOrdersCSV} className="btn btn-secondary text-sm">
                <Download size={16} /> Export CSV
              </button>
            </div>

            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="bg-surface rounded-2xl p-5 border border-rose-line/20 shadow-soft">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-cocoa">{order.order_number}</p>
                        <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                      </div>
                      <p className="text-xs text-cocoa-light mt-0.5">
                        {order.customer_name} · {order.customer_phone} · {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <p className="font-heading text-lg font-semibold text-primary">{formatPrice(order.total)}</p>
                  </div>

                  {/* Items */}
                  <div className="text-sm text-cocoa-light mb-3">
                    {order.items.map((item, i) => (
                      <p key={i}>
                        {item.name} × {item.qty}
                        {item.personalisation && <span className="text-primary ml-1">({item.personalisation})</span>}
                      </p>
                    ))}
                  </div>

                  {/* Status update buttons */}
                  <div className="flex flex-wrap gap-2">
                    {statusFlow.map(status => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(order.id, status)}
                        disabled={order.status === status}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          order.status === status
                            ? 'bg-primary text-cream border-primary cursor-default'
                            : 'border-rose-line/30 text-cocoa-light hover:border-primary hover:text-primary'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
