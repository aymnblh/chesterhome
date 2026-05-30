import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content fade-in-up">
        <h1 className="hero-title">L'Art du Mobilier d'Exception</h1>
        <div className="gold-divider"></div>
        <p className="hero-subtitle">
          Découvrez notre collection de meubles artisanaux, où chaque pièce raconte une histoire de luxe et de tradition.
        </p>
        <Link to="/products" className="btn-primary">Explorer la Collection</Link>
      </div>
    </section>
  );
};

export default Hero;
