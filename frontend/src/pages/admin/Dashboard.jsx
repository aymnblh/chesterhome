import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const API_URL = 'https://chesterhome.onrender.com';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [productsRes, ordersRes] = await Promise.all([
          fetch(`${API_URL}/api/products`),
          fetch(`${API_URL}/api/orders`, { headers })
        ]);

        if (productsRes.ok && ordersRes.ok) {
          const products = await productsRes.json();
          const orders = await ordersRes.json();

          const revenue = orders.filter(o => o.status === 'delivered').reduce((sum, order) => sum + order.totalPrice, 0);
          const pending = orders.filter(o => o.status === 'pending').length;

          setStats({
            products: products.length,
            orders: orders.length,
            revenue,
            pending
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatPrice = (price) => new Intl.NumberFormat('fr-DZ').format(price) + ' DZD';

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1 className="playfair">Tableau de Bord</h1>
      </div>

      {loading ? (
        <div>Chargement des statistiques...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          
          <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <h3 className="cinzel" style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Produits</h3>
            <p className="playfair" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{stats.products}</p>
          </div>
          
          <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <h3 className="cinzel" style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Commandes</h3>
            <p className="playfair" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{stats.orders}</p>
          </div>

          <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <h3 className="cinzel" style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>En Attente</h3>
            <p className="playfair" style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>{stats.pending}</p>
          </div>

          <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <h3 className="cinzel" style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Revenus</h3>
            <p className="playfair" style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>{formatPrice(stats.revenue)}</p>
          </div>

        </div>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
