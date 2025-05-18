const express = require('express');
const router = express.Router();

// Sample product data (replace with DB in real app)
let products = [
  { id: 1, name: "Sofa", price: 20000 },
  { id: 2, name: "Table", price: 5000 },
];

// Get all products
router.get('/products', (req, res) => {
  res.json(products);
});

// Add a product
router.post('/products', (req, res) => {
  const { name, price } = req.body;
  const newProduct = { id: products.length + 1, name, price };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update a product
router.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const product = products.find(p => p.id === parseInt(id));
  if (product) {
    product.name = name;
    product.price = price;
    res.json(product);
  } else {
    res.status(404).send("Product not found");
  }
});

// Delete a product
router.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(p => p.id !== parseInt(id));
  res.status(204).send();
});

module.exports = router;
