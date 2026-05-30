import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError(data.message || 'Identifiants invalides');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)' }}>
      <div style={{ backgroundColor: 'var(--white)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px var(--shadow-md)', maxWidth: '400px', width: '100%', border: '1px solid var(--border)' }}>
        <h1 className="playfair" style={{ textAlign: 'center', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>ChesterHome</h1>
        <p className="cinzel" style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '2rem' }}>Administration</p>
        
        {error && <div style={{ color: 'var(--white)', backgroundColor: 'var(--accent)', padding: '10px', borderRadius: 'var(--radius)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label>Nom d'utilisateur</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label>Mot de passe</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Connexion...' : 'Se Connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
