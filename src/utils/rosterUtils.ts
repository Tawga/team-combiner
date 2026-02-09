import { Player } from "../types";

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
    cap: number | undefined
): Player[][] => {
    if (cap === undefined) {
        return rosters;
    }

    return rosters.filter((roster) => {
        const totalCmv = roster.reduce((acc, player) => acc + player.cmv, 0);
        return totalCmv <= cap;
    });
};
