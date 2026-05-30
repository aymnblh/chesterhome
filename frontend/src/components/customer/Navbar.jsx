import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useContext(CartContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="navbar-logo">ChesterHome</Link>
        
        <div className={`navbar-links ${menuOpen ? 'active' : ''}`} style={{ display: menuOpen ? 'flex' : '' }}>
          <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link to="/products" className="navbar-link" onClick={() => setMenuOpen(false)}>Catalogue</Link>
          <a href="/#about" className="navbar-link" onClick={() => setMenuOpen(false)}>À Propos</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/cart" className="cart-icon-wrapper">
            <ShoppingBag size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <button 
            className="mobile-menu-btn" 
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }} // Add media query in CSS to show
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
