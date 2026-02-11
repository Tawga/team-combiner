import { ScrimPlayer, MatchLineup, RosterConfig, RollingState } from "../types/rolling";

// 2.1 The "Weighted Urgency" Scoring
// Score = (GamesPlayed * 10) - (BenchStreak * 50)
// Lower score = Higher priority to play
export const calculateUrgencyScore = (player: ScrimPlayer): number => {
    // If locked, return effectively -Infinity to force pick (handled in generation logic, but good as fallback)
    if (player.isLocked) return -100000;

    // Base score
    let score = (player.gamesPlayed * 10) - (player.benchStreak * 50);

    // Tie-breaker: Higher CMV plays first if scores are equal? 
    // "Quality Factor: Sort players by cmv initially so that the best players are fielded first."
    // If we want high CMV to have lower score (higher priority), subtract a fraction of CMV
    // e.g. - (player.cmv * 0.01)
    score -= (player.cmv * 0.001);

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

// Helper: Generate structured lineup from specialized player pool
// This function purely calculates the BEST mathematical lineup from the provided pool state
export const generateNextLineup = (
    pool: ScrimPlayer[],
    config: RosterConfig
): MatchLineup => {
    // 1. Separation: Locked vs Unlocked
    const lockedPlayers = pool.filter(p => p.isLocked);
    const availablePlayers = pool.filter(p => !p.isLocked);

    // If locked >= size, just use them (or first size)
    let active: ScrimPlayer[] = [];
    const size = config.lineupSize;

    if (lockedPlayers.length >= size) {
        active = lockedPlayers.slice(0, size);
    } else {
        active = [...lockedPlayers];

        // 2. Sort available by Urgency Score
        // Lower score = better
        const sortedAvailable = [...availablePlayers].sort((a, b) => {
            return calculateUrgencyScore(a) - calculateUrgencyScore(b);
        });

        // 3. Pick top 'needed'
        // Simple Greedy approach first:
        for (const candidate of sortedAvailable) {
            if (active.length < size) {
                active.push(candidate);
            }
        }
    }

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
    return pool.map(p => {
        const isActive = lineup.active.find(a => a.id === p.id);
        const newP = { ...p };

        if (isActive) {
            newP.gamesPlayed += 1;
            newP.benchStreak = 0;
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
