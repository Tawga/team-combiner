import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { TierCap, DatabasePlayer } from "../types";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, import.meta.env.VITE_FIRESTORE_DB_NAME);

export const fetchTierCaps = async (): Promise<TierCap[]> => {
    const data = await getDocs(collection(db, "tiers"));
    const tierCaps = data.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as TierCap[];
    return tierCaps.sort((a, b) => a.max_cap - b.max_cap);
}

export const fetchAllPlayers = async (): Promise<DatabasePlayer[]> => {
    const querySnapshot = await getDocs(collection(db, "players"));
    const playersList = querySnapshot.docs.map(doc => ({
        // The document ID might be useful as a key later
        id: doc.id,
        // Spread the rest of the document data (player_name, cmv, etc.)
        ...doc.data()
    })) as DatabasePlayer[];
    return playersList;
};
