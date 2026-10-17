import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { useEffect } from 'react';

// Code-split all route pages for performance
const HomePage = lazy(() => import('@/pages/Home').then(m => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('@/pages/Shop').then(m => ({ default: m.ShopPage })));
const ProductPage = lazy(() => import('@/pages/Product').then(m => ({ default: m.ProductPage })));
const CheckoutPage = lazy(() => import('@/pages/Checkout').then(m => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmation').then(m => ({ default: m.OrderConfirmationPage })));
const TrackOrderPage = lazy(() => import('@/pages/TrackOrder').then(m => ({ default: m.TrackOrderPage })));
const AboutPage = lazy(() => import('@/pages/About').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('@/pages/Contact').then(m => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('@/pages/FAQ').then(m => ({ default: m.FAQPage })));
const CustomOrderPage = lazy(() => import('@/pages/CustomOrder').then(m => ({ default: m.CustomOrderPage })));
const ShippingReturnsPage = lazy(() => import('@/pages/ShippingReturns').then(m => ({ default: m.ShippingReturnsPage })));
const PrivacyPage = lazy(() => import('@/pages/Privacy').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('@/pages/Terms').then(m => ({ default: m.TermsPage })));
const AdminPage = lazy(() => import('@/pages/Admin').then(m => ({ default: m.AdminPage })));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-cocoa-light">Loading...</p>
      </div>
    </div>
  );
}

// 404 page
function NotFoundPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl mb-4">🧶</p>
        <h1 className="font-heading text-3xl font-semibold text-cocoa mb-2">Page not found</h1>
        <p className="text-cocoa-light mb-6">Looks like this thread leads nowhere. Let's get you back on track.</p>
        <a href="/" className="btn btn-primary">Back to home</a>
      </div>
    </main>
  );
}

// Layout wrapper — hides navbar/footer for admin
function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <div className="flex-1">
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </div>
      {!isAdmin && <Footer />}
      {!isAdmin && <CartDrawer />}
      {!isAdmin && <WhatsAppFab />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          className: 'toast-custom',
        }}
      />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:slug" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/custom-order" element={<CustomOrderPage />} />
          <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
