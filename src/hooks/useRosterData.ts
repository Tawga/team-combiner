import { useState, useEffect } from "react";
import { fetchAllPlayers, fetchTierCaps } from "../services/FirebaseService";
import { DatabasePlayer, TierCap } from "../types";
import { CACHE_DURATION } from "@/lib/constants";

interface UseRosterDataResult {
    allPlayers: DatabasePlayer[];
    tierCaps: TierCap[];
    loading: boolean;
    error: unknown;
    setAllPlayers: React.Dispatch<React.SetStateAction<DatabasePlayer[]>>;
    setTierCaps: React.Dispatch<React.SetStateAction<TierCap[]>>;
}

export const useRosterData = (): UseRosterDataResult => {
    const [allPlayers, setAllPlayers] = useState<DatabasePlayer[]>([]);
    const [tierCaps, setTierCaps] = useState<TierCap[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Check if the page was reloaded (hard refresh)
                const navigationEntries = window.performance.getEntriesByType("navigation");
                const isReload =
                    navigationEntries.length > 0 &&
                    (navigationEntries[0] as PerformanceNavigationTiming).type === "reload";

                // --- Fetch Players ---
                const cachedPlayersJSON = localStorage.getItem("allPlayers");
                let validPlayersCache = false;
                let fetchedPlayers: DatabasePlayer[] = [];

                if (cachedPlayersJSON && !isReload) {
                    const cachedPlayers = JSON.parse(cachedPlayersJSON);
                    if (new Date().getTime() < cachedPlayers.expiry) {
                        fetchedPlayers = cachedPlayers.data;
                        console.log("Using cached players data");
                        validPlayersCache = true;
                    } else {
                        console.log("Cached players data expired");
                    }
                }

                if (!validPlayersCache) {
                    console.log("Fetching players from database");
                    fetchedPlayers = await fetchAllPlayers();
                    // Cache for 1 week (7 days)
                    const expirationTime = new Date().getTime() + CACHE_DURATION;
                    const itemToCache = {
                        data: fetchedPlayers,
                        expiry: expirationTime,
                    };
                    console.log("Caching players data");
                    localStorage.setItem("allPlayers", JSON.stringify(itemToCache));
                }
                setAllPlayers(fetchedPlayers);

                // --- Fetch Tier Caps ---
                const cachedTierCapsJSON = localStorage.getItem("tierCaps");
                let validTierCapsCache = false;
                let fetchedTierCaps: TierCap[] = [];

                if (cachedTierCapsJSON && !isReload) {
                    const cachedTierCaps = JSON.parse(cachedTierCapsJSON);
                    if (new Date().getTime() < cachedTierCaps.expiry) {
                        fetchedTierCaps = cachedTierCaps.data;
                        console.log("Using cached tier caps data");
                        validTierCapsCache = true;
                    } else {
                        console.log("Cached tier caps data expired");
                    }
                }

                if (!validTierCapsCache) {
                    console.log("Fetching tier caps from database");
                    fetchedTierCaps = await fetchTierCaps();
                    // Cache for 1 week (7 days)
                    const expirationTime = new Date().getTime() + CACHE_DURATION;
                    const itemToCache = {
                        data: fetchedTierCaps,
                        expiry: expirationTime,
                    };
                    localStorage.setItem("tierCaps", JSON.stringify(itemToCache));
                    console.log("Caching tier caps data");
                }
                setTierCaps(fetchedTierCaps);

            } catch (err) {
                console.error("Error loading roster data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { allPlayers, tierCaps, loading, error, setAllPlayers, setTierCaps };
};
