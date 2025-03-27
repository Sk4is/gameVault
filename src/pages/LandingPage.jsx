import React from 'react';
import Header from '../components/Header/Header';
import Landing from '../components/Landing/Landing';
import Footer from '../components/Footer/Footer';
import GameCarousel from '../components/GameCarousel/GameCarousel';

const Home = () => {

  return (
    <div>
      <Header />
      <GameCarousel />
      <Footer />
    </div>
  );
};

export default Home;
