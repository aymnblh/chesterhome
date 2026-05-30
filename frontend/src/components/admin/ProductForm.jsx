import React, { useState, useEffect } from 'react';

const API_URL = 'https://chesterhome.onrender.com';

const ProductForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'salon',
    inStock: true
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        category: initialData.category || 'salon',
        inStock: initialData.inStock ?? true
      });
      if (initialData.image) {
        setPreview(initialData.image.startsWith('http') ? initialData.image : `${API_URL}/${initialData.image}`);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) {
      data.append('image', image);
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', maxWidth: '800px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <label>Titre *</label>
          <input type="text" name="title" required value={formData.title} onChange={handleChange} />
        </div>
        <div>
          <label>Prix (DZD) *</label>
          <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} />
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label>Catégorie *</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="salon">Salon</option>
          <option value="chambre">Chambre</option>
          <option value="salle-a-manger">Salle à Manger</option>
          <option value="bureau">Bureau</option>
          <option value="decoration">Décoration</option>
        </select>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label>Description *</label>
        <textarea name="description" required rows="5" value={formData.description} onChange={handleChange}></textarea>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" name="inStock" id="inStock" checked={formData.inStock} onChange={handleChange} style={{ width: 'auto' }} />
        <label htmlFor="inStock" style={{ margin: 0 }}>En Stock</label>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label>Image du Produit {!initialData && '*'}</label>
        <input type="file" accept="image/*" onChange={handleImageChange} required={!initialData} />
        {preview && (
          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>Aperçu :</p>
            <img src={preview} alt="Aperçu" style={{ maxWidth: '200px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? 'Enregistrement...' : 'Enregistrer le Produit'}
      </button>
    </form>
  );
};

export default ProductForm;
