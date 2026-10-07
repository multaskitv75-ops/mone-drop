// ==========================================
// СТРУКТУРА ВСЕХ КЕЙСОВ С ЭКОНОМИКОЙ
// ==========================================
const { skins } = require('./data.js');
const casesData = {
    // РАЗДЕЛ: Robero (new)
    robero: {
        name: "Robero",
        subtitle: "new",
        cases: [
            { id: 1, name: "Fiesko", price: 29, icon: "📦" },
            { id: 2, name: "Millstar", price: 49, icon: "" },
            { id: 3, name: "Alibaba", price: 99, icon: "🎯" },
            { id: 4, name: "Sun diego", price: 189, icon: "💎" },
            { id: 5, name: "StayCary", price: 279, icon: "🔥" },
            { id: 6, name: "Wingo", price: 498, icon: "⭐" },
            { id: 7, name: "DepClose", price: 799, icon: "" },
            { id: 8, name: "Cry", price: 1399, icon: "💫" },
            { id: 9, name: "Laytaco", price: 2199, icon: "✨" },
            { id: 10, name: "Selvador", price: 2999, icon: "🎪" }
        ]
    },

    // РАЗДЕЛ: Elite Sailoop (actions)
    eliteSailoop: {
        name: "Elite Sailoop",
        subtitle: "actions",
        cases: [
            { id: 11, name: "Qwantum", price: 59, icon: "⚡" },
            { id: 12, name: "Saiga", price: 119, icon: "🎲" },
            { id: 13, name: "Starbox", price: 259, icon: "🌠" },
            { id: 14, name: "Viento", price: 399, icon: "️" },
            { id: 15, name: "Blowtine", price: 599, icon: "💨" },
            { id: 16, name: "Surface", price: 999, oldPrice: 1200, icon: "" },
            { id: 17, name: "StreamCause", price: 1499, oldPrice: 1799, icon: "🌊" },
            { id: 18, name: "Clavkingo", price: 1999, oldPrice: 2599, icon: "👑" },
            { id: 19, name: "Retage", price: 2699, oldPrice: 3299, icon: "🏆" },
            { id: 20, name: "WallStrike", price: 3300, oldPrice: 4699, icon: "💥" }
        ]
    },

    // РАЗДЕЛ: NoiseDun
    noiseDun: {
        name: "NoiseDun",
        subtitle: "",
        cases: [
            { id: 21, name: "Caratel", price: 499, icon: "🎸" },
            { id: 22, name: "Tsar", price: 999, icon: "" },
            { id: 23, name: "Tiger", price: 1999, icon: "🐯" },
            { id: 24, name: "Monser", price: 2999, icon: "👹" },
            { id: 25, name: "LongAce", price: 4999, icon: "" },
            { id: 26, name: "Stillclear", price: 9999, oldPrice: 12999, icon: "💎" },
            { id: 27, name: "Safari fun", price: 15999, oldPrice: 20000, icon: "" },
            { id: 28, name: "FastWin", price: 22000, oldPrice: 25999, icon: "⚡" },
            { id: 29, name: "Lunar drop", price: 58000, icon: "🌙" },
            { id: 30, name: "Mone Drop", price: 100000, icon: "" }
        ]
    },

    // РАЗДЕЛ: Knife
    knife: {
        name: "Knife",
        subtitle: "",
        cases: [
            { id: 31, name: "Shadow Blade", price: 4999, icon: "️" },
            { id: 32, name: "Crimson Edge", price: 9999, icon: "" },
            { id: 33, name: "Golden Fang", price: 19999, icon: "⚔️" },
            { id: 34, name: "Steel Whisper", price: 34999, icon: "🗡️" },
            { id: 35, name: "Dragon's Tooth", price: 59999, icon: "🐉" },
            { id: 36, name: "Phantom Cut", price: 89999, icon: "👻" },
            { id: 37, name: "Midnight Slash", price: 149999, icon: "" },
            { id: 38, name: "Fire Edge", price: 249999, icon: "🔥" }
        ]
    }
};

// ==========================================
// ГЕНЕРАЦИЯ СКИНОВ ДЛЯ КЕЙСОВ С ПРАВИЛЬНЫМИ ВЕСАМИ
// ==========================================

export function generateCaseItems(casePrice, itemsCount = 42) {
    const items = [];
    
    // RTP = 90% (игрок получает 90% от вложенного)
    const RTP = 0.90;
    
    // Распределяем скины по ценовым категориям
    // Формула: чем дороже скин относительно кейса, тем меньше шанс
    const priceRanges = [
        { min: casePrice * 0.1, max: casePrice * 0.5, weight: 4000 },  // Дешёвые (10-50% от цены кейса)
        { min: casePrice * 0.5, max: casePrice * 1.0, weight: 2500 },  // Средние (50-100%)
        { min: casePrice * 1.0, max: casePrice * 2.0, weight: 1000 },  // Выше среднего (100-200%)
        { min: casePrice * 2.0, max: casePrice * 5.0, weight: 400 },   // Дорогие (200-500%)
        { min: casePrice * 5.0, max: casePrice * 10.0, weight: 100 },  // Очень дорогие (500-1000%)
        { min: casePrice * 10.0, max: casePrice * 50.0, weight: 20 }   // Ультра редкие (1000-5000%)
    ];

    // Корректировка весов для RTP 90%
    const totalWeight = priceRanges.reduce((sum, range) => sum + range.weight, 0);
    const adjustedRanges = priceRanges.map(range => ({
        ...range,
        weight: Math.floor(range.weight * RTP)
    }));

    // Генерируем скины
    for (let i = 0; i < itemsCount; i++) {
        // Выбираем ценовую категорию на основе весов
        const random = Math.random() * totalWeight;
        let selectedRange = adjustedRanges[0];
        let cumulativeWeight = 0;
        
        for (const range of adjustedRanges) {
            cumulativeWeight += range.weight;
            if (random <= cumulativeWeight) {
                selectedRange = range;
                break;
            }
        }

        // Генерируем случайную цену в выбранном диапазоне
        const skinPrice = Math.floor(
            Math.random() * (selectedRange.max - selectedRange.min) + selectedRange.min
        );

        // Находим подходящий скин из базы
        const availableSkins = skins.filter(s => 
            s.price >= skinPrice * 0.8 && s.price <= skinPrice * 1.2
        );

        const skin = availableSkins.length > 0 
            ? availableSkins[Math.floor(Math.random() * availableSkins.length)]
            : { 
                id: 1000 + i, 
                name: `Skin #${i}`, 
                price: skinPrice, 
                rarity: 'milspec',
                icon: '🔫'
            };

        items.push({
            skinId: skin.id,
            weight: selectedRange.weight,
            skin: skin
        });
    }

    return items;
}

// ==========================================
// СИСТЕМА ЗАЩИТЫ ОТ АБУЗА
// ==========================================

class AntiAbuseSystem {
    constructor() {
        this.userStats = new Map(); // userId -> { totalSpent, totalWon, lastWins, caseOpenCount }
    }

    // Получить статистику пользователя
    getUserStats(userId) {
        if (!this.userStats.has(userId)) {
            this.userStats.set(userId, {
                totalSpent: 0,
                totalWon: 0,
                lastWins: [],
                caseOpenCount: 0,
                lastWinTime: 0
            });
        }
        return this.userStats.get(userId);
    }

    // Рассчитать модификатор удачи
    calculateLuckModifier(userId) {
        const stats = this.getUserStats(userId);
        const winRate = stats.totalWon / (stats.totalSpent || 1);
        
        // Если игрок выигрывает больше, чем тратит - снижаем шансы
        if (winRate > 1.5) {
            return 0.5; // Урезаем шансы на 50%
        } else if (winRate > 1.2) {
            return 0.7; // Урезаем на 30%
        } else if (winRate < 0.5 && stats.totalSpent > 50000) {
            return 1.3; // Повышаем шансы на 30% (чтобы не ушёл)
        }
        
        return 1.0;
    }

    // Проверить лимит выигрыша за час
    checkHourlyLimit(userId, maxWinPerHour = 100000) {
        const stats = this.getUserStats(userId);
        const oneHourAgo = Date.now() - 3600000;
        
        const recentWins = stats.lastWins.filter(w => w.timestamp > oneHourAgo);
        const totalRecentWins = recentWins.reduce((sum, w) => sum + w.price, 0);
        
        return totalRecentWins < maxWinPerHour;
    }

    // Определить, должен ли игрок проиграть (гарантированный проигрыш)
    shouldForceLoss(userId) {
        const stats = this.getUserStats(userId);
        stats.caseOpenCount++;
        
        // Каждый 10-й кейс - гарантированно дешёвый скин
        return stats.caseOpenCount % 10 === 0;
    }

    // Записать выигрыш
    recordWin(userId, skinPrice) {
        const stats = this.getUserStats(userId);
        stats.totalWon += skinPrice;
        stats.lastWins.push({
            price: skinPrice,
            timestamp: Date.now()
        });
        
        // Храним только последние 100 выигрышей
        if (stats.lastWins.length > 100) {
            stats.lastWins.shift();
        }
    }

    // Записать трату
    recordSpend(userId, amount) {
        const stats = this.getUserStats(userId);
        stats.totalSpent += amount;
    }

    // Получить скорректированные веса для кейса
    getAdjustedWeights(items, userId) {
        const luckModifier = this.calculateLuckModifier(userId);
        const shouldForceLoss = this.shouldForceLoss(userId);
        
        return items.map(item => {
            let adjustedWeight = item.weight;
            
            // Если игрок слишком везучий - снижаем веса дорогих скинов
            if (luckModifier < 1.0 && item.skin.price > 10000) {
                adjustedWeight *= luckModifier;
            }
            
            // Если должен проиграть - обнуляем веса дорогих скинов
            if (shouldForceLoss && item.skin.price > 5000) {
                adjustedWeight = 0;
            }
            
            return { ...item, weight: Math.max(1, adjustedWeight) };
        });
    }
}

// Экспортируем экземпляр системы защиты
module.exports = {
    casesData,
    generateCaseItems,
    AntiAbuseSystem
};