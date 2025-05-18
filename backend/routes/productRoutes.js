const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisePool } = require('../config/db');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ------------------------ 🟢 Add Product ------------------------
router.post('/', upload.single('image'), async (req, res) => {
  const { name, description, price, quantity, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !price || !quantity || !category_id) {
    return res.status(400).json({ error: 'Name, price, quantity, and category are required' });
  }

  const sql = `
    INSERT INTO products (name, description, price, quantity, category_id, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [name, description, price, quantity, category_id, image];

  try {
    const [results] = await promisePool.query(sql, params);
    res.status(201).json({ message: 'Product added successfully', data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------ 🟢 Get All Products (or by Category) ------------------------
router.get('/', async (req, res) => {
  const categoryId = req.query.category;

  try {
    let sql = `
      SELECT p.*, c.name AS category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    
    if (categoryId) {
      sql += ` WHERE p.category_id = ?`;
      const [results] = await promisePool.query(sql, [categoryId]);
      res.status(200).json(results);
    } else {
      const [results] = await promisePool.query(sql);
      res.status(200).json(results);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------ 🟢 Get Single Product by ID ------------------------
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await promisePool.query('SELECT * FROM products WHERE id = ?', [id]);
    results.length === 0 ? res.status(404).json({ error: 'Product not found' }) : res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------ 🟠 Update Product by ID ------------------------
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    // Check if product exists
    const [existingProducts] = await promisePool.query('SELECT * FROM products WHERE id = ?', [id]);

    if (existingProducts.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Prepare update query
    let sql = `
      UPDATE products SET 
      name = ?, 
      description = ?, 
      price = ?, 
      quantity = ?, 
      category_id = ?
      ${image ? ', image = ?' : ''}
      WHERE id = ?
    `;

    const values = [name, description, price, quantity, category_id];
    if (image) values.push(image);
    values.push(id);

    await promisePool.query(sql, values);

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------ 🔴 Delete Product by ID (with Image) ------------------------
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [productRows] = await promisePool.query('SELECT image FROM products WHERE id = ?', [id]);

    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imageFilename = productRows[0].image;

    const [deleteResult] = await promisePool.query('DELETE FROM products WHERE id = ?', [id]);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete image from uploads folder if exists
    if (imageFilename) {
      const imagePath = path.join(__dirname, '..', 'uploads', imageFilename);
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.warn('Failed to delete image file:', err.message);
        }
      });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
