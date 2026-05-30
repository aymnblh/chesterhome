import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3 className="footer-title playfair">ChesterHome</h3>
            <p className="footer-text">
              L'excellence du mobilier. Nous créons des pièces intemporelles 
              qui allient l'artisanat traditionnel à l'élégance moderne.
            </p>
          </div>
          <div>
            <h3 className="footer-title playfair">Navigation</h3>
            <ul className="footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/products">Catalogue</Link></li>
              <li><Link to="/cart">Panier</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="footer-title playfair">Contact</h3>
            <ul className="footer-links">
              <li>📍 Boumerdes, Algérie</li>
              <li>📞 +213 799456156 / +213 770879207</li>
              <li>✉️ contact@chesterhome.dz</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="gold-divider" style={{ width: '100px', margin: '0 auto 1rem' }}></div>
          <p className="cinzel">© 2026 ChesterHome. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
