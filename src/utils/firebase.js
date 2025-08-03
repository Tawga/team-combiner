import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBH00AobqzQ3c9x1lLSgQ0vdK6ShmAPxmE",
  authDomain: "team-combiner.firebaseapp.com",
  projectId: "team-combiner",
  storageBucket: "team-combiner.firebasestorage.app",
  messagingSenderId: "921680043536",
  appId: "1:921680043536:web:d908f3bd85d488a4dcb495",
  measurementId: "G-C9RDTC1R9Y"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const fetchTierCaps = async () => {
    const data = await getDocs(collection(db, "caps"));
    const tierCaps = data.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return tierCaps.sort((a,b) => a.cap - b.cap);
}

export const fetchAllPlayers = async () => {
    const querySnapshot = await getDocs(collection(db, "players"));
    const playersList = querySnapshot.docs.map(doc => ({
        // The document ID might be useful as a key later
        id: doc.id,
        // Spread the rest of the document data (player_name, cmv, etc.)
        ...doc.data()
    }));
    return playersList;
};