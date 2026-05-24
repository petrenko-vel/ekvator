import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import labiImg from '@/assets/labi.png';
import { useOnboardingStore } from '@/entities/onboarding/model/onboardingStore';
import './DashboardPage.scss';

// ─── Mock data ────────────────────────────────────────────────────────────────

const TRANSACTIONS = [
    { id: 1, icon: '☕', bg: '#FF8C42', name: 'Кофе в "Mama Баш"', date: 'Сегодня · 09:24', amount: -450 },
    { id: 2, icon: '🚕', bg: '#F5C842', name: 'Яндекс.Такси',      date: 'Сегодня · 08:10', amount: -350 },
    { id: 3, icon: '🛍️', bg: '#8B9EE8', name: 'AliExpress',        date: 'Вчера · 21:48',   amount: -2100 },
    { id: 4, icon: '🍜', bg: '#FF7070', name: 'Доставка еды',       date: 'Вчера · 13:02',   amount: -890 },
    { id: 5, icon: '💰', bg: '#5BAD6F', name: 'Зарплата',           date: '22 мая',           amount: 85000 },
];

const TODAY_CATS = [
    { icon: '🍔', bg: '#FF8C42', label: 'Еда',       amount: 2450 },
    { icon: '🚕', bg: '#7BB8E8', label: 'Транспорт', amount: 850  },
    { icon: '💳', bg: '#90CAF9', label: 'Прочее',    amount: 300  },
];

const fmt = (n: number) =>
    new Intl.NumberFormat('ru-RU').format(Math.abs(n));

// ─── SVG nav icons ────────────────────────────────────────────────────────────

const IcoHome = ({ active }: { active: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 10.5L12 3L21 10.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10.5Z"
            stroke={active ? '#4CAF50' : '#9E9E9E'} strokeWidth="1.8"
            fill={active ? 'rgba(76,175,80,0.15)' : 'none'} strokeLinejoin="round" />
        <path d="M9 21V12h6v9" stroke={active ? '#4CAF50' : '#9E9E9E'} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);
const IcoChart = ({ active }: { active: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="12" width="4" height="9" rx="1"
            fill={active ? '#4CAF50' : '#9E9E9E'} opacity={active ? 1 : 0.6} />
        <rect x="10" y="7" width="4" height="14" rx="1"
            fill={active ? '#4CAF50' : '#9E9E9E'} opacity={active ? 1 : 0.6} />
        <rect x="17" y="3" width="4" height="18" rx="1"
            fill={active ? '#4CAF50' : '#9E9E9E'} opacity={active ? 1 : 0.6} />
    </svg>
);
const IcoTarget = ({ active }: { active: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={active ? '#4CAF50' : '#9E9E9E'} strokeWidth="1.8" />
        <circle cx="12" cy="12" r="5" stroke={active ? '#4CAF50' : '#9E9E9E'} strokeWidth="1.8" />
        <circle cx="12" cy="12" r="1.5" fill={active ? '#4CAF50' : '#9E9E9E'} />
    </svg>
);
const IcoUser = ({ active }: { active: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={active ? '#4CAF50' : '#9E9E9E'} strokeWidth="1.8" />
        <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
            stroke={active ? '#4CAF50' : '#9E9E9E'} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const DashboardPage = () => {
    const navigate = useNavigate();
    const userName = useOnboardingStore(s => s.data.name) ?? 'Пользователь';
    const [activeNav, setActiveNav] = useState<'home' | 'analytics' | 'goals' | 'profile'>('home');
    const [showInsight, setShowInsight] = useState(true);

    return (
        <div className="dash">
            {/* ────── Scrollable content ────── */}
            <div className="dash__body">

                {/* Header */}
                <div className="dash__header">
                    <div>
                        <p className="dash__date">24 мая · суббота</p>
                        <h1 className="dash__title">Привет, {userName} 👋</h1>
                    </div>
                    <button className="dash__bell" aria-label="Уведомления">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2Z" fill="#757575" />
                            <path d="M18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2Z"
                                fill="#757575" />
                        </svg>
                        <span className="dash__bell-dot" />
                    </button>
                </div>

                {/* ── Hero card ──────────────────────────────────────────── */}
                <div className="dash__hero">
                    <p className="dash__hero-label">ОСТАЛОСЬ ДО КОНЦА МЕСЯЦА</p>
                    <p className="dash__hero-amount">
                        35 450 <span className="dash__hero-currency">р</span>
                    </p>
                    <div className="dash__hero-bar">
                        <div className="dash__hero-fill" style={{ width: '64.55%' }} />
                    </div>
                    <div className="dash__hero-footer">
                        <span className="dash__hero-spent">Потрачено 64 550 Р / 100 000 Р</span>
                        <span className="dash__hero-days">5 дней</span>
                    </div>
                </div>

                {/* ── Labi status card ───────────────────────────────────── */}
                <div className="dash__labi">
                    <img src={labiImg} alt="Labi" className="dash__labi-img" />
                    <div className="dash__labi-body">
                        <span className="dash__labi-label">LABI ДОВОЛЕН</span>
                        <p className="dash__labi-text">78% — ты держишься бюджета 🌱</p>
                        <div className="dash__labi-bar">
                            <div className="dash__labi-fill" style={{ width: '78%' }} />
                        </div>
                    </div>
                </div>

                {/* ── Insight card ───────────────────────────────────────── */}
                {showInsight && (
                    <div className="dash__insight">
                        <div className="dash__insight-row">
                            <span className="dash__insight-ico">💡</span>
                            <span className="dash__insight-tag">ИНСАЙТ ДНЯ</span>
                            <button
                                className="dash__insight-close"
                                onClick={() => setShowInsight(false)}
                                aria-label="Закрыть"
                            >×</button>
                        </div>
                        <p className="dash__insight-title">Расходы на еду выросли на 40%</p>
                        <p className="dash__insight-desc">
                            Готовь дома 2 раза в неделю — сэкономишь ~3 000 Р
                        </p>
                    </div>
                )}

                {/* ── Today ──────────────────────────────────────────────── */}
                <div className="dash__today">
                    <div className="dash__row-head">
                        <h2 className="dash__section-title">Сегодня</h2>
                        <span className="dash__section-meta">3 600 Р · 3 траты</span>
                    </div>
                    <div className="dash__today-grid">
                        {TODAY_CATS.map(c => (
                            <div key={c.label} className="dash__cat-card">
                                <div className="dash__cat-ico" style={{ background: c.bg }}>
                                    {c.icon}
                                </div>
                                <span className="dash__cat-label">{c.label}</span>
                                <span className="dash__cat-amount">{fmt(c.amount)} Р</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Recent transactions ────────────────────────────────── */}
                <div className="dash__txs">
                    <div className="dash__row-head">
                        <h2 className="dash__section-title">Последние операции</h2>
                        <button className="dash__all-link">Все →</button>
                    </div>
                    <div className="dash__tx-list">
                        {TRANSACTIONS.map((tx, i) => (
                            <div
                                key={tx.id}
                                className={`dash__tx${i < TRANSACTIONS.length - 1 ? ' dash__tx--divider' : ''}`}
                            >
                                <div className="dash__tx-ico" style={{ background: tx.bg }}>
                                    {tx.icon}
                                </div>
                                <div className="dash__tx-info">
                                    <span className="dash__tx-name">{tx.name}</span>
                                    <span className="dash__tx-date">{tx.date}</span>
                                </div>
                                <span className={`dash__tx-amt${tx.amount > 0 ? ' dash__tx-amt--plus' : ''}`}>
                                    {tx.amount > 0 ? '+' : '−'}{fmt(tx.amount)} Р
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nav spacer */}
                <div style={{ height: 96 }} />
            </div>

            {/* ────── Bottom navigation ────── */}
            <nav className="dash__nav">
                <button
                    className={`dash__nav-btn${activeNav === 'home' ? ' dash__nav-btn--active' : ''}`}
                    onClick={() => setActiveNav('home')}
                >
                    <IcoHome active={activeNav === 'home'} />
                    <span>Главная</span>
                </button>
                <button
                    className={`dash__nav-btn${activeNav === 'analytics' ? ' dash__nav-btn--active' : ''}`}
                    onClick={() => setActiveNav('analytics')}
                >
                    <IcoChart active={activeNav === 'analytics'} />
                    <span>Аналитика</span>
                </button>

                {/* FAB */}
                <button className="dash__fab" aria-label="Добавить">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </button>

                <button
                    className={`dash__nav-btn${activeNav === 'goals' ? ' dash__nav-btn--active' : ''}`}
                    onClick={() => navigate('/goals')}
                >
                    <IcoTarget active={activeNav === 'goals'} />
                    <span>Цели</span>
                </button>
                <button
                    className={`dash__nav-btn${activeNav === 'profile' ? ' dash__nav-btn--active' : ''}`}
                    onClick={() => setActiveNav('profile')}
                >
                    <IcoUser active={activeNav === 'profile'} />
                    <span>Профиль</span>
                </button>
            </nav>
        </div>
    );
};
