const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product } = require('../models');
const { generateInvoice } = require('../utils/invoiceGenerator');
const sendEmail = require('../utils/sendEmail');
const path = require('path');

// ✅ Place Order
router.post('/', async (req, res) => {
  const { name, email, address, items, total_price } = req.body;

  if (!name || !email || !address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Missing required fields or empty cart' });
  }

  try {
    const order = await Order.create({ name, email, address, total_price, status: 'pending' });

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    await OrderItem.bulkCreate(orderItems);

    for (const item of items) {
      await Product.decrement('quantity', { by: item.quantity, where: { id: item.id } });
    }

    res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).json({ message: 'Internal server error while placing order' });
  }
});

// ✅ Get all orders with products
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    const whereClause = email ? { email } : {};

    const orders = await Order.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      include: [{
        model: OrderItem,
        as: 'OrderItems',
        include: [Product]
      }]
    });

    res.json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        as: 'OrderItems',
        include: [Product]
      }]
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    console.error('Fetch single order error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Update order status and send email
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        as: 'OrderItems',
        include: [Product]
      }]
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    let emailStatus = 'success';
    try {
      const items = order.OrderItems.map(item => ({
        name: item.Product?.name || 'Unnamed Product',
        quantity: item.quantity,
        price: item.price,
      }));

      const invoicePath = await generateInvoice(order, items);

      const emailHTML = `
        <h2>Order Status Updated</h2>
        <p>Hello <strong>${order.name}</strong>,</p>
        <p>Your order <strong>#${order.id}</strong> status has been updated to <strong>${status}</strong>.</p>
        <p>Please find attached your updated invoice.</p>
        <br/>
        <p>Thanks for shopping with Econest Bedding Inc.</p>
      `;

      await sendEmail(order.email, `Order #${order.id} Status Updated`, emailHTML, invoicePath);
      console.log(`✅ Email sent to ${order.email}`);
    } catch (emailErr) {
      console.error('❌ Email sending failed:', emailErr.message);
      emailStatus = 'failed';
    }

    res.json({ message: 'Order status updated successfully', order, emailStatus });

  } catch (err) {
    console.error('Update status error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// ✅ Download invoice
router.get('/:id/invoice', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        as: 'OrderItems',
        include: [Product]
      }]
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const items = order.OrderItems.map(item => ({
      name: item.Product?.name || 'Unnamed Product',
      quantity: item.quantity,
      price: item.price,
    }));

    const invoicePath = await generateInvoice(order, items);

    res.sendFile(path.resolve(invoicePath));
  } catch (err) {
    console.error('Invoice download error:', err);
    res.status(500).json({ message: 'Internal server error while downloading invoice' });
  }
});

module.exports = router;