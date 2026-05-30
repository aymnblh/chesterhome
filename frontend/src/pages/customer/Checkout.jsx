import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import Navbar from '../../components/customer/Navbar';
import Footer from '../../components/customer/Footer';

const API_URL = 'https://chesterhome.onrender.com';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useContext(CartContext);
  
  // Redirect if accessed directly without cart/wilaya
  if (!location.state || cartItems.length === 0) {
    React.useEffect(() => navigate('/cart'), [navigate]);
    return null;
  }

  const { wilaya, deliveryType, deliveryPrice } = location.state;
  const total = cartSubtotal + deliveryPrice;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const orderData = {
      items: cartItems.map(item => ({
        product: item.product._id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      customer: formData,
      wilaya: {
        code: wilaya.code,
        name: wilaya.name
      },
      deliveryType,
      deliveryPrice,
      subtotal: cartSubtotal,
      totalPrice: total
    };

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      const data = await res.json();
      if (res.ok) {
        clearCart();
        navigate('/order-success', { state: { order: data } });
      } else {
        setError(data.message || "Une erreur s'est produite");
        setLoading(false);
      }
    } catch (err) {
      setError("Impossible de se connecter au serveur");
      setLoading(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('fr-DZ').format(price) + ' DZD';

  return (
    <>
      <Navbar />
      <div style={{ marginTop: '100px' }}></div>
      <main className="main-content fade-in">
        <div className="container">
          <h1 className="section-title">Finalisation</h1>
          <div className="gold-divider"></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
            <div>
              <div style={{ backgroundColor: 'var(--white)', padding: '2rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <h3 className="playfair" style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Vos Coordonnées</h3>
                
                {error && <div style={{ color: 'var(--white)', backgroundColor: 'var(--accent)', padding: '1rem', marginBottom: '1rem', borderRadius: 'var(--radius)' }}>{error}</div>}
                
                <form id="checkout-form" onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label>Nom Complet *</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Ex: Ahmed Benali" />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label>Numéro de Téléphone *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Ex: 0555 12 34 56" />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label>Adresse {deliveryType === 'home' && '*'}</label>
                    <textarea 
                      name="address" 
                      required={deliveryType === 'home'} 
                      value={formData.address} 
                      onChange={handleChange} 
                      rows="3" 
                      placeholder="Votre adresse détaillée"
                    ></textarea>
                    {deliveryType === 'agency' && <small style={{ color: 'var(--text-light)' }}>Facultatif pour la livraison en point relais</small>}
                  </div>
                </form>
              </div>
            </div>

            <div>
              <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', position: 'sticky', top: '120px' }}>
                <h3 className="playfair" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Résumé</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  {cartItems.map(item => (
                    <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-light)' }}>{item.quantity}x {item.product.title}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Sous-total</span>
                    <span className="cinzel">{formatPrice(cartSubtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                      Livraison ({wilaya.name} - {deliveryType === 'home' ? 'Domicile' : 'Relais'})
                    </span>
                    <span className="cinzel">{formatPrice(deliveryPrice)}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <span>Total à payer</span>
                  <span className="cinzel" style={{ color: 'var(--primary)' }}>{formatPrice(total)}</span>
                </div>
                
                <button 
                  type="submit"
                  form="checkout-form"
                  className="btn-primary" 
                  style={{ width: '100%' }}
                  disabled={loading}
                >
                  {loading ? 'Traitement...' : 'Confirmer la Commande'}
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

export default Checkout;
