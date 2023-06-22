import './styles/App.scss';
import { getAuth, onAuthStateChanged } from "firebase/auth"
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';



function App() {

  const [isAuthChecked, setIsAuthChecked] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const auth = getAuth();






//callback passed to the onAuthStateChanged function that gets 
//called whenever the auth variable changes/ new instance is assigned
const authChangeCallback = (user) => {
  if (user) {
    setIsAuthenticated(true);
  } else {
    setIsAuthenticated(false);
  }

  setIsAuthChecked(true);
}

useEffect(()=>{
  //storing firebase onAuthStateChanged return value -> function to unsub from the auth observer
  const unsubFromAuthStateObserver = 
  //setting up a new AuthStateObserver whenever @auth changes
  //triggers callback whenever @auth changes
  onAuthStateChanged(auth, authChangeCallback);
  
  //clean-up function
  return ()=>{
    unsubFromAuthStateObserver();
  }
}, [auth])



  //loading state if authentication state hasnt yet been checked
  if( !isAuthChecked ){
    return (
      <p>loading....</p>
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
