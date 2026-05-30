import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import Navbar from '../../components/customer/Navbar';
import Footer from '../../components/customer/Footer';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  
  if (!location.state || !location.state.order) {
    return <Navigate to="/" />;
  }

  const { order } = location.state;

  return (
    <>
      <Navbar />
      <div style={{ marginTop: '100px' }}></div>
      <main className="main-content fade-in">
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <CheckCircle size={64} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
          <h1 className="playfair" style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', marginBottom: '1rem' }}>
            Merci pour votre commande !
          </h1>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            Votre commande a été enregistrée avec succès. Notre équipe vous contactera 
            prochainement au <strong>{order.customer.phone}</strong> pour confirmer la livraison.
          </p>
          
          <div style={{ backgroundColor: 'var(--white)', padding: '2rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'left', marginBottom: '2rem' }}>
            <h3 className="cinzel" style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary)' }}>Détails de la commande</h3>
            <p style={{ marginBottom: '0.5rem' }}><strong>Référence :</strong> #{order._id.substring(order._id.length - 6).toUpperCase()}</p>
            <p style={{ marginBottom: '0.5rem' }}><strong>Nom :</strong> {order.customer.fullName}</p>
            <p style={{ marginBottom: '0.5rem' }}><strong>Wilaya :</strong> {order.wilaya.name}</p>
            <p style={{ marginBottom: '0.5rem' }}><strong>Total :</strong> {new Intl.NumberFormat('fr-DZ').format(order.totalPrice)} DZD</p>
          </div>

          <Link to="/" className="btn-primary">Retour à l'accueil</Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderSuccess;
