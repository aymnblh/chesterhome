import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const API_URL = 'https://chesterhome.onrender.com';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      } else {
        alert('Erreur lors de la mise à jour du statut');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('fr-DZ').format(price) + ' DZD';
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-DZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: '#fff3cd', color: '#856404' }; // Yellow
      case 'confirmed': return { bg: '#cce5ff', color: '#004085' }; // Blue
      case 'shipped': return { bg: '#e2e3e5', color: '#383d41' }; // Gray
      case 'delivered': return { bg: '#d4edda', color: '#155724' }; // Green
      case 'cancelled': return { bg: '#f8d7da', color: '#721c24' }; // Red
      default: return { bg: 'transparent', color: 'inherit' };
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmée' },
    { value: 'shipped', label: 'Expédiée' },
    { value: 'delivered', label: 'Livrée' },
    { value: 'cancelled', label: 'Annulée' }
  ];

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1 className="playfair">Gestion des Commandes</h1>
      </div>

      {loading ? (
        <div>Chargement...</div>
      ) : orders.length === 0 ? (
        <div style={{ backgroundColor: 'var(--white)', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-light)' }}>Aucune commande pour le moment.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Réf / Date</th>
              <th>Client</th>
              <th>Contact</th>
              <th>Livraison</th>
              <th>Total</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>
                  <div style={{ fontWeight: 'bold' }}>#{order._id.substring(order._id.length - 6).toUpperCase()}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{formatDate(order.createdAt)}</div>
                </td>
                <td>{order.customer.fullName}</td>
                <td>
                  <div>{order.customer.phone}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{order.customer.address}</div>
                </td>
                <td>
                  <div>{order.wilaya.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{order.deliveryType === 'home' ? 'Domicile' : 'Relais'}</div>
                </td>
                <td className="cinzel" style={{ fontWeight: 'bold' }}>{formatPrice(order.totalPrice)}</td>
                <td>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{ 
                      padding: '5px 10px', 
                      borderRadius: '15px', 
                      backgroundColor: getStatusColor(order.status).bg,
                      color: getStatusColor(order.status).color,
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
