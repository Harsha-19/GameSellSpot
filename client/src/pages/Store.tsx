import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Game } from '@shared/schema';
import GameCard from '@/components/GameCard';
import { categories } from '@/lib/gameData';

const Store = () => {
  const [location, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  
  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    const filterParam = params.get('filter');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    if (filterParam === 'new') {
      setShowNewOnly(true);
    } else if (filterParam === 'sale') {
      setShowSaleOnly(true);
    }
  }, [location]);
  
  // Fetch all games
  const { data: games, isLoading, error } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });
  
  // Filter and sort games
  const filteredGames = games?.filter(game => {
    // Filter by search term
    if (searchTerm && !game.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && game.category !== selectedCategory) {
      return false;
    }
    
    // Filter by new releases
    if (showNewOnly && !game.isNewRelease) {
      return false;
    }
    
    // Filter by sale items
    if (showSaleOnly && game.discountPercentage <= 0) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort games
    switch (sortBy) {
      case 'newest':
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL without full page reload
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (showNewOnly) params.set('filter', 'new');
    if (showSaleOnly) params.set('filter', 'sale');
    
    navigate(`/store?${params.toString()}`);
  };
  
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('newest');
    setShowNewOnly(false);
    setShowSaleOnly(false);
    navigate('/store');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-poppins font-bold mb-8">Game Store</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-secondary rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            
            <form onSubmit={handleSearch}>
              <div className="mb-4">
                <label htmlFor="search" className="block text-sm font-medium mb-2">Search</label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search games..."
                  className="bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="sort" className="block text-sm font-medium mb-2">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <input
                    id="new-only"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-700 text-primary focus:ring-primary"
                    checked={showNewOnly}
                    onChange={(e) => setShowNewOnly(e.target.checked)}
                  />
                  <label htmlFor="new-only" className="ml-2 block text-sm">
                    New Releases Only
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="sale-only"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-700 text-primary focus:ring-primary"
                    checked={showSaleOnly}
                    onChange={(e) => setShowSaleOnly(e.target.checked)}
                  />
                  <label htmlFor="sale-only" className="ml-2 block text-sm">
                    On Sale Only
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Apply Filters
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Game Grid */}
        <div className="lg:w-3/4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(9).fill(0).map((_, i) => (
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
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Error loading games</p>
              <Button onClick={() => navigate('/store')}>Try Again</Button>
            </div>
          ) : filteredGames && filteredGames.length > 0 ? (
            <>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-lg">
                  Showing {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-secondary rounded-xl">
              <h3 className="text-xl font-bold mb-2">No Games Found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
              <Button onClick={handleReset}>Show All Games</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
