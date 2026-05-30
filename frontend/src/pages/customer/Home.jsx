import React, { useState, useEffect } from 'react';
import Navbar from '../../components/customer/Navbar';
import Hero from '../../components/customer/Hero';
import ProductCard from '../../components/customer/ProductCard';
import Footer from '../../components/customer/Footer';

const API_URL = 'https://chesterhome.onrender.com';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setFeaturedProducts(data.slice(0, 6));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <main className="main-content">
        <div className="container">
          <h2 className="section-title">Pièces Maîtresses</h2>
          <div className="gold-divider"></div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          <div id="about" style={{ marginTop: '5rem', textAlign: 'center', maxWidth: '800px', margin: '5rem auto 0' }}>
            <h2 className="section-title">Notre Héritage</h2>
            <div className="gold-divider"></div>
            <p className="hero-subtitle">
              Chaque meuble ChesterHome est le fruit d'un savoir-faire ancestral. 
              Nos artisans sélectionnent les bois les plus nobles et les tissus les plus 
              raffinés pour créer des pièces qui traverseront les générations.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
