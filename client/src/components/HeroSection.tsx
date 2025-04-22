import { Button } from '@/components/ui/button';
import { Game } from '@shared/schema';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/gameData';
import { Link } from 'wouter';

interface HeroSectionProps {
  game: Game;
}

const HeroSection: React.FC<HeroSectionProps> = ({ game }) => {
  const { addToCart } = useCart();

  return (
    <section className="relative">
      <div className="h-96 md:h-[500px] bg-cover bg-center" style={{ backgroundImage: `url('${game.imageUrl}')` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-xl">
            <span className="bg-primary py-1 px-3 rounded-full text-sm font-medium inline-block mb-4">
              {game.isNewRelease ? 'New Release' : 'Featured Game'}
            </span>
            <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-3">{game.title}</h2>
            <p className="text-gray-300 mb-6">{game.description}</p>
            <div className="flex space-x-4">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white px-6"
                onClick={() => addToCart(game)}
              >
                Buy Now - {formatPrice(game.price)}
              </Button>
              <Button variant="outline" className="border-white hover:bg-white/10 text-white">
                <Link href={`/game/${game.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
