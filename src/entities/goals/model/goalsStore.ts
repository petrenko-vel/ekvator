import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Goal } from './types';

// Начальные цели — точно как на скриншоте
const INITIAL_GOALS: Goal[] = [
    {
        id: '1',
        emoji: '🎮',
        emojiHue: '#EDE8FF',
        name: 'PlayStation 5',
        saved: 12450,
        target: 50000,
        monthly: 5000,
        deadline: null,
        barColor: '#4CAF50',
        createdAt: Date.now() - 86400000 * 30,
    },
    {
        id: '2',
        emoji: '🏖️',
        emojiHue: '#E0F0FF',
        name: 'Отпуск в Турции',
        saved: 65000,
        target: 150000,
        monthly: 12000,
        deadline: 'до июля',
        barColor: '#3B9EE8',
        createdAt: Date.now() - 86400000 * 60,
    },
    {
        id: '3',
        emoji: '🏠',
        emojiHue: '#E0FFE8',
        name: 'Первоначальный взнос',
        saved: 120000,
        target: 150000,
        monthly: 20000,
        deadline: null,
        barColor: '#4CAF50',
        createdAt: Date.now() - 86400000 * 90,
    },
];

interface GoalsState {
    goals: Goal[];
    addGoal: (g: Omit<Goal, 'id' | 'createdAt'>) => void;
    deleteGoal: (id: string) => void;
    addFunds: (id: string, amount: number) => void;
    updateGoal: (id: string, patch: Partial<Omit<Goal, 'id' | 'createdAt'>>) => void;
}

export const useGoalsStore = create<GoalsState>()(
    persist(
        (set) => ({
            goals: INITIAL_GOALS,

            addGoal: (g) =>
                set((s) => ({
                    goals: [
                        ...s.goals,
                        { ...g, id: crypto.randomUUID(), createdAt: Date.now() },
                    ],
                })),

            deleteGoal: (id) =>
                set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

            addFunds: (id, amount) =>
                set((s) => ({
                    goals: s.goals.map((g) =>
                        g.id === id
                            ? { ...g, saved: Math.min(g.saved + amount, g.target) }
                            : g
                    ),
                })),

            updateGoal: (id, patch) =>
                set((s) => ({
                    goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
                })),
        }),
        { name: 'goals-storage' }
    )
);
