import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Game } from '@shared/schema';
import { useCart } from '@/lib/cart';
import { formatPrice, calculateDiscountedPrice, getRatingStars, formatRating } from '@/lib/gameData';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { addToCart } = useCart();
  const { full, half, empty } = getRatingStars(game.rating || 0);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    addToCart(game);
  };

  return (
    <Link href={`/game/${game.id}`}>
      <div className="block game-card bg-secondary rounded-xl overflow-hidden shadow-lg cursor-pointer">
        <div className="relative">
          <img 
            src={game.imageUrl} 
            alt={game.title} 
            className="w-full h-44 object-cover"
          />
          {game.discountPercentage && game.discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs py-1 px-2 rounded-full">
              -{game.discountPercentage}%
            </div>
          )}
          {game.isNewRelease && (
            <div className="absolute top-2 right-2 bg-[#10b981] text-white text-xs py-1 px-2 rounded-full">
              NEW
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-poppins font-bold text-lg mb-1">{game.title}</h3>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(full)].map((_, i) => (
                <i key={`full-${i}`} className="fas fa-star"></i>
              ))}
              {half && <i className="fas fa-star-half-alt"></i>}
              {[...Array(empty)].map((_, i) => (
                <i key={`empty-${i}`} className="far fa-star"></i>
              ))}
            </div>
            <span className="text-sm text-gray-400 ml-1">{formatRating(game.rating || 0)}</span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div>
              {game.discountPercentage && game.discountPercentage > 0 ? (
                <>
                  <span className="text-gray-400 line-through text-sm">
                    {formatPrice(game.price)}
                  </span>
                  <span className="font-mono font-bold text-white ml-2">
                    {formatPrice(calculateDiscountedPrice(game))}
                  </span>
                </>
              ) : (
                <span className="font-mono font-bold text-white">
                  {formatPrice(game.price)}
                </span>
              )}
            </div>
            <Button 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
