const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const restaurants = [
  { id: 1, name: "Waff-Wich", cuisine: "Waffles and Desserts" },
  { id: 2, name: "Pizza Hub", cuisine: "Pizza and Pasta" },
  { id: 3, name: "Burger Point", cuisine: "Burgers and Fries" },
  { id: 4, name: "Noodle House", cuisine: "Noodles and Soup" }
];

const menuItems = [
  { id: 1, restaurant_id: 1, name: "KitKat Waffle", category: "Waffle", price: 230 },
  { id: 2, restaurant_id: 1, name: "Nutella Waffle", category: "Waffle", price: 250 },
  { id: 3, restaurant_id: 2, name: "Cheese Pizza", category: "Pizza", price: 399 },
  { id: 4, restaurant_id: 2, name: "Veg Pasta", category: "Pasta", price: 220 },
  { id: 5, restaurant_id: 3, name: "Chicken Burger", category: "Burger", price: 180 },
  { id: 6, restaurant_id: 3, name: "French Fries", category: "Snacks", price: 120 },
  { id: 7, restaurant_id: 4, name: "Chicken Noodles", category: "Noodles", price: 199 },
  { id: 8, restaurant_id: 4, name: "Hot Soup", category: "Soup", price: 140 }
];

app.get("/api/restaurants", (req, res) => {
  res.json(restaurants);
});

app.get("/api/restaurants/:id/menu", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const items = menuItems.filter(item => item.restaurant_id === id);
  res.json(items);
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});