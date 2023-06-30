import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../configs/firebaseConfig"

export const likeMovie = async (userId, movieId)=>{
    console.log(db)
    console.log(doc)
    // Reference the document for the user
    const userDocRef = doc(db, "favs", userId);

    // Retrieve the user document
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        // Document exists, check if the movieId is in the favMovies array
        const favMovies = userDocSnap.data().favMovies;

        if (favMovies.includes(movieId)) {
            try{
                // If the movieId exists, remove it from the favMovies array
                await updateDoc(userDocRef, {
                    favMovies: arrayRemove(movieId),
                });
                console.log(`removed ${movieId} from favs`)
            }
            catch(error){
                console.error(`error removing ${movieId} from favs`)
            }
            
        } else {
            try{
                
                // If the movieId doesn't exist, add it to the favMovies array
                await updateDoc(userDocRef, {
                    favMovies: arrayUnion(movieId),
                });
                console.log(`Added ${movieId} to favs`)
            }
            catch(error){
                console.error(`error adding ${movieId} to favs`)
            }
        }
    }
}