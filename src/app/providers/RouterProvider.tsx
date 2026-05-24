// ============================================================
// ROUTER PROVIDER
//
// Здесь живёт вся навигация приложения.
// Ключевая логика: если онбординг не пройден → редирект на /onboarding.
// Это "гард" — защита роутов от преждевременного доступа.
//
// Используем React Router v6 с data-router (createBrowserRouter)
// вместо компонентного <BrowserRouter> — это современный подход,
// он лучше работает с Suspense и будущими серверными фичами.
// ============================================================

import { createBrowserRouter, RouterProvider as BaseRouterProvider, Navigate } from 'react-router-dom';
import { useOnboardingStore } from '@/entities/onboarding/model/onboardingStore';
import { OnboardingPage } from '@/pages/onboarding';
import { DashboardPage } from '@/pages/dashboard';
import { GoalsPage } from '@/pages/goals';

// ProtectedRoute — компонент-гард.
// Оборачивает любой роут, который требует завершённого онбординга.
// Если онбординг не пройден → Navigate на /onboarding (replace убирает
// этот редирект из истории браузера, чтобы кнопка "назад" работала правильно).
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isCompleted = useOnboardingStore((state) => state.isCompleted);
    return isCompleted ? <>{children}</> : <Navigate to="/onboarding" replace />;
};

// OnboardingGuard — обратный гард.
// Если онбординг уже пройден и пользователь заходит на /onboarding →
// редиректим сразу на dashboard. Нет смысла показывать онбординг дважды.
const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
    const isCompleted = useOnboardingStore((state) => state.isCompleted);
    return isCompleted ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const router = createBrowserRouter([
    {
        path: '/',
        // Корень: если онбординг пройден → dashboard, иначе → onboarding
        element: <Navigate to="/onboarding" replace />,
    },
    {
        path: '/onboarding',
        element: (
            <OnboardingGuard>
                <OnboardingPage />
            </OnboardingGuard>
        ),
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/goals',
        element: (
            <ProtectedRoute>
                <GoalsPage />
            </ProtectedRoute>
        ),
    },
    // Все остальные пути → на главную
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
], { basename: '/ekvator' });

export const RouterProvider = () => <BaseRouterProvider router={router} />;