import React from 'react';
import Header from "../components/Header/Header";
import SettingsOptions from "../components/Settings/Settings";
import Footer from "../components/Footer/Footer";

const Settings = () => {
  return (
    <div>
      <Header></Header>
      <SettingsOptions></SettingsOptions>
      <Footer />
    </div>
  );
};

export default Settings;
