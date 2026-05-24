// ============================================================
// ONBOARDING STORE (Zustand + persist)
//
// Почему persist?
// Пользователь не должен проходить онбординг заново при
// перезагрузке страницы — это базовое ожидание от мобильного
// приложения. persist middleware сохраняет стор в localStorage
// автоматически при каждом изменении.
//
// Почему не Context API?
// Zustand не требует оборачивания дерева провайдерами,
// проще тестировать, нет лишних ре-рендеров.
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingState, OnboardingStep } from './types';

// Начальные данные вынесены отдельно — используем при reset()
const initialData: Pick<OnboardingState, 'isCompleted' | 'currentStep' | 'data'> = {
    isCompleted: false,
    currentStep: 'welcome',
    data: {},
};

export const useOnboardingStore = create<OnboardingState>()(
    // persist оборачивает весь стор и синхронизирует его с localStorage
    persist(
        (set) => ({
            ...initialData,

            // Переключение шага — используется при навигации между экранами онбординга
            setStep: (step: OnboardingStep) => set({ currentStep: step }),

            // Частичное обновление данных — каждый экран дописывает своё поле.
            // Spread предыдущего data гарантирует, что шаг 1 не сотрёт данные шага 2.
            updateData: (patch) =>
                set((state) => ({
                    data: { ...state.data, ...patch },
                })),

            // Финализация онбординга — ставим флаг isCompleted.
            // RouterProvider редиректит на /dashboard когда видит этот флаг.
            complete: () => set({ isCompleted: true }),

            // Сброс — нужен для dev-режима и кнопки "начать заново" в настройках
            reset: () => set({ ...initialData }),
        }),
        {
            name: 'onboarding-storage', // ключ в localStorage
            // partialize: сохраняем только нужные поля, actions не сериализуем
            partialize: (state) => ({
                isCompleted: state.isCompleted,
                data: state.data,
            }),
        }
    )
);