const express = require('express');
const router = express.Router();
const { Cart, Product } = require('../models');

// Get cart items by user
router.get('/:userId', async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { user_id: req.params.userId },
      include: {
        model: Product,
        attributes: ['id', 'name', 'price', 'image'],
      }
    });
    res.json({ success: true, data: cartItems });
  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    const existingItem = await Cart.findOne({ where: { user_id, product_id } });
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.json({ success: true, data: existingItem });
    }
    const cartItem = await Cart.create({ user_id, product_id, quantity });
    res.json({ success: true, data: cartItem });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Failed to add to cart' });
  }
});

// Update quantity of a cart item
router.patch('/:userId', async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const cartItem = await Cart.findOne({
      where: { user_id: req.params.userId, product_id }
    });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({ success: true, data: cartItem });
  } catch (error) {
    console.error('Update cart quantity error:', error);
    res.status(500).json({ success: false, message: 'Failed to update quantity' });
  }
});

// Clear user's cart
router.delete('/:userId', async (req, res) => {
  try {
    await Cart.destroy({ where: { user_id: req.params.userId } });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
});

module.exports = router;
