import { CartDrawer } from './components/CartDrawer';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { SearchOverlay } from './components/SearchOverlay';
import { ToastContainer } from './components/ToastContainer';
import { StoreProvider, useStore } from './context/StoreContext';
import { AboutPage } from './pages/AboutPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ShopPage } from './pages/ShopPage';
import { WishlistPage } from './pages/WishlistPage';

function StorefrontShell() {
  const { route } = useStore();

  const renderPage = () => {
    switch (route) {
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6FF] text-[#24213A] overflow-x-hidden">
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <FloatingWhatsAppButton />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StorefrontShell />
    </StoreProvider>
  );
}
