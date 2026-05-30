import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Map, ShoppingCart, LogOut } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Tableau de Bord' },
    { path: '/admin/products', icon: <Package size={20} />, label: 'Produits' },
    { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Commandes' },
    { path: '/admin/wilayas', icon: <Map size={20} />, label: 'Tarifs Wilayas' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo playfair">
          <h2>ChesterHome<br/><span style={{fontSize:'0.9rem', color:'var(--text-light)', fontFamily:'Cinzel'}}>Administration</span></h2>
        </div>
        <ul className="admin-nav">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`admin-nav-item ${location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin') ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
          <li style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)' }}>
            <button 
              onClick={handleLogout}
              className="admin-nav-item"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: 'none' }}
            >
              <LogOut size={20} color="var(--accent)" />
              <span style={{ color: 'var(--accent)' }}>Déconnexion</span>
            </button>
          </li>
        </ul>
      </aside>
      <main className="admin-content fade-in">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
