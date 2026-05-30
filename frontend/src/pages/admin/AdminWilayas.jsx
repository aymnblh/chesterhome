import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Check, X, Search } from 'lucide-react';

const API_URL = 'https://chesterhome.onrender.com';

const AdminWilayas = () => {
  const [wilayas, setWilayas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWilayas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/wilayas`);
      if (res.ok) {
        const data = await res.json();
        setWilayas(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWilayas();
  }, []);

  const handleUpdate = async (id, field, value) => {
    try {
      const wilaya = wilayas.find(w => w._id === id);
      const updatedData = { ...wilaya, [field]: value };
      
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/wilayas/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(updatedData)
      });
      
      if (res.ok) {
        setWilayas(wilayas.map(w => w._id === id ? { ...w, [field]: value } : w));
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredWilayas = wilayas.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.code.toString().includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1 className="playfair">Tarifs de Livraison (Wilayas)</h1>
      </div>

      <div style={{ marginBottom: '2rem', position: 'relative', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder="Rechercher une wilaya..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '40px' }}
        />
        <Search size={20} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-light)' }} />
      </div>

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Code</th>
                <th>Nom</th>
                <th>Livraison Domicile (DZD)</th>
                <th>Livraison Relais (DZD)</th>
                <th style={{ textAlign: 'center' }}>Actif</th>
              </tr>
            </thead>
            <tbody>
              {filteredWilayas.map(w => (
                <tr key={w._id} style={{ opacity: w.isActive ? 1 : 0.5 }}>
                  <td className="cinzel" style={{ fontWeight: 'bold' }}>{w.code.toString().padStart(2, '0')}</td>
                  <td style={{ fontWeight: '600' }}>{w.name}</td>
                  <td>
                    <input 
                      type="number" 
                      value={w.homeDelivery} 
                      onChange={(e) => setWilayas(wilayas.map(item => item._id === w._id ? { ...item, homeDelivery: parseInt(e.target.value) || 0 } : item))}
                      onBlur={(e) => handleUpdate(w._id, 'homeDelivery', parseInt(e.target.value) || 0)}
                      style={{ width: '100px', padding: '5px' }}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      value={w.agencyDelivery} 
                      onChange={(e) => setWilayas(wilayas.map(item => item._id === w._id ? { ...item, agencyDelivery: parseInt(e.target.value) || 0 } : item))}
                      onBlur={(e) => handleUpdate(w._id, 'agencyDelivery', parseInt(e.target.value) || 0)}
                      style={{ width: '100px', padding: '5px' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => handleUpdate(w._id, 'isActive', !w.isActive)}
                      style={{ 
                        background: w.isActive ? 'var(--primary)' : 'var(--border)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: '30px', 
                        height: '30px', 
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {w.isActive ? <Check size={16} /> : <X size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminWilayas;
