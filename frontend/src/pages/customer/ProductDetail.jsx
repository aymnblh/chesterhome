import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import Navbar from '../../components/customer/Navbar';
import Footer from '../../components/customer/Footer';

const API_URL = 'https://chesterhome.onrender.com';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div><Navbar /><div style={{padding:'10rem', textAlign:'center'}}>Chargement...</div><Footer /></div>;
  if (!product) return <div><Navbar /><div style={{padding:'10rem', textAlign:'center'}}>Produit introuvable.</div><Footer /></div>;

  const formattedPrice = new Intl.NumberFormat('fr-DZ').format(product.price) + ' DZD';
  const imageUrl = product.image.startsWith('http') ? product.image : `${API_URL}/${product.image}`;

  return (
    <>
      <Navbar />
      <div style={{ marginTop: '100px' }}></div>
      <main className="main-content fade-in">
        <div className="container">
          <div style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>
            <Link to="/" style={{ color: 'var(--text-light)' }}>Accueil</Link>
            <span style={{ margin: '0 0.5rem', color: 'var(--border)' }}>/</span>
            <Link to="/products" style={{ color: 'var(--text-light)' }}>Catalogue</Link>
            <span style={{ margin: '0 0.5rem', color: 'var(--border)' }}>/</span>
            <span style={{ color: 'var(--primary)' }}>{product.title}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
            <div>
              <div style={{ border: '1px solid var(--border)', padding: '1rem', backgroundColor: 'var(--white)' }}>
                <img src={imageUrl} alt={product.title} style={{ width: '100%', display: 'block' }} onError={(e) => e.target.src = 'https://placehold.co/600x600?text=Image+Non+Disponible'} />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="luxury-label" style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {product.category}
              </span>
              <h1 className="playfair" style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
                {product.title}
              </h1>
              <p className="cinzel" style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>
                {formattedPrice}
              </p>
              
              <div className="gold-divider" style={{ width: '100px', margin: '0 0 2rem 0' }}></div>
              
              <p style={{ color: 'var(--text)', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
                {product.description}
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', border: '1px solid var(--border)' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '10px 15px', background: 'none', border: 'none', cursor: 'pointer' }}>-</button>
                  <input type="text" value={quantity} readOnly style={{ width: '50px', textAlign: 'center', border: 'none', padding: '10px 0' }} />
                  <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '10px 15px', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
                </div>
                <button 
                  className="btn-primary" 
                  style={{ flexGrow: 1 }}
                  onClick={() => addToCart(product, quantity)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Ajouter au Panier' : 'Rupture de Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
