import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductForm from '../../components/admin/ProductForm';

const API_URL = 'http://localhost:5000';

const EditProduct = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setInitialData(data);
        setPageLoading(false);
      })
      .catch(err => {
        console.error(err);
        setPageLoading(false);
      });
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        navigate('/admin/products');
      } else {
        const data = await res.json();
        alert(data.message || 'Erreur lors de la modification');
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
        <h1 className="playfair">Modifier le Produit</h1>
      </div>
      {pageLoading ? (
        <div>Chargement...</div>
      ) : initialData ? (
        <ProductForm initialData={initialData} onSubmit={handleSubmit} isLoading={loading} />
      ) : (
        <div>Produit introuvable</div>
      )}
    </AdminLayout>
  );
};

export default EditProduct;
