const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { db, bucket } = require('../firebase');
const auth = require('../middleware/auth');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Images only!'));
  }
});

const uploadToFirebase = async (file) => {
  if (!bucket) throw new Error('Firebase Storage not initialized');
  const filename = `products/${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
  const bucketFile = bucket.file(filename);
  
  await bucketFile.save(file.buffer, {
    metadata: { contentType: file.mimetype }
  });
  
  // Make the file public (optional but good for direct URL access without tokens)
  await bucketFile.makePublic();
  
  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
};

const deleteFromFirebase = async (imageUrl) => {
  if (!bucket || !imageUrl) return;
  try {
    // Extract filename from URL
    const match = imageUrl.match(/products%2F(.*)\?/); // if using signed URL format
    const match2 = imageUrl.match(/products\/(.*)$/); // if using storage.googleapis format
    
    let filename = '';
    if (match2) filename = `products/${match2[1]}`;
    else if (match) filename = `products/${decodeURIComponent(match[1])}`;
    
    if (filename) {
      await bucket.file(filename).delete();
    }
  } catch (err) {
    console.error('Error deleting image from Firebase:', err);
  }
};

router.get('/', async (req, res) => {
  try {
    if (!db) throw new Error('Database not initialized');
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    const products = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!db) throw new Error('Database not initialized');
    const doc = await db.collection('products').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Product not found' });
    res.json({ _id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!db) throw new Error('Database not initialized');
    if (!req.file) return res.status(400).json({ message: 'Image is required' });
    
    const imageUrl = await uploadToFirebase(req.file);
    
    const productData = {
      title: req.body.title,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category || 'salon',
      inStock: req.body.inStock === 'true' || req.body.inStock === true,
      image: imageUrl,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('products').add(productData);
    res.status(201).json({ _id: docRef.id, ...productData });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    if (!db) throw new Error('Database not initialized');
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      inStock: req.body.inStock === 'true' || req.body.inStock === true,
    };
    
    if (req.file) {
      updateData.image = await uploadToFirebase(req.file);
      
      // Delete old image if it exists
      const oldDoc = await db.collection('products').doc(req.params.id).get();
      if (oldDoc.exists && oldDoc.data().image) {
        await deleteFromFirebase(oldDoc.data().image);
      }
    }
    
    await db.collection('products').doc(req.params.id).update(updateData);
    const doc = await db.collection('products').doc(req.params.id).get();
    res.json({ _id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (!db) throw new Error('Database not initialized');
    const docRef = db.collection('products').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) return res.status(404).json({ message: 'Product not found' });
    
    const product = doc.data();
    if (product.image) {
      await deleteFromFirebase(product.image);
    }
    
    await docRef.delete();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
