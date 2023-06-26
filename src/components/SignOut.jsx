import React from 'react'
import { getAuth, signOut } from "firebase/auth"


export default function SignOut() {
    const auth = getAuth();

    const handleSignOut = ()=>{
        signOut(auth).then(() => {
        // Sign-out successful.
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
