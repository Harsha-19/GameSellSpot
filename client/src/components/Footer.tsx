import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-secondary mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/">
              <div className="flex items-center space-x-2 mb-6 cursor-pointer">
                <div className="text-primary text-3xl">
                  <i className="fas fa-gamepad"></i>
                </div>
                <h2 className="text-xl font-poppins font-bold text-white">GameVault</h2>
              </div>
            </Link>
            <p className="text-gray-400 mb-4">The ultimate destination for gamers to discover, buy, and play the best video games.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <div className="text-gray-400 hover:text-primary transition-colors cursor-pointer">Home</div>
                </Link>
              </li>
              <li>
                <Link href="/store">
                  <div className="text-gray-400 hover:text-primary transition-colors cursor-pointer">Browse Games</div>
                </Link>
              </li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Special Offers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Gift Cards</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Wishlist</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Return Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Download Our App</h3>
            <p className="text-gray-400 mb-4">Get our mobile app for a seamless gaming experience on the go.</p>
            <div className="flex flex-col space-y-3">
              <a href="#" className="bg-background hover:bg-background/80 text-white rounded-lg px-4 py-2 flex items-center transition-colors">
                <i className="fab fa-apple text-2xl mr-3"></i>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="font-medium">App Store</div>
                </div>
              </a>
              <a href="#" className="bg-background hover:bg-background/80 text-white rounded-lg px-4 py-2 flex items-center transition-colors">
                <i className="fab fa-google-play text-2xl mr-3"></i>
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="font-medium">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2023 GameVault. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <i className="fab fa-cc-visa text-gray-400 text-2xl"></i>
            <i className="fab fa-cc-mastercard text-gray-400 text-2xl"></i>
            <i className="fab fa-cc-paypal text-gray-400 text-2xl"></i>
            <i className="fab fa-cc-apple-pay text-gray-400 text-2xl"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
