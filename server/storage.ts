import { 
  users, type User, type InsertUser,
  games, type Game, type InsertGame,
  cart, type Cart, type InsertCart
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game operations
  getAllGames(): Promise<Game[]>;
  getGameById(id: number): Promise<Game | undefined>;
  getFeaturedGames(): Promise<Game[]>;
  getNewReleases(): Promise<Game[]>;
  getGamesByCategory(category: string): Promise<Game[]>;
  searchGames(query: string): Promise<Game[]>;
  
  // Cart operations
  getCartItems(userId?: number): Promise<Cart[]>;
  addToCart(cartItem: InsertCart): Promise<Cart>;
  updateCartItem(id: number, quantity: number): Promise<Cart | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId?: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private cartItems: Map<number, Cart>;
  private userCurrentId: number;
  private gameCurrentId: number;
  private cartCurrentId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.cartItems = new Map();
    this.userCurrentId = 1;
    this.gameCurrentId = 1;
    this.cartCurrentId = 1;
    
    // Seed with initial data
    this.seedGames();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Game operations
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
  
  async getGameById(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }
  
  async getFeaturedGames(): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.isFeatured);
  }
  
  async getNewReleases(): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.isNewRelease);
  }
  
  async getGamesByCategory(category: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.category === category);
  }
  
  async searchGames(query: string): Promise<Game[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.games.values()).filter(game => 
      game.title.toLowerCase().includes(lowerQuery) || 
      game.description.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Cart operations
  async getCartItems(userId?: number): Promise<Cart[]> {
    return Array.from(this.cartItems.values()).filter(item => 
      userId ? item.userId === userId : true
    );
  }
  
  async addToCart(cartItem: InsertCart): Promise<Cart> {
    // Check if item already exists
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.gameId === cartItem.gameId && item.userId === cartItem.userId
    );
    
    if (existingItem) {
      return this.updateCartItem(existingItem.id, existingItem.quantity + 1) as Promise<Cart>;
    }
    
    const id = this.cartCurrentId++;
    const newItem: Cart = { ...cartItem, id };
    this.cartItems.set(id, newItem);
    return newItem;
  }
  
  async updateCartItem(id: number, quantity: number): Promise<Cart | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  async clearCart(userId?: number): Promise<boolean> {
    if (userId) {
      Array.from(this.cartItems.entries()).forEach(([id, item]) => {
        if (item.userId === userId) {
          this.cartItems.delete(id);
        }
      });
      return true;
    } else {
      this.cartItems.clear();
      return true;
    }
  }
  
  // Helper methods
  private seedGames() {
    const games: Game[] = [
      {
        id: this.gameCurrentId++,
        title: "Night City Racing",
        description: "Race through the neon-lit streets of Night City in this adrenaline-pumping racing game. Customize your vehicle and compete against the best racers in the city.",
        price: 3999, // $39.99
        discountPercentage: 25,
        imageUrl: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 450, // 4.5 stars
        category: "Racing",
        isNewRelease: false,
        isFeatured: true,
        edition: "Digital Edition",
        additionalImages: [],
        releaseDate: new Date("2023-05-15"),
      },
      {
        id: this.gameCurrentId++,
        title: "Legends of Valor",
        description: "Embark on an epic journey through mythical lands. Battle legendary creatures, solve ancient puzzles, and become the hero the world needs.",
        price: 4999, // $49.99
        discountPercentage: 0,
        imageUrl: "https://images.unsplash.com/photo-1614294148960-32322da48e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 500, // 5.0 stars
        category: "RPG",
        isNewRelease: true,
        isFeatured: true,
        edition: "Standard Edition",
        additionalImages: [],
        releaseDate: new Date("2023-08-01"),
      },
      {
        id: this.gameCurrentId++,
        title: "Galactic Conquest",
        description: "Command your fleet across the galaxy. Explore unknown worlds, establish colonies, and defend against alien threats in this epic space strategy game.",
        price: 5999, // $59.99
        discountPercentage: 15,
        imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 400, // 4.0 stars
        category: "Strategy",
        isNewRelease: false,
        isFeatured: true,
        edition: "Commander Edition",
        additionalImages: [],
        releaseDate: new Date("2023-03-22"),
      },
      {
        id: this.gameCurrentId++,
        title: "Shadow Hunters",
        description: "Hunt supernatural creatures in a world where darkness reigns. Use your specialized weapons and abilities to track and eliminate monsters.",
        price: 3499, // $34.99
        discountPercentage: 0,
        imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 350, // 3.5 stars
        category: "Horror",
        isNewRelease: false,
        isFeatured: true,
        edition: "Hunter Edition",
        additionalImages: [],
        releaseDate: new Date("2022-10-31"),
      },
      {
        id: this.gameCurrentId++,
        title: "Digital Dreams",
        description: "Enter a virtual world where imagination is your only limit. Create, explore, and shape reality in this innovative sandbox game.",
        price: 5999, // $59.99
        discountPercentage: 0,
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 400, // 4.0 stars
        category: "Simulation",
        isNewRelease: true,
        isFeatured: false,
        edition: "Creator Edition",
        additionalImages: [],
        releaseDate: new Date("2023-07-20"),
      },
      {
        id: this.gameCurrentId++,
        title: "Astral Nexus",
        description: "Travel between dimensions and uncover the secrets of the universe. Solve cosmic puzzles and harness the power of the stars.",
        price: 4599, // $45.99
        discountPercentage: 0,
        imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 450, // 4.5 stars
        category: "Adventure",
        isNewRelease: true,
        isFeatured: false,
        edition: "Cosmic Edition",
        additionalImages: [],
        releaseDate: new Date("2023-08-05"),
      },
      {
        id: this.gameCurrentId++,
        title: "Velocity Rush",
        description: "Experience breakneck speeds as you race through impossible tracks. Master gravity-defying stunts and unlock powerful vehicles.",
        price: 4999, // $49.99
        discountPercentage: 0,
        imageUrl: "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 500, // 5.0 stars
        category: "Racing",
        isNewRelease: true,
        isFeatured: false,
        edition: "Turbo Edition",
        additionalImages: [],
        releaseDate: new Date("2023-07-30"),
      },
      {
        id: this.gameCurrentId++,
        title: "Ancient Legacy",
        description: "Unearth forgotten civilizations and discover powerful artifacts. Navigate through treacherous tombs and decode ancient languages.",
        price: 3999, // $39.99
        discountPercentage: 0,
        imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 300, // 3.0 stars
        category: "Adventure",
        isNewRelease: true,
        isFeatured: false,
        edition: "Explorer Edition",
        additionalImages: [],
        releaseDate: new Date("2023-08-10"),
      },
      {
        id: this.gameCurrentId++,
        title: "Phantom Legacy: Shadows Rising",
        description: "Embark on an epic journey through a world of shadows and ancient magic. Unleash powerful abilities and face legendary foes in this groundbreaking action RPG.",
        price: 5999, // $59.99
        discountPercentage: 0,
        imageUrl: "https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=800&q=80",
        rating: 480, // 4.8 stars
        category: "RPG",
        isNewRelease: true,
        isFeatured: true,
        edition: "Collector's Edition",
        additionalImages: [],
        releaseDate: new Date("2023-08-15"),
      },
      {
        id: this.gameCurrentId++,
        title: "Cyber Edge 2077",
        description: "Immerse yourself in a dystopian future where cybernetic enhancements define society. Hack, shoot, and navigate through a complex narrative of corporate warfare.",
        price: 5999, // $59.99
        discountPercentage: 0,
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 420, // 4.2 stars
        category: "RPG",
        isNewRelease: false,
        isFeatured: false,
        edition: "Digital Edition",
        additionalImages: [],
        releaseDate: new Date("2022-12-10"),
      },
      {
        id: this.gameCurrentId++,
        title: "Eternal Quest",
        description: "Journey through a vast fantasy world filled with magic, monsters, and mystery. Form alliances, complete quests, and shape the fate of the realm.",
        price: 3999, // $39.99
        discountPercentage: 0,
        imageUrl: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 450, // 4.5 stars
        category: "RPG",
        isNewRelease: false,
        isFeatured: false,
        edition: "Deluxe Edition",
        additionalImages: [],
        releaseDate: new Date("2023-02-15"),
      },
      {
        id: this.gameCurrentId++,
        title: "Space Odyssey",
        description: "Explore the far reaches of the galaxy in this immersive space simulation. Discover new planets, encounter alien species, and build your interstellar empire.",
        price: 4599, // $45.99
        discountPercentage: 0,
        imageUrl: "https://images.unsplash.com/photo-1622957067125-c4c9befaae10?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
        rating: 430, // 4.3 stars
        category: "Simulation",
        isNewRelease: false,
        isFeatured: false,
        edition: "Standard Edition",
        additionalImages: [],
        releaseDate: new Date("2023-01-20"),
      }
    ];
    
    games.forEach(game => {
      this.games.set(game.id, game);
    });
  }
}

export const storage = new MemStorage();
