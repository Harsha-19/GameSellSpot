import { Link, useLocation } from 'wouter';

interface MobileMenuProps {
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose }) => {
  const [location] = useLocation();

  return (
    <div className="md:hidden bg-secondary fixed top-[108px] left-0 right-0 z-50 shadow-lg p-4">
      <nav className="flex flex-col space-y-3">
        <Link href="/">
          <div 
            className={`text-white hover:text-primary py-2 border-b border-gray-700 cursor-pointer ${location === '/' ? 'text-primary' : ''}`}
            onClick={onClose}
          >
            Home
          </div>
        </Link>
        <Link href="/store">
          <div 
            className={`text-white hover:text-primary py-2 border-b border-gray-700 cursor-pointer ${location === '/store' ? 'text-primary' : ''}`}
            onClick={onClose}
          >
            Store
          </div>
        </Link>
        <a 
          href="#" 
          className="text-white hover:text-primary py-2 border-b border-gray-700"
          onClick={onClose}
        >
          Library
        </a>
        <a 
          href="#" 
          className="text-white hover:text-primary py-2"
          onClick={onClose}
        >
          Support
        </a>
      </nav>
    </div>
  );
};

export default MobileMenu;
