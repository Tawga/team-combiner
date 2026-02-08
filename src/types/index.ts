export interface Player {
    name: string;
    cmv: number;
    lock: boolean;
    highlight: boolean;
    tier?: string; // Likely exists based on todo.md
    [key: string]: any; // Allow flexible properties during migration
}

export interface DatabasePlayer {
    player_name: string;
    cmv: number;
    tier?: string;
    lower_tier?: string; // Added this as it is used in Combinations.tsx filtering
    id?: string;
}

export interface Roster {
    players: Player[];
    totalCmv: number;
}

export interface TierCap {
    id: string;
    min_cap: number;
    max_cap: number;
}
