export interface Goal {
    id: string;
    emoji: string;
    emojiHue: string;   // фон кружка с эмодзи
    name: string;
    saved: number;      // уже накоплено
    target: number;     // цель
    monthly: number;    // ежемесячный взнос
    deadline: string | null; // "до июля" или null (тогда считаем месяцы)
    barColor: string;   // цвет прогресс-бара
    createdAt: number;
}
