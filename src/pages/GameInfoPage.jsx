import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Info from '../components/GameInfo/GameInfo';
import Review from '../components/Reviews/Reviews';

const Home = () => {

  return (
    <div>
      <Header />
      <Info />
      <Review />
      <Footer />
    </div>
  );
};

export default Home;
