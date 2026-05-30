import React, { useState, useEffect } from 'react';
import Navbar from '../../components/customer/Navbar';
import ProductCard from '../../components/customer/ProductCard';
import Footer from '../../components/customer/Footer';

const API_URL = 'http://localhost:5000';
const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'salon', label: 'Salon' },
  { id: 'chambre', label: 'Chambre' },
  { id: 'salle-a-manger', label: 'Salle à Manger' },
  { id: 'bureau', label: 'Bureau' },
  { id: 'decoration', label: 'Décoration' }
];

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, products]);

  return (
    <>
      <Navbar />
      <div style={{ marginTop: '100px' }}></div>
      <main className="main-content">
        <div className="container">
          <h1 className="section-title">Notre Collection</h1>
          <div className="gold-divider"></div>
          
          <div className="category-filter">
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement...</div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
              Aucun produit trouvé dans cette catégorie.
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Catalog;
