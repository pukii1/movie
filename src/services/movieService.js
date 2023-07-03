import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../configs/firebaseConfig"


//caching functions
// Cache the liked movies
export const cacheLikedMovies = (userId, likedMovies) => {
    const cacheKey = `likedMovies_${userId}`;
    localStorage.setItem(cacheKey, JSON.stringify(likedMovies));
  };
  //cache the liked tv series
  export const cacheLikedTVSeries = (userId, likedTVSeries) =>{
    const cacheKey = `likedTVSeries_${userId}`
    localStorage.setItem(cacheKey, JSON.stringify(likedTVSeries))
  }
  // Retrieve the cached liked movies
 export const getCachedLikedMovies = (userId) => {
    const cacheKey = `likedMovies_${userId}`;
    const cachedData = localStorage.getItem(cacheKey);
    return JSON.parse(cachedData);
  };
  // Retrieve the cached liked tv series
  export const getCachedLikedTVSeries = (userId) => {
    const cacheKey = `likedTVSeries_${userId}`;
    const cachedData = localStorage.getItem(cacheKey);
    return JSON.parse(cachedData);
  };





//movie-db helpers
const createDocAddMovieToDB = async (userId, movieData)=>{
    try{
        await setDoc(doc(db, "favs", userId), {
            favMovies : [movieData]
        });
        console.log(`created new doc in "favs" for ${userId}`)
        console.log(`Added ${movieData.id} to favs`)
    } 
    catch(error) {
        console.error(error)
    }
}
const removeMovieFromDB = async (userDocRef, movieData)=>{
    try{
        // If the movieId exists, remove it from the favMovies array
        await updateDoc(userDocRef, {
            favMovies: arrayRemove(movieData),
        });
        console.log(`removed ${movieData.id} from favs`)
    }
    catch(error){
        console.error(`error removing ${movieData.id} from favs`)
    }
}
const addMovieToDB = async (userDocRef, movieData)=>{
    try{         
        // If the movieId doesn't exist, add it to the favMovies array
        await updateDoc(userDocRef, {
            favMovies: arrayUnion(movieData),
        });
        console.log(`Added ${movieData.id} to favs`)
    }
    catch(error){
        console.error(`error adding ${movieData.id} to favs`)
    }
}


//handler function -> adds/removes movie from users favs-collection/ 
//creates new doc in collection if user doesnt already have one
export const likeMovie = async (userId, movieData)=>{
    console.log(userId)
    // Reference the document for the user
    const userDocRef = doc(db, "favs", userId);

    // Retrieve the user document
    const userDocSnap = await getDoc(userDocRef);

    //user already has a "favs" document
    if (userDocSnap.exists()) {
        //check if user already has a "favMovies" entry
        if(userDocSnap.data().favMovies){
            console.log("favMovies entry exists")
            // Document exists, check if the movieId is in the favMovies array
            const favMovies = userDocSnap.data().favMovies;
            if (!favMovies.some((mv)=> mv.id == movieData.id)) {
                addMovieToDB(userDocRef, movieData)
            } else {
                removeMovieFromDB(userDocRef, movieData); 
            }

        }
        //user doesnt already have a "favMovies entry"
        else {
            addMovieToDB(userDocRef, movieData)
        }
        
    } 
    //user doesnt already have "favs" document -> create new doc
    else {
        createDocAddMovieToDB(userId, movieData);
    }

    //update cache accordingly
    const likedMovs = await getLikedMovies(userId);
    cacheLikedMovies(userId, likedMovs)
}

export const getLikedMovies = async (userId) =>{
    const cachedLikedMovies = getCachedLikedMovies(userId)
    if(cachedLikedMovies == null){
        //reference desired doc
        const userDocRef = doc(db, "favs", userId);
            
        // Retrieve the user doc from favs-collection
        const userDocSnap = await getDoc(userDocRef);

        //check if doc exists
        if (userDocSnap.exists()) {
            let favMovies = userDocSnap.data().favMovies;
            if(favMovies !== undefined){
                console.log("fetched liked Movies from DB")
                // return the favMovies entry
                return userDocSnap.data().favMovies;
            }
        }
        //doc doesnt exist -> return null
        return null;
    } else {
        console.log("fetched liked Movies from cache")
        return cachedLikedMovies
    }
    
}




//tv-series-db helpers
const createDocAddSeriesToDB = async (userId, seriesData)=>{
    try{
        await setDoc(doc(db, "favs", userId), {
            favTVSeries : [seriesData]
        });
        console.log(`created new doc in "favs" for ${userId}`)
        console.log(`Added ${seriesData.id} to favs`)
    } 
    catch(error) {
        console.error(error)
    }
}
const removeSeriesFromDB = async (userDocRef, seriesData)=>{
    try{
        // If the movieId exists, remove it from the favMovies array
        await updateDoc(userDocRef, {
            favTVSeries: arrayRemove(seriesData),
        });
        console.log(`removed ${seriesData.id} from favs`)
    }
    catch(error){
        console.error(`error removing ${seriesData.id} from favs`)
    }
}
const addSeriesToDB = async (userDocRef, seriesData)=>{
    try{         
        // If the movieId doesn't exist, add it to the favMovies array
        await updateDoc(userDocRef, {
            favTVSeries: arrayUnion(seriesData),
        });
        console.log(`Added ${seriesData.id} to favs`)
    }
    catch(error){
        console.error(`error adding ${seriesData.id} to favs`)
    }
}

export const likeTVSeries = async (userId, seriesData)=>{
    console.log(userId)
    // Reference the document for the user
    const userDocRef = doc(db, "favs", userId);

    // Retrieve the user document
    const userDocSnap = await getDoc(userDocRef);

    //user already has a "favs" document
    if (userDocSnap.exists()) {
        if(userDocSnap.data().favTVSeries){
            console.log("favTVSeries entry exists")
            // Document exists, check if the movieId is in the favMovies array
            const favSeries = userDocSnap.data().favTVSeries;
            if (!favSeries.some((sr)=> sr.id == seriesData.id)) {
                addSeriesToDB(userDocRef, seriesData)
            } else {
                removeSeriesFromDB(userDocRef, seriesData); 
            }
        }
        //user doesnt already have "favTVSeries" entry in "favs" document -> create new doc
        else {
            addSeriesToDB(userDocRef, seriesData)
        }
       
    } 
    //user doesnt already have "favs" document -> create new doc
    else {
        createDocAddSeriesToDB(userId, seriesData);
    }
    

    //update cache accordingly
    const likedSrs = await getLikedSeries(userId);
    cacheLikedTVSeries(userId, likedSrs)
}

export const getLikedSeries = async (userId) =>{
    console.log("fetching series.....")
    const cachedLikedSeries = getCachedLikedTVSeries(userId);
    if(cachedLikedSeries == null){
        //reference desired doc
        const userDocRef = doc(db, "favs", userId);
            
        // Retrieve the user doc from favs-collection
        const userDocSnap = await getDoc(userDocRef);

        //check if doc exists
        if (userDocSnap.exists()) {
            let favSeries = userDocSnap.data().favTVSeries
            if(favSeries !== undefined){
                console.log("fetched liked series from DB")
                // return the favTVSeries entry
                return userDocSnap.data().favTVSeries;
            }
        }
        //doc doesnt exist -> return null
        return null;
    } else {
        console.log("fetched liked series from cache")
        return cachedLikedSeries;
    }
}


//random movie/series carousel functions
//get random movies/series from cache
export const getRandomMoviesFromCache = ()=>{
    const cacheKey = `randomMovies`;
    const cachedData = localStorage.getItem(cacheKey);
    return cachedData ? JSON.parse(cachedData) : null
}
export const getRandomSeriesFromCache = ()=>{
    const cacheKey = `randomSeries`;
    const cachedData = localStorage.getItem(cacheKey);
    //return null if cahcedData isnt found, null or undefined
    return cachedData ? JSON.parse(cachedData) : null
}







const randomMoviesUrl = 'https://moviesdatabase.p.rapidapi.com/titles/random?list=most_pop_movies'
const randomSeriesUrl =  'https://moviesdatabase.p.rapidapi.com/titles/random?list=most_pop_series';
const host = 'moviesdatabase.p.rapidapi.com'
const apiKey = 'f9e45181a3msh422b41bfbdd3bdbp127d70jsndf222028a016'
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': host
  }
};
const fetchData = async (url)=>{
    try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result.results);
    return result.results;
    } catch (error) {
        return new Error("error fetching from " + url)
    }
}
//get random movies/series from API
export const getRandomMoviesFromAPI = async () => {
    //fetch random movies from API...
    let rMovies = await fetchData(randomMoviesUrl)
    cacheRandomMovies(rMovies)
    return rMovies
}
export const getRandomSeriesFromAPI = async () => {
    //fetch random series from API....
    let rSeries = await fetchData(randomSeriesUrl)
    cacheRandomSeries(rSeries)
    return rSeries
}

//helpers to update random movies/series entry in cache after fetching new batch from API
const cacheRandomMovies = (randomMovies)=>{
    const cacheKey = `randomMovies`;
    localStorage.setItem(cacheKey, JSON.stringify(randomMovies));
}
const cacheRandomSeries = (randomSeries)=>{
    const cacheKey = `randomSeries`;
    localStorage.setItem(cacheKey, JSON.stringify(randomSeries));
}

