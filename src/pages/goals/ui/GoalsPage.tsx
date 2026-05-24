import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import labiImg from '@/assets/labi.png';
import { useGoalsStore } from '@/entities/goals/model/goalsStore';
import type { Goal } from '@/entities/goals/model/types';
import './GoalsPage.scss';

// ─── Утилиты ─────────────────────────────────────────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(n);
const pct = (saved: number, target: number) =>
    Math.min(100, Math.round((saved / target) * 100));

const monthsLeft = (g: Goal) => {
    if (g.deadline) return g.deadline;
    const rem = g.target - g.saved;
    if (rem <= 0) return 'Цель достигнута!';
    const m = Math.ceil(rem / g.monthly);
    return `≈ ${m} ${m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев'}`;
};

// ─── Доступные иконки ─────────────────────────────────────────────────────────

const ICONS = [
    { emoji: '🎮', bg: '#EDE8FF' }, { emoji: '🏖️', bg: '#E0F0FF' },
    { emoji: '🏠', bg: '#E0FFE8' }, { emoji: '🚗', bg: '#FFF0E0' },
    { emoji: '💻', bg: '#E8E8FF' }, { emoji: '✈️', bg: '#E0F8FF' },
    { emoji: '📱', bg: '#FFE8F0' }, { emoji: '🎓', bg: '#F0FFE0' },
    { emoji: '💍', bg: '#FFE8FF' }, { emoji: '🐶', bg: '#FFF8E0' },
    { emoji: '🏋️', bg: '#FFE8E8' }, { emoji: '🎵', bg: '#F0E8FF' },
];

const BAR_COLORS = [
    { label: 'Зелёный',   value: '#4CAF50' },
    { label: 'Синий',     value: '#3B9EE8' },
    { label: 'Оранжевый', value: '#FF9800' },
    { label: 'Фиолет.',   value: '#9C27B0' },
    { label: 'Бирюза',    value: '#00BCD4' },
];

// ─── Круговой прогресс ────────────────────────────────────────────────────────

const CircleProgress = ({ pct: p }: { pct: number }) => {
    const r = 30;
    const circ = 2 * Math.PI * r;
    const dash = (Math.min(p, 100) / 100) * circ;
    return (
        <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(76,175,80,0.2)" strokeWidth="7" />
            <circle
                cx="40" cy="40" r={r}
                fill="none"
                stroke="#4CAF50"
                strokeWidth="7"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
            />
            <text x="40" y="45" textAnchor="middle" fill="#1A2E1A"
                fontSize="14" fontWeight="900" fontFamily="Nunito, sans-serif">
                {p}%
            </text>
        </svg>
    );
};

// ─── SVG иконки навигации ────────────────────────────────────────────────────

const IcoHome = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 10.5L12 3L21 10.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10.5Z"
            stroke="#9E9E9E" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 21V12h6v9" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);
const IcoChart = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="12" width="4" height="9" rx="1" fill="#9E9E9E" opacity="0.6" />
        <rect x="10" y="7" width="4" height="14" rx="1" fill="#9E9E9E" opacity="0.6" />
        <rect x="17" y="3" width="4" height="18" rx="1" fill="#9E9E9E" opacity="0.6" />
    </svg>
);
const IcoTarget = ({ active }: { active?: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={active ? '#4CAF50' : '#9E9E9E'} strokeWidth="1.8" />
        <circle cx="12" cy="12" r="5" stroke={active ? '#4CAF50' : '#9E9E9E'} strokeWidth="1.8" />
        <circle cx="12" cy="12" r="1.5" fill={active ? '#4CAF50' : '#9E9E9E'} />
    </svg>
);
const IcoUser = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="#9E9E9E" strokeWidth="1.8" />
        <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

// ─── Модалка: Пополнить ───────────────────────────────────────────────────────

const AddFundsModal = ({
    goal,
    onClose,
}: {
    goal: Goal;
    onClose: () => void;
}) => {
    const addFunds = useGoalsStore(s => s.addFunds);
    const [raw, setRaw] = useState('');

    const amount = parseInt(raw.replace(/\D/g, ''), 10) || 0;

    const handleConfirm = () => {
        if (amount <= 0) return;
        addFunds(goal.id, amount);
        onClose();
    };

    return (
        <div className="gmodal" onClick={onClose}>
            <div className="gmodal__sheet" onClick={e => e.stopPropagation()}>
                <div className="gmodal__handle" />
                <h3 className="gmodal__title">Пополнить</h3>
                <p className="gmodal__subtitle">{goal.emoji} {goal.name}</p>

                <div className="gmodal__progress-row">
                    <span className="gmodal__prog-val">{fmt(goal.saved)} Р</span>
                    <span className="gmodal__prog-sep">из</span>
                    <span className="gmodal__prog-target">{fmt(goal.target)} Р</span>
                </div>

                <input
                    className="gmodal__input"
                    type="number"
                    inputMode="numeric"
                    placeholder="Сумма пополнения, Р"
                    value={raw}
                    onChange={e => setRaw(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                />

                <div className="gmodal__presets">
                    {[500, 1000, 5000, 10000].map(v => (
                        <button key={v} className="gmodal__preset" onClick={() => setRaw(String(v))}>
                            +{fmt(v)}
                        </button>
                    ))}
                </div>

                <div className="gmodal__actions">
                    <button className="gmodal__btn gmodal__btn--cancel" onClick={onClose}>
                        Отмена
                    </button>
                    <button
                        className="gmodal__btn gmodal__btn--confirm"
                        onClick={handleConfirm}
                        disabled={amount <= 0}
                    >
                        Пополнить
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Модалка: Детали ──────────────────────────────────────────────────────────

const DetailsModal = ({
    goal,
    onClose,
    onAddFunds,
}: {
    goal: Goal;
    onClose: () => void;
    onAddFunds: () => void;
}) => {
    const deleteGoal = useGoalsStore(s => s.deleteGoal);
    const p = pct(goal.saved, goal.target);
    const r = 40;
    const circ = 2 * Math.PI * r;
    const dash = (p / 100) * circ;

    const handleDelete = () => {
        if (confirm(`Удалить цель «${goal.name}»?`)) {
            deleteGoal(goal.id);
            onClose();
        }
    };

    return (
        <div className="gmodal" onClick={onClose}>
            <div className="gmodal__sheet" onClick={e => e.stopPropagation()}>
                <div className="gmodal__handle" />

                {/* Заголовок */}
                <div className="gmodal__detail-header">
                    <div className="gmodal__detail-icon" style={{ background: goal.emojiHue }}>
                        {goal.emoji}
                    </div>
                    <div>
                        <h3 className="gmodal__title gmodal__title--left">{goal.name}</h3>
                        <p className="gmodal__subtitle">{monthsLeft(goal)} · {fmt(goal.monthly)} Р/мес</p>
                    </div>
                </div>

                {/* Круговой прогресс */}
                <div className="gmodal__ring-wrap">
                    <svg width="110" height="110" viewBox="0 0 110 110">
                        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(76,175,80,0.15)" strokeWidth="10" />
                        <circle
                            cx="55" cy="55" r={r}
                            fill="none"
                            stroke={goal.barColor}
                            strokeWidth="10"
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeLinecap="round"
                            transform="rotate(-90 55 55)"
                        />
                        <text x="55" y="61" textAnchor="middle" fill="#1A2E1A"
                            fontSize="20" fontWeight="900" fontFamily="Nunito, sans-serif">
                            {p}%
                        </text>
                    </svg>
                </div>

                {/* Статы */}
                <div className="gmodal__stats">
                    <div className="gmodal__stat">
                        <span className="gmodal__stat-label">Накоплено</span>
                        <span className="gmodal__stat-val">{fmt(goal.saved)} Р</span>
                    </div>
                    <div className="gmodal__stat-div" />
                    <div className="gmodal__stat">
                        <span className="gmodal__stat-label">Цель</span>
                        <span className="gmodal__stat-val">{fmt(goal.target)} Р</span>
                    </div>
                    <div className="gmodal__stat-div" />
                    <div className="gmodal__stat">
                        <span className="gmodal__stat-label">Осталось</span>
                        <span className="gmodal__stat-val">{fmt(Math.max(0, goal.target - goal.saved))} Р</span>
                    </div>
                </div>

                <div className="gmodal__actions">
                    <button className="gmodal__btn gmodal__btn--cancel" onClick={handleDelete}>
                        🗑 Удалить
                    </button>
                    <button className="gmodal__btn gmodal__btn--confirm" onClick={() => { onClose(); onAddFunds(); }}>
                        + Пополнить
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Модалка: Новая цель ──────────────────────────────────────────────────────

const NewGoalModal = ({ onClose }: { onClose: () => void }) => {
    const addGoal = useGoalsStore(s => s.addGoal);
    const [step, setStep] = useState<'icon' | 'details'>('icon');
    const [selected, setSelected] = useState(ICONS[0]);
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [monthly, setMonthly] = useState('');
    const [deadline, setDeadline] = useState('');
    const [barColor, setBarColor] = useState(BAR_COLORS[0].value);

    const canSubmit = name.trim() && parseInt(target) > 0 && parseInt(monthly) > 0;

    const handleCreate = () => {
        if (!canSubmit) return;
        addGoal({
            emoji: selected.emoji,
            emojiHue: selected.bg,
            name: name.trim(),
            saved: 0,
            target: parseInt(target),
            monthly: parseInt(monthly),
            deadline: deadline.trim() || null,
            barColor,
        });
        onClose();
    };

    return (
        <div className="gmodal" onClick={onClose}>
            <div className="gmodal__sheet gmodal__sheet--tall" onClick={e => e.stopPropagation()}>
                <div className="gmodal__handle" />

                {step === 'icon' ? (
                    <>
                        <h3 className="gmodal__title">Выбери иконку</h3>
                        <div className="gmodal__icon-grid">
                            {ICONS.map(ico => (
                                <button
                                    key={ico.emoji}
                                    className={`gmodal__ico-btn${selected.emoji === ico.emoji ? ' gmodal__ico-btn--active' : ''}`}
                                    style={{ background: ico.bg }}
                                    onClick={() => setSelected(ico)}
                                >
                                    {ico.emoji}
                                </button>
                            ))}
                        </div>
                        <button className="gmodal__btn gmodal__btn--confirm gmodal__btn--full" onClick={() => setStep('details')}>
                            Далее →
                        </button>
                    </>
                ) : (
                    <>
                        <div className="gmodal__new-header">
                            <div className="gmodal__detail-icon" style={{ background: selected.bg }}>
                                {selected.emoji}
                            </div>
                            <h3 className="gmodal__title gmodal__title--left">Новая цель</h3>
                        </div>

                        <div className="gmodal__form">
                            <label className="gmodal__label">Название</label>
                            <input
                                className="gmodal__input"
                                placeholder="Например: Новый iPhone"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoFocus
                            />

                            <label className="gmodal__label">Сумма цели, Р</label>
                            <input
                                className="gmodal__input"
                                type="number"
                                inputMode="numeric"
                                placeholder="100 000"
                                value={target}
                                onChange={e => setTarget(e.target.value.replace(/\D/g, ''))}
                            />

                            <label className="gmodal__label">Ежемесячный взнос, Р</label>
                            <input
                                className="gmodal__input"
                                type="number"
                                inputMode="numeric"
                                placeholder="5 000"
                                value={monthly}
                                onChange={e => setMonthly(e.target.value.replace(/\D/g, ''))}
                            />

                            <label className="gmodal__label">Срок (необязательно)</label>
                            <input
                                className="gmodal__input"
                                placeholder="до декабря"
                                value={deadline}
                                onChange={e => setDeadline(e.target.value)}
                            />

                            <label className="gmodal__label">Цвет прогресса</label>
                            <div className="gmodal__colors">
                                {BAR_COLORS.map(c => (
                                    <button
                                        key={c.value}
                                        className={`gmodal__color-dot${barColor === c.value ? ' gmodal__color-dot--active' : ''}`}
                                        style={{ background: c.value }}
                                        onClick={() => setBarColor(c.value)}
                                        title={c.label}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="gmodal__actions">
                            <button className="gmodal__btn gmodal__btn--cancel" onClick={() => setStep('icon')}>
                                ← Назад
                            </button>
                            <button
                                className="gmodal__btn gmodal__btn--confirm"
                                onClick={handleCreate}
                                disabled={!canSubmit}
                            >
                                Создать
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// ─── Карточка цели ────────────────────────────────────────────────────────────

const GoalCard = ({ goal }: { goal: Goal }) => {
    const [modal, setModal] = useState<'funds' | 'details' | null>(null);
    const p = pct(goal.saved, goal.target);
    const isComplete = p >= 100;

    return (
        <>
            <div className={`gcard${isComplete ? ' gcard--done' : ''}`}>
                {/* Шапка */}
                <div className="gcard__head">
                    <div className="gcard__icon" style={{ background: goal.emojiHue }}>
                        {goal.emoji}
                    </div>
                    <div className="gcard__info">
                        <h3 className="gcard__name">{goal.name}</h3>
                        <p className="gcard__sub">
                            {monthsLeft(goal)} · {fmt(goal.monthly)} Р/мес
                        </p>
                    </div>
                    <div className="gcard__pct-badge">
                        {p}%
                    </div>
                </div>

                {/* Прогресс-бар */}
                <div className="gcard__bar-wrap">
                    <div
                        className="gcard__bar-fill"
                        style={{ width: `${p}%`, background: goal.barColor }}
                    />
                </div>

                {/* Суммы */}
                <div className="gcard__amounts">
                    <div>
                        <span className="gcard__amounts-label">Накоплено</span>
                        <span className="gcard__amounts-val">{fmt(goal.saved)} Р</span>
                    </div>
                    <div className="gcard__amounts-right">
                        <span className="gcard__amounts-label">Цель</span>
                        <span className="gcard__amounts-val">{fmt(goal.target)} Р</span>
                    </div>
                </div>

                {/* Кнопки */}
                <div className="gcard__btns">
                    <button
                        className="gcard__btn gcard__btn--primary"
                        onClick={() => setModal('funds')}
                        disabled={isComplete}
                    >
                        {isComplete ? '✓ Накоплено!' : '+ Пополнить'}
                    </button>
                    <button
                        className="gcard__btn gcard__btn--secondary"
                        onClick={() => setModal('details')}
                    >
                        Детали
                    </button>
                </div>
            </div>

            {modal === 'funds' && (
                <AddFundsModal goal={goal} onClose={() => setModal(null)} />
            )}
            {modal === 'details' && (
                <DetailsModal
                    goal={goal}
                    onClose={() => setModal(null)}
                    onAddFunds={() => setModal('funds')}
                />
            )}
        </>
    );
};

// ─── Главная страница ─────────────────────────────────────────────────────────

export const GoalsPage = () => {
    const navigate = useNavigate();
    const goals = useGoalsStore(s => s.goals);
    const [showNewGoal, setShowNewGoal] = useState(false);

    const totalSaved  = goals.reduce((sum, g) => sum + g.saved, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
    const overallPct  = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

    return (
        <div className="goals-page">
            <div className="goals-page__body">

                {/* ── Заголовок ───────────────────────────────────────────── */}
                <div className="goals-page__header">
                    <div>
                        <h1 className="goals-page__title">Цели</h1>
                        <p className="goals-page__subtitle">
                            Активных: {goals.length} · Накоплено: {fmt(totalSaved)} Р
                        </p>
                    </div>
                    <img src={labiImg} alt="Labi" className="goals-page__labi" />
                </div>

                {/* ── Общий прогресс ──────────────────────────────────────── */}
                <div className="goals-page__progress-card">
                    <div className="goals-page__progress-top">
                        <div>
                            <p className="goals-page__progress-label">ОБЩИЙ ПРОГРЕСС</p>
                            <p className="goals-page__progress-nums">
                                {fmt(totalSaved)} из {fmt(totalTarget)}{' '}
                                <span className="goals-page__progress-cur">Р</span>
                            </p>
                        </div>
                        <CircleProgress pct={overallPct} />
                    </div>

                    {/* Кнопка новой цели */}
                    <button
                        className="goals-page__new-btn"
                        onClick={() => setShowNewGoal(true)}
                    >
                        <div className="goals-page__new-plus">+</div>
                        <div className="goals-page__new-text">
                            <span className="goals-page__new-title">Новая цель</span>
                            <span className="goals-page__new-hint">Labi поможет копить быстрее</span>
                        </div>
                        <span className="goals-page__new-arrow">→</span>
                    </button>
                </div>

                {/* ── Список целей ─────────────────────────────────────────── */}
                <div className="goals-page__list">
                    {goals.length === 0 ? (
                        <div className="goals-page__empty">
                            <p>Целей пока нет.</p>
                            <p>Нажми «Новая цель» чтобы начать!</p>
                        </div>
                    ) : (
                        goals.map(g => <GoalCard key={g.id} goal={g} />)
                    )}
                </div>

                <div style={{ height: 100 }} />
            </div>

            {/* ── Навигация ─────────────────────────────────────────────── */}
            <nav className="goals-page__nav">
                <button className="goals-page__nav-btn" onClick={() => navigate('/dashboard')}>
                    <IcoHome />
                    <span>Главная</span>
                </button>
                <button className="goals-page__nav-btn" onClick={() => navigate('/dashboard')}>
                    <IcoChart />
                    <span>Аналитика</span>
                </button>
                <button className="goals-page__fab" onClick={() => setShowNewGoal(true)} aria-label="Добавить цель">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </button>
                <button className="goals-page__nav-btn goals-page__nav-btn--active">
                    <IcoTarget active />
                    <span>Цели</span>
                </button>
                <button className="goals-page__nav-btn" onClick={() => navigate('/dashboard')}>
                    <IcoUser />
                    <span>Профиль</span>
                </button>
            </nav>

            {/* ── Модалка новой цели ───────────────────────────────────── */}
            {showNewGoal && <NewGoalModal onClose={() => setShowNewGoal(false)} />}
        </div>
    );
};
