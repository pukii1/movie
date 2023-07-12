import React from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

/**
 * Google sing in/up component for firebase google auth
 */
export default function GoogleSignIn({setUser}) {
  
    
const auth = getAuth();
const provider = new GoogleAuthProvider();

/**
 * Handler function
 * signs in/up user via their google acc
 */
const handleSignIn = ()=>{
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      setUser(result.user);
    }).catch((error) => {
      // TODO: Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  
}
    return (
    <div>
      <button onClick={handleSignIn}className="googleSignIn">
        <FontAwesomeIcon icon={faGoogle}/>
        </button>
    </div>
  )
}
