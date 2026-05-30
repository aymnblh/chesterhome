import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductForm from '../../components/admin/ProductForm';

const API_URL = 'https://chesterhome.onrender.com';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData // multipart/form-data
      });
      
      if (res.ok) {
        navigate('/admin/products');
      } else {
        const data = await res.json();
        alert(data.message || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1 className="playfair">Ajouter un Produit</h1>
      </div>
      <ProductForm onSubmit={handleSubmit} isLoading={loading} />
    </AdminLayout>
  );
};

export default AddProduct;
