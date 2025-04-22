import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertCartSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route("/api");
  
  // Get all games
  app.get("/api/games", async (req: Request, res: Response) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Error fetching games" });
    }
  });
  
  // Get game by ID
  app.get("/api/games/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }
      
      const game = await storage.getGameById(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Error fetching game" });
    }
  });
  
  // Get featured games
  app.get("/api/games/featured", async (req: Request, res: Response) => {
    try {
      const games = await storage.getFeaturedGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured games" });
    }
  });
  
  // Get new releases
  app.get("/api/games/new-releases", async (req: Request, res: Response) => {
    try {
      const games = await storage.getNewReleases();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Error fetching new releases" });
    }
  });
  
  // Get games by category
  app.get("/api/games/category/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const games = await storage.getGamesByCategory(category);
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Error fetching games by category" });
    }
  });
  
  // Search games
  app.get("/api/games/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const games = await storage.searchGames(query);
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Error searching games" });
    }
  });
  
  // Cart endpoints
  // Get cart items
  app.get("/api/cart", async (req: Request, res: Response) => {
    try {
      const cartItems = await storage.getCartItems();
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart items" });
    }
  });
  
  // Add item to cart
  app.post("/api/cart", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCartSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart data", errors: error.errors });
      }
      res.status(500).json({ message: "Error adding item to cart" });
    }
  });
  
  // Update cart item
  app.put("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const quantitySchema = z.object({
        quantity: z.number().int().positive(),
      });
      
      const { quantity } = quantitySchema.parse(req.body);
      const updatedItem = await storage.updateCartItem(id, quantity);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating cart item" });
    }
  });
  
  // Remove item from cart
  app.delete("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const success = await storage.removeFromCart(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error removing item from cart" });
    }
  });
  
  // Clear cart
  app.delete("/api/cart", async (req: Request, res: Response) => {
    try {
      await storage.clearCart();
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error clearing cart" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
