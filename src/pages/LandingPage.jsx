import React from 'react';
import Header from '../components/HeaderSearch/HeaderSearch';
import Footer from '../components/Footer/Footer';
import PopularGames from '../components/PopularGameCarousel/PopularGameCarousel';
import ClassicGames from '../components/ClassicGames/ClassicGames';
import NewGames from '../components/NewGames/NewGames';
import GameTrailer from '../components/GameTrailer/GameTrailer';

const Home = () => {

  return (
    <div>
      <Header />
      <PopularGames />
      <ClassicGames />
      <NewGames />
      <GameTrailer />
      <Footer />
    </div>
  );
};

export default Home;
