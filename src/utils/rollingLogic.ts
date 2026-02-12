import { ScrimPlayer, MatchLineup, RosterConfig } from "../types/rolling";
import { SCORING } from "./constants";

// 2.1 The "Weighted Urgency" Scoring
// Score = (GamesPlayed * 10) - (BenchStreak * 50)
// Lower score = Higher priority to play
export const calculateUrgencyScore = (player: ScrimPlayer): number => {
    // If locked, return effectively -Infinity to force pick (handled in generation logic, but good as fallback)
    if (player.isLocked) return -100000;

    // Base score
    let score = (player.gamesPlayed * SCORING.GAMES_PLAYED_WEIGHT) - (player.benchStreak * SCORING.BENCH_STREAK_WEIGHT);

    // Tie-breaker: Higher CMV plays first if scores are equal? 
    // "Quality Factor: Sort players by cmv initially so that the best players are fielded first."
    // If we want high CMV to have lower score (higher priority), subtract a fraction of CMV
    score -= (player.cmv * SCORING.CMV_PENALTY_FACTOR);

    return score;
};

// 2.2 The "Ghost 4th" Validation
export const validateLineup = (
    active: ScrimPlayer[],
    bench: ScrimPlayer[],
    maxCap: number,
    enforceCap: boolean,
    lineupSize: number
): { isValid: boolean; ghost?: ScrimPlayer; error?: string } => {
    if (!enforceCap) return { isValid: true };

    if (active.length !== lineupSize) {
        return { isValid: false, error: `Lineup must have exactly ${lineupSize} players.` };
    }

    // "Min(Remaining Bench CMV)"
    // Find the cheapest player on the bench
    // If bench is empty (roster of 3?), ghost cost is 0? Or impossible?
    // Requirement says "A trio of 3 active players is only valid if they can theoretically form a legal 4-man roster with at least one player remaining on the bench."
    // This implies roster size >= 4.
    if (bench.length === 0) {
        // If we only have 3 players total, they just play? 
        // Or is it invalid because we can't form a 4-man roster?
        // Assuming valid for now if total <= cap, ghost is null.
        const totalActive = active.reduce((sum, p) => sum + p.cmv, 0);
        return {
            isValid: totalActive <= maxCap,
            error: totalActive > maxCap ? "Salary Cap Exceeded" : undefined
        };
    }

    const sortedBench = [...bench].sort((a, b) => a.cmv - b.cmv);
    const cheapestBench = sortedBench[0];

    const activeSum = active.reduce((sum, p) => sum + p.cmv, 0);
    const totalCost = activeSum + cheapestBench.cmv;

    if (totalCost > maxCap) {
        return {
            isValid: false,
            ghost: cheapestBench,
            error: `Cap Exceeded: Active(${activeSum}) + Ghost(${cheapestBench.cmv}) = ${totalCost} > ${maxCap}`
        };
    }

    return { isValid: true, ghost: cheapestBench };
};

// Helper to generate combinations
function getCombinations<T>(arr: T[], size: number): T[][] {
    if (size === 0) return [[]];
    if (arr.length === 0) return [];

    const [first, ...rest] = arr;

    const withFirst = getCombinations(rest, size - 1).map(combo => [first, ...combo]);
    const withoutFirst = getCombinations(rest, size);

    return [...withFirst, ...withoutFirst];
}

// Calculate pairwise fatigue score for a potential lineup
const calculateVarietyPenalty = (lineup: ScrimPlayer[], varietyWeight: number): number => {
    let pairScore = 0;
    for (let i = 0; i < lineup.length; i++) {
        for (let j = i + 1; j < lineup.length; j++) {
            const p1 = lineup[i];
            const p2 = lineup[j];
            // Check both directions just in case, though they should be synced
            const count = (p1.pairCounts?.[p2.id] || 0);
            pairScore += count;
        }
    }
    return pairScore * varietyWeight;
};

// Helper: Generate structured lineup from specialized player pool
// This function purely calculates the BEST mathematical lineup from the provided pool state
export const generateNextLineup = (
    pool: ScrimPlayer[],
    config: RosterConfig
): MatchLineup => {
    // 1. Separation: Locked vs Unlocked
    const lockedPlayers = pool.filter(p => p.isLocked);
    const availablePlayers = pool.filter(p => !p.isLocked);
    const size = config.lineupSize;

    // If locked >= size, just use them (or first size)
    if (lockedPlayers.length >= size) {
        const active = lockedPlayers.slice(0, size);
        const bench = pool.filter(p => !active.find(a => a.id === p.id));
        const validation = validateLineup(active, bench, config.tier.max_cap, config.enforceCap, config.lineupSize);
        return {
            active,
            bench,
            isValid: validation.isValid,
            ghostPlayer: validation.ghost,
            validationError: validation.error
        };
    }

    // We need to pick (size - locked.length) players from availablePlayers
    const needed = size - lockedPlayers.length;

    // Generate all combinations of available players
    const combinations = getCombinations(availablePlayers, needed);

    // If no combinations (e.g. not enough players), just take what we have
    if (combinations.length === 0 && needed > 0) {
        // Fallback: take all available
        const active = [...lockedPlayers, ...availablePlayers];
        const bench: ScrimPlayer[] = [];
        const validation = validateLineup(active, bench, config.tier.max_cap, config.enforceCap, config.lineupSize);
        return {
            active,
            bench: [],
            isValid: validation.isValid,
            ghostPlayer: validation.ghost,
            validationError: validation.error
        };
    }

    // Score each combination
    let bestCombo: ScrimPlayer[] = combinations[0];
    let bestScore = Infinity;

    // Separate tracking for valid vs invalid lineups when cap is enforced
    let bestValidCombo: ScrimPlayer[] | null = null;
    let bestValidScore = Infinity;

    for (const combo of combinations) {
        const potentialLineup = [...lockedPlayers, ...combo];
        const potentialBench = pool.filter(p => !potentialLineup.find(a => a.id === p.id));

        // 1. Urgency Score
        const urgencySum = potentialLineup.reduce((sum, p) => sum + calculateUrgencyScore(p), 0);

        // 2. Variety Penalty
        const varietyPenalty = calculateVarietyPenalty(potentialLineup, config.varietyWeight);

        const totalScore = urgencySum + varietyPenalty;

        // Check Validity
        const validation = validateLineup(potentialLineup, potentialBench, config.tier.max_cap, config.enforceCap, config.lineupSize);

        if (config.enforceCap && validation.isValid) {
            if (totalScore < bestValidScore) {
                bestValidScore = totalScore;
                bestValidCombo = combo;
            }
        }

        if (totalScore < bestScore) {
            bestScore = totalScore;
            bestCombo = combo;
        }
    }

    // Decision Logic:
    // If enforceCap is ON and we found ANY valid lineup, use the best VALID one.
    // Otherwise fallback to the best overall (which might be invalid, or valid if cap is off).
    if (config.enforceCap && bestValidCombo) {
        bestCombo = bestValidCombo;
    }

    const active = [...lockedPlayers, ...bestCombo];
    const bench = pool.filter(p => !active.find(a => a.id === p.id));

    // Validate
    const validation = validateLineup(active, bench, config.tier.max_cap, config.enforceCap, config.lineupSize);

    return {
        active,
        bench,
        isValid: validation.isValid,
        ghostPlayer: validation.ghost,
        validationError: validation.error
    };
};

/**
 * Simulates a game played by 'lineup', updating stats for the NEXT generation step.
 * Returns a NEW array of players with updated stats.
 */
export const simulateGameStats = (pool: ScrimPlayer[], lineup: MatchLineup): ScrimPlayer[] => {
    const activeIds = new Set(lineup.active.map(p => p.id));

    // Update Pairwise Counts for active players
    // We need a map of ID -> new pair counts to avoid mutating input directly effectively
    // But since we map the pool, we can just handle it inside

    // First, let's calculate the new pairs to add
    // We can't easily mutate inside map, so let's pre-calculate updates
    const pairUpdates: Record<string, string[]> = {}; // PlayerID -> List of TeammateIDs to increment

    for (const p of lineup.active) {
        pairUpdates[p.id] = [];
        for (const teammate of lineup.active) {
            if (p.id !== teammate.id) {
                pairUpdates[p.id].push(teammate.id);
            }
        }
    }

    return pool.map(p => {
        const isActive = activeIds.has(p.id);
        const newP = { ...p, pairCounts: { ...(p.pairCounts || {}) } }; // Shallow copy pairCounts

        if (isActive) {
            newP.gamesPlayed += 1;
            newP.benchStreak = 0;

            // Update pair counts
            const teammates = pairUpdates[p.id] || [];
            for (const tId of teammates) {
                newP.pairCounts[tId] = (newP.pairCounts[tId] || 0) + 1;
            }

        } else {
            newP.benchStreak += 1;
        }
        return newP;
    });
};

/**
 * Recalculates the entire queue (Game 0, +1, +2) based on current state.
 * If 'lockedGameZero' is provided, it forces that lineup for Game 0 (e.g. user drag/drop).
 * Otherwise generates Game 0 from stats.
 */
export const recalculateQueue = (
    currentPool: ScrimPlayer[],
    config: RosterConfig,
    userOverrideGameZero?: MatchLineup
): MatchLineup[] => {
    const queue: MatchLineup[] = [];

    // Game 0
    let game0: MatchLineup;
    if (userOverrideGameZero) {
        // Validation might need re-running if not already done
        const v = validateLineup(
            userOverrideGameZero.active,
            userOverrideGameZero.bench,
            config.tier.max_cap,
            config.enforceCap,
            config.lineupSize
        );
        game0 = { ...userOverrideGameZero, isValid: v.isValid, ghostPlayer: v.ghost, validationError: v.error };
    } else {
        game0 = generateNextLineup(currentPool, config);
    }
    queue.push(game0);

    // Simulate stats after Game 0 to generate Game 1
    const poolAfterGame0 = simulateGameStats(currentPool, game0);
    const game1 = generateNextLineup(poolAfterGame0, config);
    queue.push(game1);

    // Simulate stats after Game 1 to generate Game 2
    const poolAfterGame1 = simulateGameStats(poolAfterGame0, game1);
    const game2 = generateNextLineup(poolAfterGame1, config);
    queue.push(game2);

    return queue;
};
