import React from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'https://chesterhome.onrender.com';

const ProductCard = ({ product }) => {
  const formattedPrice = new Intl.NumberFormat('fr-DZ').format(product.price) + ' DZD';
  const imageUrl = product.image.startsWith('http') ? product.image : `${API_URL}/${product.image}`;

  return (
    <div className="product-card fade-in">
      <Link to={`/product/${product._id}`} className="product-image-container">
        <img src={imageUrl} alt={product.title} className="product-image" onError={(e) => e.target.src = 'https://placehold.co/400x300?text=Image+Non+Disponible'} />
      </Link>
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price cinzel">{formattedPrice}</p>
        <Link to={`/product/${product._id}`} className="btn-secondary" style={{ width: '100%' }}>Voir Détails</Link>
      </div>
    </div>
  );
};

export default ProductCard;
