const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    if (!db) throw new Error('Database not initialized');
    const snapshot = await db.collection('wilayas').orderBy('code').get();
    const wilayas = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(wilayas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    if (!db) throw new Error('Database not initialized');
    const { homeDelivery, agencyDelivery, isActive } = req.body;
    
    const updateData = {
      homeDelivery: Number(homeDelivery),
      agencyDelivery: Number(agencyDelivery),
      isActive: Boolean(isActive)
    };
    
    await db.collection('wilayas').doc(req.params.id).update(updateData);
    const doc = await db.collection('wilayas').doc(req.params.id).get();
    res.json({ _id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
