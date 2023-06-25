import './styles/App.scss';
import { getAuth, onAuthStateChanged, setPersistence, browserSessionPersistence } from "firebase/auth"
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Dev from './components/Dev';

function App() {
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const auth = getAuth();
  const dev = true;
  setPersistence(auth, browserSessionPersistence)





//callback passed to the onAuthStateChanged function that gets 
//called whenever the auth variable changes/ new instance is assigned


useEffect(() => {
  const setPersistenceForAuth = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence);
    } catch (error) {
      console.log("Error setting persistence: " + error.message);
    }
  };

  setPersistenceForAuth();
}, [auth]);

useEffect(() => {
  const authChangeCallback = (user) => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsAuthChecked(true);
  };

  const unsubFromAuthStateObserver = onAuthStateChanged(auth, authChangeCallback);

  return () => {
    unsubFromAuthStateObserver();
  };
}, [auth]);


useEffect(()=>{
  setLoading(true)
  setTimeout(()=>{
    setLoading(false)
  }, 7000)
}, [])
  if(dev) {
    return (
        <Dev/>
    )
  }
  //loading state if authentication state hasnt yet been checked
  if(loading || !isAuthChecked ){
    return (
      <SplashScreen/>
    )
  }
  return (
    <div className="App">
      <Router>
      <PrivateRoute path="/" component={Dashboard} isAuthenticated={isAuthenticated} />
        <PublicRoute path="/login" component={Auth} isAuthenticated={isAuthenticated} />
      </Router>
      
    </div>
  );
}

export default App;
