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
): Roster[] => {
    const rosterSize = ROSTER_SIZE;
    if (players.length < rosterSize) {
        return [];
    }

    // Generate all possible combinations of players
    const allCombinations = generateCombinations(players, rosterSize);

    // Filter out rosters that exceed the team cap
    let filteredRosters = filterAllowedRosters(allCombinations, max_cap, min_cap);

    // Get a list of locked players and filter out rosters that don't contain them
    const lockedPlayers = players
        .filter((player) => player.lock === true)
        .map((player) => player.name);
    filteredRosters = filterLockedRosters(filteredRosters, lockedPlayers);

    // Calculate the total CMV for each possible roster
    const possibleRosterData = filteredRosters.map((combination) => ({
        players: combination,
        totalCmv: combination.reduce((acc, player) => acc + player.cmv, 0),
    }));

    // Sort the possible rosters by total CMV in descending order
    // We can use native sort here to avoid lodash dependency if possible, or just use sort
    return possibleRosterData.sort((a, b) => b.totalCmv - a.totalCmv);
};
