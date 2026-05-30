import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Edit, Trash2, Plus } from 'lucide-react';

const API_URL = 'http://localhost:5000';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          fetchProducts();
        } else {
          alert('Erreur lors de la suppression');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('fr-DZ').format(price) + ' DZD';

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1 className="playfair">Gestion des Produits</h1>
        <Link to="/admin/products/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px' }}>
          <Plus size={18} /> Ajouter
        </Link>
      </div>

      {loading ? (
        <div>Chargement...</div>
      ) : products.length === 0 ? (
        <div style={{ backgroundColor: 'var(--white)', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>Aucun produit trouvé.</p>
          <Link to="/admin/products/new" className="btn-secondary">Ajouter votre premier produit</Link>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const imgUrl = product.image.startsWith('http') ? product.image : `${API_URL}/${product.image}`;
              return (
                <tr key={product._id}>
                  <td>
                    <img src={imgUrl} alt={product.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius)' }} onError={(e) => e.target.src = 'https://placehold.co/50x50'} />
                  </td>
                  <td style={{ fontWeight: '600' }}>{product.title}</td>
                  <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                  <td className="cinzel" style={{ fontWeight: '600' }}>{formatPrice(product.price)}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem', 
                      backgroundColor: product.inStock ? '#e6f4ea' : '#fce8e6',
                      color: product.inStock ? '#1e8e3e' : '#d93025'
                    }}>
                      {product.inStock ? 'En Stock' : 'Rupture'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/admin/products/edit/${product._id}`} style={{ color: 'var(--primary)', padding: '5px' }}>
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} style={{ color: 'var(--accent)', background: 'none', border: 'none', padding: '5px', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
