import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Game } from '@shared/schema';
import { useCart } from '@/lib/cart';
import { formatPrice, getRatingStars, formatRating } from '@/lib/gameData';
import GameCard from '@/components/GameCard';

const GameDetails = () => {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { addToCart } = useCart();
  
  const gameQuery = useQuery<Game>({
    queryKey: [`/api/games/${id}`],
  });
  
  const relatedGamesQuery = useQuery<Game[]>({
    queryKey: ['/api/games'],
    enabled: !!gameQuery.data,
    select: (games) => 
      games
        .filter(g => g.category === gameQuery.data?.category && g.id !== gameQuery.data?.id)
        .slice(0, 4),
  });
  
  if (gameQuery.isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-secondary rounded-xl mb-8"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="h-10 bg-secondary rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-secondary rounded w-full mb-2"></div>
              <div className="h-4 bg-secondary rounded w-full mb-2"></div>
              <div className="h-4 bg-secondary rounded w-4/5 mb-6"></div>
              
              <div className="h-8 bg-secondary rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-secondary rounded w-full mb-2"></div>
              <div className="h-4 bg-secondary rounded w-full mb-2"></div>
              <div className="h-4 bg-secondary rounded w-3/4 mb-6"></div>
            </div>
            
            <div className="md:w-1/3 bg-secondary rounded-xl p-6 h-64"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (gameQuery.error || !gameQuery.data) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
        <p className="mb-6">The game you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/store')}>Return to Store</Button>
      </div>
    );
  }
  
  const game = gameQuery.data;
  const { full, half, empty } = getRatingStars(game.rating);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Image */}
      <div 
        className="w-full h-96 bg-cover bg-center rounded-xl mb-8 relative"
        style={{ backgroundImage: `url('${game.imageUrl}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 rounded-xl"></div>
        <div className="absolute bottom-0 left-0 p-6">
          {game.isNewRelease && (
            <span className="bg-[#10b981] text-white text-sm py-1 px-3 rounded-full mr-2">
              NEW
            </span>
          )}
          {game.discountPercentage > 0 && (
            <span className="bg-primary text-white text-sm py-1 px-3 rounded-full">
              {game.discountPercentage}% OFF
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Game Info */}
        <div className="md:w-2/3">
          <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-2">{game.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(full)].map((_, i) => (
                <i key={`full-${i}`} className="fas fa-star"></i>
              ))}
              {half && <i className="fas fa-star-half-alt"></i>}
              {[...Array(empty)].map((_, i) => (
                <i key={`empty-${i}`} className="far fa-star"></i>
              ))}
            </div>
            <span className="text-gray-400">{formatRating(game.rating)}</span>
            <span className="mx-2 text-gray-600">|</span>
            <span className="bg-secondary text-sm px-2 py-1 rounded">{game.category}</span>
            <span className="mx-2 text-gray-600">|</span>
            <span className="text-gray-400 text-sm">
              Released: {new Date(game.releaseDate).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-gray-300 mb-6 leading-relaxed">{game.description}</p>
          
          <h3 className="text-xl font-bold mb-3">Game Details</h3>
          <div className="bg-secondary/50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-gray-400 text-sm">Edition</h4>
                <p>{game.edition}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm">Category</h4>
                <p>{game.category}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm">Release Date</h4>
                <p>{new Date(game.releaseDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm">Rating</h4>
                <p>{formatRating(game.rating)} / 5.0</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Purchase Box */}
        <div className="md:w-1/3">
          <div className="bg-secondary rounded-xl p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4">Buy {game.title}</h3>
            <div className="flex items-center mb-4">
              {game.discountPercentage > 0 ? (
                <>
                  <span className="text-gray-400 line-through mr-2">
                    {formatPrice(game.price)}
                  </span>
                  <span className="text-2xl font-bold">
                    {formatPrice(game.price * (1 - game.discountPercentage / 100))}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">{formatPrice(game.price)}</span>
              )}
              
              {game.discountPercentage > 0 && (
                <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Save {formatPrice(game.price * game.discountPercentage / 100)}
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => addToCart(game)}
              >
                Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-accent text-accent hover:bg-accent/10"
              >
                Add to Wishlist
              </Button>
            </div>
            
            <div className="mt-6 text-sm text-gray-400">
              <p className="flex items-center mb-2">
                <i className="fas fa-check-circle text-[#10b981] mr-2"></i>
                Digital Download
              </p>
              <p className="flex items-center mb-2">
                <i className="fas fa-check-circle text-[#10b981] mr-2"></i>
                Instant Delivery
              </p>
              <p className="flex items-center">
                <i className="fas fa-check-circle text-[#10b981] mr-2"></i>
                Secure Payment
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Games */}
      {relatedGamesQuery.data && relatedGamesQuery.data.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-poppins font-bold mb-6">Similar Games</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedGamesQuery.data.map(relatedGame => (
              <GameCard key={relatedGame.id} game={relatedGame} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default GameDetails;
