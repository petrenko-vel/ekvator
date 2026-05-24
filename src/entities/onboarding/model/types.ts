// ============================================================
// ONBOARDING TYPES
// Все типы онбординга в одном месте.
// Выносим в entities/onboarding — это бизнес-сущность,
// которую будут использовать и store, и страница, и dashboard.
// ============================================================

// Шаги онбординга — строгий union, не просто number,
// чтобы добавление нового шага требовало явного обновления типов.
export type OnboardingStep = 'welcome' | 'budget';

// Финансовые цели пользователя — то, что он выбирает на первом экране.
// Используем as const + typeof для литеральных типов без enum.
export const FINANCIAL_GOALS = [
    {
        id: 'control',
        emoji: '🎯',
        title: 'Контролировать расходы',
        description: 'Понять, куда уходят деньги',
    },
    {
        id: 'save',
        emoji: '🐷',
        title: 'Копить на цель',
        description: 'Откладывать каждый месяц',
    },
    {
        id: 'habits',
        emoji: '🌱',
        title: 'Формировать привычки',
        description: 'Стать финансово осознанным',
    },
] as const;

// Тип id цели — выводится из массива, не дублируем вручную
export type FinancialGoalId = (typeof FINANCIAL_GOALS)[number]['id'];

// Данные, которые пользователь заполняет при онбординге.
// После завершения они уходят в onboardingStore и сохраняются в localStorage.
export interface OnboardingData {
    name: string;            // Имя пользователя
    goalId: FinancialGoalId; // Выбранная финансовая цель
    monthlyBudget: number;   // Месячный бюджет в рублях
}

// Состояние самого стора онбординга
export interface OnboardingState {
    isCompleted: boolean;       // Прошёл ли пользователь онбординг
    currentStep: OnboardingStep;
    data: Partial<OnboardingData>; // Partial — данные заполняются по шагам

    // Actions
    setStep: (step: OnboardingStep) => void;
    updateData: (patch: Partial<OnboardingData>) => void;
    complete: () => void;
    reset: () => void;
}