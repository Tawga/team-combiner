import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
} from "react";
import { useRosterSelection } from "./RosterSelectionContext";
import {
	ScrimPlayer,
	MatchLineup,
	RosterConfig,
	RollingState,
} from "../types/rolling";
import { recalculateQueue, simulateGameStats } from "../utils/rollingLogic";

interface RollingRosterContextType {
	state: RollingState;
	setConfig: (config: RosterConfig) => void;
	movePlayerToActive: (playerId: string) => void;
	movePlayerToBench: (playerId: string) => void;
	swapPlayers: (activeId: string, benchId: string) => void;
	toggleLock: (playerId: string) => void;
	playGame: () => void;
	resetPool: () => void;
}

const RollingRosterContext = createContext<
	RollingRosterContextType | undefined
>(undefined);

export const useRollingRoster = () => {
	const context = useContext(RollingRosterContext);
	if (!context) {
		throw new Error(
			"useRollingRoster must be used within a RollingRosterProvider",
		);
	}
	return context;
};

interface RollingRosterProviderProps {
	children: ReactNode;
}

export const RollingRosterProvider: React.FC<RollingRosterProviderProps> = ({
	children,
}) => {
	const { players: selectionPlayers, selectedTier } = useRosterSelection();

	const [state, setState] = useState<RollingState>({
		queue: [],
		history: [],
		pool: [],
		config: {
			tier: selectedTier || { id: "Unknown", min_cap: 0, max_cap: 10000 },
			enforceCap: true,
			lineupSize: 3,
			qualityWeight: 1,
			fairnessWeight: 1,
		},
	});

	// Initialize pool when selection changes or on mount
	useEffect(() => {
		if (selectionPlayers.length > 0 && selectedTier) {
			// Transform Player[] -> ScrimPlayer[]
			// We only reset if pool is empty or if the player set drastically changes (TODO: improved sync)
			// For now, simple reset on roster selection change
			const initialPool: ScrimPlayer[] = selectionPlayers.map((p) => ({
				...p,
				id: p.name, // Assuming name is unique
				gamesPlayed: 0,
				benchStreak: 0,
				isLocked: false,
			}));

			const config: RosterConfig = {
				...state.config,
				tier: selectedTier,
			};

			const queue = recalculateQueue(initialPool, config);

			setState((prev) => ({
				...prev,
				pool: initialPool,
				config,
				queue,
				history: [], // Reset history on new roster? Probably yes.
			}));
		}
	}, [selectionPlayers, selectedTier]);

	const movePlayerToActive = useCallback((playerId: string) => {
		setState((prev) => {
			const currentGame = prev.queue[0];
			if (!currentGame) return prev;

			// Find player in bench
			const player = currentGame.bench.find((p) => p.id === playerId);
			if (!player) return prev; // Already active or not found

			// Let's assume this is "Force Add", popping the last one if full.
			let newActive = [...currentGame.active];
			if (newActive.length >= prev.config.lineupSize) {
				newActive.pop(); // Remove last
			}
			newActive.push(player);

			const newBench = prev.pool.filter(
				(p) => !newActive.find((a) => a.id === p.id),
			);

			const newGameZero: MatchLineup = {
				active: newActive,
				bench: newBench,
				isValid: true, // Re-validated inside recalculateQueue
			};

			const newQueue = recalculateQueue(prev.pool, prev.config, newGameZero);

			return {
				...prev,
				queue: newQueue,
			};
		});
	}, []);

	const movePlayerToBench = useCallback((playerId: string) => {
		setState((prev) => {
			const currentGame = prev.queue[0];
			if (!currentGame) return prev;

			const player = currentGame.active.find((p) => p.id === playerId);
			if (!player) return prev;

			const newActive = currentGame.active.filter((p) => p.id !== playerId);
			// Bench is automatic based on pool minus active, effectively
			const newBench = prev.pool.filter(
				(p) => !newActive.find((a) => a.id === p.id),
			);

			const newGameZero: MatchLineup = {
				active: newActive,
				bench: newBench,
				isValid: true, // Will likely be invalid due to count < 3
			};

			const newQueue = recalculateQueue(prev.pool, prev.config, newGameZero);

			return {
				...prev,
				queue: newQueue,
			};
		});
	}, []);

	const swapPlayers = useCallback((activeId: string, benchId: string) => {
		setState((prev) => {
			const currentGame = prev.queue[0];
			const activeP = currentGame.active.find((p) => p.id === activeId);
			const benchP = currentGame.bench.find((p) => p.id === benchId);

			if (!activeP || !benchP) return prev;

			const newActive = currentGame.active.map((p) =>
				p.id === activeId ? benchP : p,
			);
			const newBench = prev.pool.filter(
				(p) => !newActive.find((a) => a.id === p.id),
			); // Rebuild bench from pool minus active

			const newGameZero: MatchLineup = {
				active: newActive,
				bench: newBench,
				isValid: true,
			};

			const newQueue = recalculateQueue(prev.pool, prev.config, newGameZero);

			return {
				...prev,
				queue: newQueue,
			};
		});
	}, []);

	const toggleLock = useCallback((playerId: string) => {
		setState((prev) => {
			const newPool = prev.pool.map((p) =>
				p.id === playerId ? { ...p, isLocked: !p.isLocked } : p,
			);

			// Re-calc everything based on new locks
			const newQueue = recalculateQueue(newPool, prev.config);

			return {
				...prev,
				pool: newPool,
				queue: newQueue,
			};
		});
	}, []);

	const playGame = useCallback(() => {
		setState((prev) => {
			const game0 = prev.queue[0];
			if (!game0) return prev;
			if (!game0.isValid && prev.config.enforceCap) {
				// Prevent playing if invalid and strict mode is on?
				// Or allow with warning? Logic says "Lineup is invalid and cannot be played" if enabled.
				console.warn("Cannot play invalid lineup in strict mode");
				return prev;
			}

			// 1. Update stats
			const newPool = simulateGameStats(prev.pool, game0);

			// 2. Archive Game 0
			const newHistory = [game0, ...prev.history];

			// 3. Generate new Queue
			const newQueue = recalculateQueue(newPool, prev.config);

			return {
				...prev,
				pool: newPool,
				history: newHistory,
				queue: newQueue,
			};
		});
	}, []);

	const resetPool = useCallback(() => {
		setState((prev) => {
			const initialPool: ScrimPlayer[] = prev.pool.map((p) => ({
				...p,
				gamesPlayed: 0,
				benchStreak: 0,
				isLocked: false,
			}));
			const queue = recalculateQueue(initialPool, prev.config);
			return {
				...prev,
				pool: initialPool,
				queue,
				history: [],
			};
		});
	}, []);

	const setConfig = useCallback((newConfig: RosterConfig) => {
		setState((prev) => {
			return {
				...prev,
				config: newConfig,
				queue: recalculateQueue(prev.pool, newConfig), // Regen
			};
		});
	}, []);

	return (
		<RollingRosterContext.Provider
			value={{
				state,
				setConfig,
				movePlayerToActive,
				movePlayerToBench,
				swapPlayers,
				toggleLock,
				playGame,
				resetPool,
			}}
		>
			{children}
		</RollingRosterContext.Provider>
	);
};
