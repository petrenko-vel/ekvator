import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '@/entities/onboarding/model/onboardingStore';
import labiImg from '@/assets/labi.png';
import './OnboardingPage.scss';

const IconUser = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 11C14.4853 11 16.5 8.98528 16.5 6.5C16.5 4.01472 14.4853 2 12 2C9.51472 2 7.5 4.01472 7.5 6.5C7.5 8.98528 9.51472 11 12 11Z" fill="white" />
        <path d="M3 21C3 17.134 7.02944 14 12 14C16.9706 14 21 17.134 21 21" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
);

const IconLock = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="11" width="14" height="10" rx="2.5" fill="white" />
        <path d="M8 11V7.5C8 5.567 9.79 4 12 4C14.21 4 16 5.567 16 7.5V11" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="12" cy="15.5" r="1.5" fill="#9B7FD4" />
        <line x1="12" y1="15.5" x2="12" y2="18" stroke="#9B7FD4" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const IconEye = ({ open }: { open: boolean }) => open ? (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z" stroke="#A090C0" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" stroke="#A090C0" strokeWidth="1.8" />
    </svg>
) : (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z" stroke="#A090C0" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" stroke="#A090C0" strokeWidth="1.8" />
        <line x1="4" y1="20" x2="20" y2="4" stroke="#A090C0" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const IconGoogle = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const IconApple = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#1A1A1A">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
);

const IconFacebook = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

export const OnboardingPage = () => {
    const navigate = useNavigate();
    const { complete } = useOnboardingStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        complete();
        navigate('/dashboard', { replace: true });
    };

    return (
        <div className="login-page">
            <div className="login-page__inner">
                <h1 className="login-page__title">Добро пожаловать!</h1>
                <p className="login-page__subtitle">Войдите в систему, чтобы продолжить</p>

                <div className="login-page__mascot">
                    <img src={labiImg} alt="Labi" />
                </div>

                <form className="login-page__form" onSubmit={handleLogin}>
                    <div className="login-page__field">
                        <div className="login-page__field-icon">
                            <IconUser />
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="login-page__input"
                            autoComplete="email"
                        />
                    </div>

                    <div className="login-page__field">
                        <div className="login-page__field-icon">
                            <IconLock />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Пароль"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="login-page__input"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="login-page__eye-btn"
                            onClick={() => setShowPassword(v => !v)}
                            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                        >
                            <IconEye open={showPassword} />
                        </button>
                    </div>

                    <div className="login-page__forgot">
                        <a href="#" className="login-page__forgot-link">Забыли пароль?</a>
                    </div>

                    <button type="submit" className="login-page__btn">
                        Вход
                    </button>

                    <div className="login-page__divider">
                        <span>или продолжить с</span>
                    </div>

                    <div className="login-page__socials">
                        <button type="button" className="login-page__social-btn" aria-label="Continue with Google">
                            <IconGoogle />
                        </button>
                        <button type="button" className="login-page__social-btn" aria-label="Continue with Apple">
                            <IconApple />
                        </button>
                        <button type="button" className="login-page__social-btn" aria-label="Continue with Facebook">
                            <IconFacebook />
                        </button>
                    </div>

                    <p className="login-page__signup-text">
                        У вас еще нет аккаунта?{' '}
                        <a href="#" className="login-page__signup-link">Зарегестироваться</a>
                    </p>
                </form>
            </div>
        </div>
    );
};
