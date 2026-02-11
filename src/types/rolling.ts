import { Player, TierCap } from "./index";

export interface ScrimPlayer extends Player {
    id: string; // Unique ID for tracking (could be name if unique, but ID is safer)
    gamesPlayed: number;
    benchStreak: number;
    isLocked: boolean; // User override
}

export interface MatchLineup {
    active: ScrimPlayer[];
    bench: ScrimPlayer[]; // Those not playing in this specific game
    ghostPlayer?: ScrimPlayer; // The theoretical 4th player for validation
    isValid: boolean; // Cap check passed?
    validationError?: string;
}

export interface RollingState {
    queue: MatchLineup[]; // [0]=Next, [1]=Future, [2]=Future2 (Lookahead)
    history: MatchLineup[];
    pool: ScrimPlayer[]; // The entire roster with current stats
    config: RosterConfig;
}

export interface RosterConfig {
    tier: TierCap;
    enforceCap: boolean; // "Strict Mode"
    lineupSize: number; // 2 or 3
    qualityWeight: number; // For future tuning potentially
    fairnessWeight: number;
}
