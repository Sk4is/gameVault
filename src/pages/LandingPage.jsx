import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import GameCarousel from '../components/PopularGameCarousel/PopularGameCarousel';

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
