import React from 'react';
import Header from '../components/Header/Header';
import RegisterForm from '../components/Register/Register';
import Footer from '../components/Footer/Footer';

const Register = () => {
  return (
    <div>
      <Header></Header>
      <RegisterForm />
      <Footer />
    </div>
  );
};

export default Register;