const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    if (!db) throw new Error('Database not initialized');
    
    const orderData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    const docRef = await db.collection('orders').add(orderData);
    res.status(201).json({ _id: docRef.id, ...orderData });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    if (!db) throw new Error('Database not initialized');
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    if (!db) throw new Error('Database not initialized');
    const doc = await db.collection('orders').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Order not found' });
    res.json({ _id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/status', auth, async (req, res) => {
  try {
    if (!db) throw new Error('Database not initialized');
    const { status } = req.body;
    await db.collection('orders').doc(req.params.id).update({ status });
    const doc = await db.collection('orders').doc(req.params.id).get();
    res.json({ _id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
