import './styles/App.scss';
import SplashScreen from './components/SplashScreen';
import Auth from './components/Auth';
import { useEffect, useState } from 'react';



function App() {

  //Splash screen loading functionality
const [loading, setLoading] = useState(true);
const loadingTime = 2000;
useEffect(() => {
  // Simulate a loading process
  setTimeout(() => {
    setLoading(false);
  }, loadingTime); // Adjust the timeout duration as needed
}, []);

  return (
    <div className="App">
      { loading && <SplashScreen/>}
      {!loading && <Auth/>}
    </div>
  );
}

export default App;
