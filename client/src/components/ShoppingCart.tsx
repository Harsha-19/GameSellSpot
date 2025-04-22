import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { formatPrice } from '@/lib/gameData';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

const ShoppingCart = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    tax, 
    total 
  } = useCart();

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div 
      className={`fixed right-0 top-0 h-full w-full md:w-96 bg-secondary z-50 shadow-lg transform transition-transform ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-poppins font-bold">Your Cart</h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-gray-400 mb-6">Looks like you haven't added any games to your cart yet.</p>
              <Button onClick={() => { closeCart(); }}>
                <Link href="/store">Browse Games</Link>
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between mb-4 p-3 bg-background rounded-lg">
                <div className="flex items-center">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="ml-3">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.edition}</p>
                    <div className="flex items-center mt-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 text-sm">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium">
                    {item.discountedPrice 
                      ? formatPrice(item.discountedPrice * item.quantity)
                      : formatPrice(item.price * item.quantity)
                    }
                  </p>
                  <button 
                    className="text-sm text-red-400 hover:text-red-300"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-700 pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span className="font-mono font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Tax</span>
            <span className="font-mono font-medium">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="font-mono">{formatPrice(total)}</span>
          </div>
          
          <Button 
            className="mt-6 w-full bg-primary hover:bg-primary/90"
            disabled={cartItems.length === 0}
            onClick={() => {
              setIsCartOpen(false);
            }}
          >
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="mt-3 w-full border border-accent text-accent hover:bg-accent/10"
            onClick={closeCart}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
