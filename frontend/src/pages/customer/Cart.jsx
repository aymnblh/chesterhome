import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { Trash2 } from 'lucide-react';
import Navbar from '../../components/customer/Navbar';
import Footer from '../../components/customer/Footer';

const API_URL = 'http://localhost:5000';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal } = useContext(CartContext);
  const [wilayas, setWilayas] = useState([]);
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [deliveryType, setDeliveryType] = useState('home'); // 'home' or 'agency'
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/wilayas`)
      .then(res => res.json())
      .then(data => {
        setWilayas(data.filter(w => w.isActive));
      })
      .catch(err => console.error(err));
  }, []);

  const wilayaData = wilayas.find(w => w.code.toString() === selectedWilaya);
  const deliveryPrice = wilayaData 
    ? (deliveryType === 'home' ? wilayaData.homeDelivery : wilayaData.agencyDelivery)
    : 0;
    
  const total = cartSubtotal + deliveryPrice;

  const handleCheckout = () => {
    if (!selectedWilaya) {
      alert("Veuillez sélectionner une wilaya de livraison.");
      return;
    }
    navigate('/checkout', { state: { wilaya: wilayaData, deliveryType, deliveryPrice } });
  };

  const formatPrice = (price) => new Intl.NumberFormat('fr-DZ').format(price) + ' DZD';

  return (
    <>
      <Navbar />
      <div style={{ marginTop: '100px' }}></div>
      <main className="main-content fade-in">
        <div className="container">
          <h1 className="section-title">Votre Panier</h1>
          <div className="gold-divider"></div>

          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--text-light)' }}>
                Votre panier est d'une élégante vacuité.
              </p>
              <Link to="/products" className="btn-primary">Découvrir Notre Collection</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
              <div className="cart-items">
                <table className="data-table" style={{ marginBottom: '2rem' }}>
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Prix</th>
                      <th>Quantité</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => {
                      const imgUrl = item.product.image.startsWith('http') ? item.product.image : `${API_URL}/${item.product.image}`;
                      return (
                        <tr key={item.product._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <img src={imgUrl} alt={item.product.title} style={{ width: '60px', height: '60px', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://placehold.co/60x60'} />
                              <Link to={`/product/${item.product._id}`} style={{ fontWeight: '600' }}>{item.product.title}</Link>
                            </div>
                          </td>
                          <td>{formatPrice(item.product.price)}</td>
                          <td>
                            <div style={{ display: 'flex', border: '1px solid var(--border)', width: 'fit-content' }}>
                              <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} style={{ padding: '5px 10px', background: 'none', border: 'none', cursor: 'pointer' }}>-</button>
                              <span style={{ padding: '5px 10px' }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} style={{ padding: '5px 10px', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
                            </div>
                          </td>
                          <td style={{ fontWeight: '600' }}>{formatPrice(item.product.price * item.quantity)}</td>
                          <td>
                            <button onClick={() => removeFromCart(item.product._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)' }}>
                              <Trash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                <div style={{ backgroundColor: 'var(--white)', padding: '2rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                  <h3 className="playfair" style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Informations de Livraison</h3>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label>Sélectionnez votre Wilaya</label>
                    <select value={selectedWilaya} onChange={(e) => setSelectedWilaya(e.target.value)}>
                      <option value="">-- Choisir une Wilaya --</option>
                      {wilayas.map(w => (
                        <option key={w.code} value={w.code}>
                          {w.code.toString().padStart(2, '0')} - {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedWilaya && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div 
                        onClick={() => setDeliveryType('home')}
                        style={{ padding: '1rem', border: `2px solid ${deliveryType === 'home' ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'center' }}
                      >
                        <h4 className="cinzel">À Domicile</h4>
                        <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{formatPrice(wilayaData?.homeDelivery || 0)}</p>
                      </div>
                      <div 
                        onClick={() => setDeliveryType('agency')}
                        style={{ padding: '1rem', border: `2px solid ${deliveryType === 'agency' ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'center' }}
                      >
                        <h4 className="cinzel">Point Relais</h4>
                        <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{formatPrice(wilayaData?.agencyDelivery || 0)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', position: 'sticky', top: '120px' }}>
                  <h3 className="playfair" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Résumé de la commande</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span>Sous-total</span>
                    <span className="cinzel">{formatPrice(cartSubtotal)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span>Frais de livraison</span>
                    <span className="cinzel">{selectedWilaya ? formatPrice(deliveryPrice) : '-'}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    <span>Total</span>
                    <span className="cinzel" style={{ color: 'var(--primary)' }}>{selectedWilaya ? formatPrice(total) : formatPrice(cartSubtotal)}</span>
                  </div>
                  
                  <button 
                    className="btn-primary" 
                    style={{ width: '100%' }}
                    onClick={handleCheckout}
                    disabled={!selectedWilaya}
                  >
                    Passer la commande
                  </button>
                  {!selectedWilaya && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.5rem', textAlign: 'center' }}>Veuillez choisir une wilaya</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
