import React from 'react';
import logo from './logo.svg';
import './App.css';
import Maps from './components/mapsmodules/maps';
import Weatherapi from 'components/weather/Weatherapi';
function App() {
  return (
    <div >
      {/* <Maps/> */}
      <Weatherapi/>
    </div>
  );
}

export default App;
