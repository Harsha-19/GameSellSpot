import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '@/lib/cart';
import MobileMenu from './MobileMenu';
import ShoppingCart from './ShoppingCart';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart as CartIcon, User, Menu } from 'lucide-react';

const Header = () => {
  const [location, setLocation] = useLocation();
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isCartOpen) setIsCartOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/store?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className={`bg-secondary sticky top-0 z-50 ${isScrolled ? 'shadow-lg' : ''}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="text-primary text-3xl">
                <i className="fas fa-gamepad"></i>
              </div>
              <h1 className="text-2xl font-poppins font-bold text-white">GameVault</h1>
            </div>
          </Link>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:block w-1/3 relative">
            <form onSubmit={handleSearch}>
              <Input
                type="text"
                placeholder="Search games..."
                className="w-full rounded-full bg-background border border-gray-700 text-white focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
          
          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <div className={`text-white hover:text-primary transition duration-200 cursor-pointer ${location === '/' ? 'text-primary' : ''}`}>Home</div>
            </Link>
            <Link href="/store">
              <div className={`text-white hover:text-primary transition duration-200 cursor-pointer ${location === '/store' ? 'text-primary' : ''}`}>Store</div>
            </Link>
            <a href="#" className="text-white hover:text-primary transition duration-200">Library</a>
            <a href="#" className="text-white hover:text-primary transition duration-200">Support</a>
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <button 
              className="text-white text-xl relative hover:text-primary transition duration-200"
              onClick={toggleCart}
              aria-label="Shopping Cart"
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            
            {/* User Icon */}
            <button className="text-white text-xl hover:text-primary transition duration-200" aria-label="User Menu">
              <User />
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white hover:text-primary transition duration-200"
              onClick={toggleMobileMenu}
              aria-label="Mobile Menu"
            >
              <Menu />
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search games..."
                className="w-full rounded-full bg-background border border-gray-700 text-white focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Mobile Menu (conditional render) */}
      {isMobileMenuOpen && <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />}
      
      {/* Shopping Cart (always render but conditionally show) */}
      <ShoppingCart />
    </header>
  );
};

export default Header;
