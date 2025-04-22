import { useState } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatPrice } from '@/lib/gameData';
import { useToast } from '@/hooks/use-toast';
import { Lock, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const [_, navigate] = useLocation();
  const { cartItems, subtotal, tax, total, clearCart } = useCart();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // Clear the cart
      clearCart();
      
      // Show success message
      toast({
        title: "Order Successful!",
        description: "Your purchase was completed successfully",
        duration: 5000,
      });
      
      // Redirect after a moment
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 2000);
  };
  
  if (cartItems.length === 0 && !isComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="mb-6">Add some games to your cart before proceeding to checkout.</p>
        <Button onClick={() => navigate('/store')}>Browse Games</Button>
      </div>
    );
  }
  
  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <div className="bg-secondary p-8 rounded-xl">
          <CheckCircle2 className="h-16 w-16 text-[#10b981] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Complete!</h2>
          <p className="text-gray-300 mb-6">Thank you for your purchase. Your games are now available in your library.</p>
          <p className="text-gray-400 mb-4">Order confirmation has been sent to your email.</p>
          <Button className="w-full" onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-poppins font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit}>
            <div className="bg-secondary rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-background"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-background"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-background"
                  required
                />
              </div>
            </div>
            
            <div className="bg-secondary rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Billing Address</h2>
              
              <div className="mb-4">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="bg-background"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-secondary rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={handlePaymentMethodChange}
                className="mb-6"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center">
                    <i className="far fa-credit-card mr-2"></i> Credit / Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center">
                    <i className="fab fa-paypal mr-2"></i> PayPal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="apple-pay" id="apple-pay" />
                  <Label htmlFor="apple-pay" className="flex items-center">
                    <i className="fab fa-apple-pay mr-2"></i> Apple Pay
                  </Label>
                </div>
              </RadioGroup>
              
              {paymentMethod === 'credit-card' && (
                <div>
                  <div className="mb-4">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="password"
                        placeholder="XXX"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex items-center">
                <Lock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-400">All transactions are secure and encrypted</span>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-8 bg-primary hover:bg-primary/90 py-6 text-lg"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Complete Purchase (${formatPrice(total)})`}
            </Button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-secondary rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="max-h-[400px] overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center py-3 border-b border-gray-700">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="ml-3 flex-grow">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.edition}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-medium">
                      {item.discountedPrice 
                        ? formatPrice(item.discountedPrice)
                        : formatPrice(item.price)
                      } × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 py-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span className="font-mono">{formatPrice(tax)}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="font-mono">{formatPrice(total)}</span>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-400">
              <p className="mb-2">By completing your purchase, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</p>
              <p>All games will be delivered digitally to your email address immediately after purchase.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
