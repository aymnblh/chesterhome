const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../firebase');
const auth = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    if (!db) throw new Error('Database not initialized');
    
    const { username, password } = req.body;
    
    const adminsRef = db.collection('admins');
    const snapshot = await adminsRef.where('username', '==', username).get();
    
    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const adminDoc = snapshot.docs[0];
    const adminData = adminDoc.data();

    const isMatch = await bcrypt.compare(password, adminData.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: adminDoc.id, username: adminData.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, admin: { username: adminData.username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    if (!db) throw new Error('Database not initialized');
    
    const adminDoc = await db.collection('admins').doc(req.admin.id).get();
    if (!adminDoc.exists) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    const data = adminDoc.data();
    delete data.password;
    
    res.json({ _id: adminDoc.id, ...data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
