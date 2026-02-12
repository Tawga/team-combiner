import { ROSTER_SIZE } from "@/lib/constants";
import { Player, Roster } from "@/types";

// Generates all possible combinations of players
export const generateCombinations = (arr: Player[], size: number): Player[][] => {
    const result: Player[][] = [];
    const recurse = (start: number, combination: Player[]) => {
        if (combination.length === size) {
            result.push(combination);
            return;
        }

        for (let i = start; i < arr.length; i++) {
            recurse(i + 1, [...combination, arr[i]]);
        }
    };

    recurse(0, []);

    return result;
};

// Filters out rosters that don't contain locked players
export const filterLockedRosters = (
    rosters: Player[][],
    lockedPlayers: string[]
): Player[][] => {
    if (lockedPlayers.length === 0) {
        return rosters;
    }

    return rosters.filter((roster) =>
        lockedPlayers.every((playerName) =>
            roster.some((player) => player.name === playerName),
        ),
    );
};

// Filters out rosters that exceed the team cap
export const filterAllowedRosters = (
    rosters: Player[][],
    max_cap: number | undefined,
    min_cap: number | undefined
): Player[][] => {
    if (max_cap === undefined || min_cap === undefined) {
        return rosters;
    }

    return rosters.filter((roster) => {
        const totalCmv = roster.reduce((acc, player) => acc + player.cmv, 0);
        return totalCmv <= max_cap && totalCmv >= min_cap;
    });
};

// Calculates all possible rosters based on the current players and team cap
export const calculatePossibleRosters = (
    players: Player[],
    max_cap: number | undefined,
    min_cap: number | undefined,
): { rosters: Roster[]; totalChecked: number; rejectedMax: number; rejectedMin: number } => {
    const rosterSize = ROSTER_SIZE;
    if (players.length < rosterSize) {
        return { rosters: [], totalChecked: 0, rejectedMax: 0, rejectedMin: 0 };
    }

    // Generate all possible combinations of players
    const allCombinations = generateCombinations(players, rosterSize);
    const totalChecked = allCombinations.length;
    let rejectedMax = 0;
    let rejectedMin = 0;

    // Filter out rosters that exceed the team cap
    // Doing this manually instead of filterAllowedRosters to get stats
    let filteredCombinations = allCombinations.filter((roster) => {
        const totalCmv = roster.reduce((acc, player) => acc + player.cmv, 0);

        if (max_cap !== undefined && totalCmv > max_cap) {
            rejectedMax++;
            return false;
        }
        if (min_cap !== undefined && totalCmv < min_cap) {
            rejectedMin++;
            return false;
        }
        return true;
    });

    // Get a list of locked players and filter out rosters that don't contain them
    const lockedPlayers = players
        .filter((player) => player.lock === true)
        .map((player) => player.name);

    // We treat locking as a hard filter that returns "rosters", not as a "rejection" 
    // in the same sense as CAP, but functionally it reduces the set.
    // For now, let's keep the stats focused on CAP rejections as that's the transparent part.
    // Locked filtering happens on the *valid cap* rosters or all? 
    // Usually locking is a user constraint. Let's filter locked *after* cap or before?
    // Original code filtered locked LAST. Let's keep that.

    let validRosters = filterLockedRosters(filteredCombinations, lockedPlayers);

    // Calculate the total CMV for each possible roster
    const possibleRosterData = validRosters.map((combination) => ({
        players: combination,
        totalCmv: combination.reduce((acc, player) => acc + player.cmv, 0),
    }));

    // Sort the possible rosters by total CMV in descending order
    const sortedRosters = possibleRosterData.sort((a, b) => b.totalCmv - a.totalCmv);

    return {
        rosters: sortedRosters,
        totalChecked,
        rejectedMax,
        rejectedMin
    };
};
