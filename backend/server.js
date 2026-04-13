const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

const admins = [
  { id: 1, username: "admin", password: "admin123", restaurant_id: 1 },
  { id: 2, username: "pizzaadmin", password: "pizza123", restaurant_id: 2 }
];

const restaurants = [
  { id: 1, name: "Waff-Wich", cuisine: "Waffles and Desserts", logo: "" },
  { id: 2, name: "Pizza Hub", cuisine: "Pizza and Pasta", logo: "" },
  { id: 3, name: "Burger Point", cuisine: "Burgers and Fries", logo: "" },
  { id: 4, name: "Noodle House", cuisine: "Noodles and Soup", logo: "" },
  { id: 5, name: "Biryani Palace", cuisine: "Biryani and Rice", logo: "" }
];

let menuItems = [
  { id: 1, restaurant_id: 1, name: "KitKat Waffle", category: "Waffle", price: 230 },
  { id: 2, restaurant_id: 1, name: "Nutella Waffle", category: "Waffle", price: 250 },
  { id: 3, restaurant_id: 2, name: "Cheese Pizza", category: "Pizza", price: 399 },
  { id: 4, restaurant_id: 2, name: "Veg Pasta", category: "Pasta", price: 220 },
  { id: 5, restaurant_id: 3, name: "Chicken Burger", category: "Burger", price: 180 },
  { id: 6, restaurant_id: 3, name: "French Fries", category: "Snacks", price: 120 },
  { id: 7, restaurant_id: 4, name: "Chicken Noodles", category: "Noodles", price: 199 },
  { id: 8, restaurant_id: 4, name: "Hot Soup", category: "Soup", price: 140 },
  { id: 9, restaurant_id: 5, name: "Chicken Biryani", category: "Biryani", price: 280 }
];

let orders = [];

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/restaurants", (req, res) => {
  res.json(restaurants);
});

app.get("/api/restaurants/:id/menu", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const items = menuItems.filter(item => item.restaurant_id === id);
  res.json(items);
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const admin = admins.find(a => a.username === username && a.password === password);

  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    message: "Login success",
    token: "demo-token-" + admin.id,
    admin
  });
});

app.post("/api/menu", (req, res) => {
  const { restaurant_id, name, category, price } = req.body;

  const newItem = {
    id: menuItems.length + 1,
    restaurant_id: Number(restaurant_id),
    name,
    category,
    price: Number(price)
  };

  menuItems.push(newItem);
  res.status(201).json(newItem);
});

app.post("/api/restaurants/:id/logo", upload.single("logo"), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const restaurant = restaurants.find(r => r.id === id);

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  restaurant.logo = `/uploads/${req.file.filename}`;
  res.json({ message: "Logo uploaded", restaurant });
});

app.post("/api/orders", (req, res) => {
  const { restaurant_id, items, customer_name, customer_phone, payment_method } = req.body;

  const order = {
    id: uuidv4(),
    restaurant_id,
    items,
    customer_name,
    customer_phone,
    payment_method,
    payment_status: payment_method === "cash" ? "pending" : "paid",
    order_status: "placed",
    created_at: new Date().toISOString()
  };

  orders.push(order);
  res.status(201).json(order);
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.get("/api/orders/:id", (req, res) => {
  const order = orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
});

app.put("/api/orders/:id/status", (req, res) => {
  const { order_status, payment_status } = req.body;
  const order = orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order_status) {
    order.order_status = order_status;
  }

  if (payment_status) {
    order.payment_status = payment_status;
  }

  res.json(order);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});