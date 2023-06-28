import React from 'react'
import { getAuth, signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom';

export default function SignOut() {
    const auth = getAuth();
    const navigate = useNavigate();

    const handleSignOut = ()=>{
        signOut(auth).then(() => {
        navigate("/")
      }).catch((error) => {
        // An error happened.
      });
    }

    return (
    <div className="signOut">
        <button onClick={handleSignOut} className="signOut">Sign Out</button>
    </div>
  )
}
