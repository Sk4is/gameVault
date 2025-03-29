import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import PopularGames from '../components/PopularGameCarousel/PopularGameCarousel';
import ClassicGames from '../components/ClassicGames/ClassicGames';

const Home = () => {

  return (
    <div>
      <Header />
      <PopularGames />
      <ClassicGames />
      <Footer />
    </div>
  );
};

export default Home;
