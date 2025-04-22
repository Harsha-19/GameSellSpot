import { Game, Category } from "@shared/schema";

// Categories with icons
export const categories: Category[] = [
  { id: "RPG", name: "RPG", icon: "fa-dragon" },
  { id: "FPS", name: "FPS", icon: "fa-crosshairs" },
  { id: "Sports", name: "Sports", icon: "fa-futbol" },
  { id: "Racing", name: "Racing", icon: "fa-car-side" },
  { id: "Horror", name: "Horror", icon: "fa-ghost" },
  { id: "Strategy", name: "Strategy", icon: "fa-chess" },
  { id: "Adventure", name: "Adventure", icon: "fa-mountain" },
  { id: "Simulation", name: "Simulation", icon: "fa-robot" }
];

// Helper functions
export const calculateDiscountedPrice = (game: Game): number => {
  if (!game.discountPercentage) return game.price;
  return game.price - Math.round((game.price * game.discountPercentage) / 100);
};

export const formatPrice = (price: number): string => {
  return `$${(price / 100).toFixed(2)}`;
};

export const getRatingStars = (rating: number): { full: number; half: boolean; empty: number } => {
  const fullStars = Math.floor(rating / 100);
  const hasHalfStar = rating % 100 >= 50;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: fullStars,
    half: hasHalfStar,
    empty: emptyStars
  };
};

export const formatRating = (rating: number): string => {
  return (rating / 100).toFixed(1);
};
