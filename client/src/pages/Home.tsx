import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import GameCard from '@/components/GameCard';
import CategoryCard from '@/components/CategoryCard';
import HeroSection from '@/components/HeroSection';
import { categories } from '@/lib/gameData';
import { Game } from '@shared/schema';
import { Link } from 'wouter';

const Home = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  // Fetch featured games
  const featuredGamesQuery = useQuery({
    queryKey: ['/api/games'],
    select: (games: Game[]) => games.filter(game => game.isFeatured),
  });

  // Fetch new releases
  const newReleasesQuery = useQuery({
    queryKey: ['/api/games'],
    select: (games: Game[]) => games.filter(game => game.isNewRelease),
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: 'Newsletter',
        description: 'Thank you for subscribing to our newsletter!',
        duration: 3000,
      });
      setEmail('');
    }
  };

  const featuredHero = featuredGamesQuery.data?.find(game => game.title === "Phantom Legacy: Shadows Rising");

  return (
    <div>
      {/* Hero Section */}
      {featuredHero && <HeroSection game={featuredHero} />}

      {/* Categories */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-poppins font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Games */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-poppins font-bold">Featured Games</h2>
          <Link href="/store">
            <a className="text-primary hover:text-primary/80 flex items-center">
              View All <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredGamesQuery.isLoading ? (
            // Loading state
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-secondary rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-44 bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))
          ) : featuredGamesQuery.error ? (
            <div className="col-span-4 py-10 text-center">
              <p className="text-red-500">Error loading featured games</p>
            </div>
          ) : (
            featuredGamesQuery.data?.slice(0, 4).map(game => (
              <GameCard key={game.id} game={game} />
            ))
          )}
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="container mx-auto px-4 py-10">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 flex items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">Summer Sale is Here!</h2>
                <p className="text-white/90 mb-6">Get up to 70% off on hundreds of titles. Limited time offer - ends August 30th.</p>
                <Button className="bg-white text-primary hover:bg-white/90">
                  <Link href="/store">Browse Sale Games</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative h-60 md:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Summer Sale" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Releases */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-poppins font-bold">New Releases</h2>
          <Link href="/store?filter=new">
            <a className="text-primary hover:text-primary/80 flex items-center">
              View All <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newReleasesQuery.isLoading ? (
            // Loading state
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-secondary rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-44 bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))
          ) : newReleasesQuery.error ? (
            <div className="col-span-4 py-10 text-center">
              <p className="text-red-500">Error loading new releases</p>
            </div>
          ) : (
            newReleasesQuery.data?.slice(0, 4).map(game => (
              <GameCard key={game.id} game={game} />
            ))
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-secondary rounded-2xl p-8 md:p-12">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-6">Subscribe to our newsletter to get the latest gaming news, exclusive offers, and early access to new releases.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg bg-background border border-gray-700 text-white focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
