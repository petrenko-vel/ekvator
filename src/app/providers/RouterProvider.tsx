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

// Lazy imports для остальных страниц — они ещё не созданы,
// добавим по мере разработки. Пока ставим заглушки.
// import { DashboardPage } from '@/pages/dashboard/ui/DashboardPage';

// Временная заглушка для dashboard — уберём когда сделаем Фазу 2
const DashboardStub = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
        color: 'var(--color-neutral-0)',
        fontFamily: 'var(--font-primary)',
        fontSize: 'var(--text-lg)',
        background: 'var(--color-bg-base)',
        flexDirection: 'column',
        gap: '12px',
    }}>
        <span style={{ fontSize: '3rem' }}>🎉</span>
        <span>Dashboard — следующая фаза!</span>
    </div>
);

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
                <DashboardStub />
            </ProtectedRoute>
        ),
    },
    // Все остальные пути → на главную
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);

export const RouterProvider = () => <BaseRouterProvider router={router} />;