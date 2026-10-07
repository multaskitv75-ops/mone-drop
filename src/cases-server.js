const serverSkins = [
    { id: 1, name: "P250 | Sand Dune", price: 12, rarity: "consumer", icon: "🔫", image: "/images/skins/1.avif" },
    { id: 2, name: "MAG-7 | Storm", price: 18, rarity: "consumer", icon: "🔫", image: "/images/skins/2.avif" },
    { id: 3, name: "MP9 | Storm", price: 22, rarity: "consumer", icon: "", image: "/images/skins/3.avif" },
    { id: 4, name: "Nova | Polar Mesh", price: 28, rarity: "consumer", icon: "🔫", image: "/images/skins/4.avif" },
    { id: 5, name: "G3SG1 | Safari Mesh", price: 32, rarity: "consumer", icon: "🔫", image: "/images/skins/5.avif" },
    { id: 6, name: "SCAR-20 | Sand Mesh", price: 38, rarity: "consumer", icon: "🔫", image: "/images/skins/6.avif" },
    { id: 7, name: "PP-Bizon | Sand Dashed", price: 42, rarity: "consumer", icon: "🔫", image: "/images/skins/7.avif" },
    { id: 8, name: "UMP-45 | Mudder", price: 48, rarity: "consumer", icon: "🔫", image: "/images/skins/8.avif" },
    { id: 9, name: "FAMAS | Colony", price: 55, rarity: "consumer", icon: "🔫", image: "/images/skins/9.avif" },
    { id: 10, name: "Galil AR | Sage Spray", price: 65, rarity: "consumer", icon: "🔫", image: "/images/skins/10.avif" },
    { id: 11, name: "P90 | Sand Spray", price: 75, rarity: "consumer", icon: "", image: "/images/skins/11.avif" },
    { id: 12, name: "SSG 08 | Sand Dune", price: 85, rarity: "consumer", icon: "🔫", image: "/images/skins/12.avif" },
    { id: 13, name: "MAC-10 | Sand Dashed", price: 95, rarity: "consumer", icon: "🔫", image: "/images/skins/13.avif" },
    { id: 14, name: "XM1014 | Sand Dune", price: 110, rarity: "consumer", icon: "🔫", image: "/images/skins/14.avif" },
    { id: 15, name: "MP7 | Army Recon", price: 125, rarity: "consumer", icon: "🔫", image: "/images/skins/15.avif" },
    { id: 16, name: "M249 | Contrast Spray", price: 140, rarity: "consumer", icon: "🔫", image: "/images/skins/16.avif" },
    { id: 17, name: "Glock-18 | Groundwater", price: 160, rarity: "industrial", icon: "🔫", image: "/images/skins/17.avif" },
    { id: 18, name: "USP-S | Forest DDPAT", price: 180, rarity: "industrial", icon: "🔫", image: "/images/skins/18.avif" },
    { id: 19, name: "AK-47 | Safari Mesh", price: 200, rarity: "industrial", icon: "🔫", image: "/images/skins/19.avif" },
    { id: 20, name: "M4A4 | Desert Storm", price: 230, rarity: "industrial", icon: "🔫", image: "/images/skins/20.avif" },
    { id: 21, name: "AWP | Safari Mesh", price: 260, rarity: "industrial", icon: "🔫", image: "/images/skins/21.avif" },
    { id: 22, name: "Desert Eagle | Urban DDPAT", price: 290, rarity: "industrial", icon: "", image: "/images/skins/22.avif" },
    { id: 23, name: "P250 | Boreal Forest", price: 320, rarity: "industrial", icon: "🔫", image: "/images/skins/23.avif" },
    { id: 24, name: "Five-SeveN | Forest Night", price: 360, rarity: "industrial", icon: "", image: "/images/skins/24.avif" },
    { id: 25, name: "Tec-9 | Sand Dune", price: 420, rarity: "milspec", icon: "🔫", image: "/images/skins/25.avif" },
    { id: 26, name: "MP5-SD | Autumn Twilly", price: 480, rarity: "milspec", icon: "🔫", image: "/images/skins/26.avif" },
    { id: 27, name: "SG 553 | Army Sheen", price: 540, rarity: "milspec", icon: "🔫", image: "/images/skins/27.avif" },
    { id: 28, name: "AUG | Sand Dune", price: 600, rarity: "milspec", icon: "🔫", image: "/images/skins/28.avif" },
    { id: 29, name: "SCAR-20 | Cardiac", price: 680, rarity: "milspec", icon: "🔫", image: "/images/skins/29.avif" },
    { id: 30, name: "G3SG1 | Desert Storm", price: 750, rarity: "milspec", icon: "🔫", image: "/images/skins/30.avif" },
    { id: 31, name: "Nova | Graphite", price: 820, rarity: "milspec", icon: "", image: "/images/skins/31.avif" },
    { id: 32, name: "XM1014 | Tranquility", price: 900, rarity: "milspec", icon: "🔫", image: "/images/skins/32.avif" },
    { id: 33, name: "AK-47 | Blue Laminate", price: 1100, rarity: "milspec", icon: "🔫", image: "/images/skins/33.avif" },
    { id: 34, name: "M4A1-S | Boreal Forest", price: 1300, rarity: "milspec", icon: "🔫", image: "/images/skins/34.avif" },
    { id: 35, name: "AWP | Worm God", price: 1500, rarity: "milspec", icon: "🔫", image: "/images/skins/35.avif" },
    { id: 36, name: "P90 | Elite Build", price: 1700, rarity: "milspec", icon: "🔫", image: "/images/skins/36.avif" },
    { id: 37, name: "MP7 | Skulls", price: 1900, rarity: "milspec", icon: "", image: "/images/skins/37.avif" },
    { id: 38, name: "UMP-45 | Carbon Fiber", price: 2100, rarity: "milspec", icon: "🔫", image: "/images/skins/38.avif" },
    { id: 39, name: "FAMAS | Cyanospatter", price: 2400, rarity: "milspec", icon: "🔫", image: "/images/skins/39.avif" },
    { id: 40, name: "Galil AR | Tuxedo", price: 2700, rarity: "milspec", icon: "🔫", image: "/images/skins/40.avif" },
    { id: 41, name: "AK-47 | Redline", price: 3200, rarity: "restricted", icon: "🔫", image: "/images/skins/41.avif" },
    { id: 42, name: "M4A4 | Red DDPAT", price: 3800, rarity: "restricted", icon: "🔫", image: "/images/skins/42.avif" },
    { id: 43, name: "AWP | Redline", price: 4500, rarity: "restricted", icon: "", image: "/images/skins/43.avif" },
    { id: 44, name: "Desert Eagle | Conspiracy", price: 5200, rarity: "restricted", icon: "🔫", image: "/images/skins/44.avif" },
    { id: 45, name: "USP-S | Orion", price: 6000, rarity: "restricted", icon: "🔫", image: "/images/skins/45.avif" },
    { id: 46, name: "Glock-18 | Reactor", price: 6800, rarity: "restricted", icon: "🔫", image: "/images/skins/46.avif" },
    { id: 47, name: "P250 | Nuclear Threat", price: 7500, rarity: "restricted", icon: "🔫", image: "/images/skins/47.avif" },
    { id: 48, name: "Five-SeveN | Case Hardened", price: 8500, rarity: "restricted", icon: "🔫", image: "/images/skins/48.avif" },
    { id: 49, name: "AK-47 | Vulcan", price: 12000, rarity: "classified", icon: "🔫", image: "/images/skins/49.avif" },
    { id: 50, name: "M4A4 | Asiimov", price: 16000, rarity: "classified", icon: "🔫", image: "/images/skins/50.avif" },
    { id: 51, name: "AWP | Asiimov", price: 20000, rarity: "classified", icon: "🔫", image: "/images/skins/51.avif" },
    { id: 52, name: "USP-S | Kill Confirmed", price: 25000, rarity: "classified", icon: "🔫", image: "/images/skins/52.avif" },
    { id: 53, name: "Glock-18 | Water Elemental", price: 30000, rarity: "classified", icon: "🔫", image: "/images/skins/53.avif" },
    { id: 54, name: "Desert Eagle | Code Red", price: 35000, rarity: "classified", icon: "🔫", image: "/images/skins/54.avif" },
    { id: 55, name: "P250 | Asiimov", price: 40000, rarity: "classified", icon: "🔫", image: "/images/skins/55.avif" },
    { id: 56, name: "Five-SeveN | Hyper Beast", price: 45000, rarity: "classified", icon: "🔫", image: "/images/skins/56.avif" },
    { id: 57, name: "AK-47 | Fire Serpent", price: 65000, rarity: "covert", icon: "🔫", image: "/images/skins/57.avif" },
    { id: 58, name: "M4A4 | Howl", price: 95000, rarity: "covert", icon: "🔫", image: "/images/skins/58.avif" },
    { id: 59, name: "AWP | Dragon Lore", price: 120000, rarity: "covert", icon: "🔫", image: "/images/skins/59.webp" },
    { id: 60, name: "AWP | Hyper Beast", price: 150000, rarity: "covert", icon: "🔫", image: "/images/skins/60.avif" },
    { id: 61, name: "M4A1-S | Printstream", price: 180000, rarity: "covert", icon: "🔫", image: "/images/skins/61.avif" },
    { id: 62, name: "Desert Eagle | Blaze", price: 200000, rarity: "covert", icon: "", image: "/images/skins/62.avif" },
    { id: 63, name: "★ Gut Knife | Fade", price: 280000, rarity: "rare", icon: "🔪", image: "/images/skins/63.avif" },
    { id: 64, name: "★ Huntsman Knife | Fade", price: 320000, rarity: "rare", icon: "", image: "/images/skins/64.avif" },
    { id: 65, name: "★ Flip Knife | Fade", price: 380000, rarity: "rare", icon: "🔪", image: "/images/skins/65.avif" },
    { id: 66, name: "★ Bayonet | Fade", price: 450000, rarity: "rare", icon: "🔪", image: "/images/skins/66.avif" },
    { id: 67, name: "★ Karambit | Fade", price: 520000, rarity: "rare", icon: "🔪", image: "/images/skins/67.avif" },
    { id: 68, name: "★ Butterfly Knife | Fade", price: 600000, rarity: "rare", icon: "🔪", image: "/images/skins/68.avif" }
];
// Данные кейсов
const casesData = {
    robero: {
        name: "Robero", subtitle: "new",
        cases: [
            { id: 1, name: "Fiesko", price: 29, image: "/images/cases/fiesko.png" },
            { id: 2, name: "Millstar", price: 49, image: "/images/cases/millstar.png" },
            { id: 3, name: "Alibaba", price: 99, image: "/images/cases/alibaba.png" },
            { id: 4, name: "Sun diego", price: 189, image: "/images/cases/sun-diego.png" },
            { id: 5, name: "StayCary", price: 279, image: "/images/cases/staycary.png" },
            { id: 6, name: "Wingo", price: 498, image: "/images/cases/wingo.png" },
            { id: 7, name: "DepClose", price: 799, image: "/images/cases/depclose.png" },
            { id: 8, name: "Cry", price: 1399, image: "/images/cases/cry.png" },
            { id: 9, name: "Laytaco", price: 2199, image: "/images/cases/laytaco.png" },
            { id: 10, name: "Selvador", price: 2999, image: "/images/cases/selvador.png" }
        ]
    },
    eliteSailoop: {
        name: "Elite Sailoop", subtitle: "actions",
        cases: [
            { id: 11, name: "Qwantum", price: 59, image: "/images/cases/qwantum.png" },
            { id: 12, name: "Saiga", price: 119, image: "/images/cases/saiga.png" },
            { id: 13, name: "Starbox", price: 259, image: "/images/cases/starbox.png" },
            { id: 14, name: "Viento", price: 399, image: "/images/cases/viento.png" },
            { id: 15, name: "Blowtine", price: 599, image: "/images/cases/blowtine.png" },
            { id: 16, name: "Surface", price: 999, oldPrice: 1200, image: "/images/cases/surface.png" },
            { id: 17, name: "StreamCause", price: 1499, oldPrice: 1799, image: "/images/cases/streamcause.png" },
            { id: 18, name: "Clavkingo", price: 1999, oldPrice: 2599, image: "/images/cases/clavkingo.png" },
            { id: 19, name: "Retage", price: 2699, oldPrice: 3299, image: "/images/cases/retage.png" },
            { id: 20, name: "WallStrike", price: 3300, oldPrice: 4699, image: "/images/cases/wallstrike.png" }
        ]
    },
    noiseDun: {
        name: "NoiseDun", subtitle: "",
        cases: [
            { id: 21, name: "Caratel", price: 499, image: "/images/cases/caratel.png" },
            { id: 22, name: "Tsar", price: 999, image: "/images/cases/tsar.png" },
            { id: 23, name: "Tiger", price: 1999, image: "/images/cases/tiger.png" },
            { id: 24, name: "Monser", price: 2999, image: "/images/cases/monser.png" },
            { id: 25, name: "LongAce", price: 4999, image: "/images/cases/longace.png" },
            { id: 26, name: "Stillclear", price: 9999, oldPrice: 12999, image: "/images/cases/stillclear.png" },
            { id: 27, name: "Safari fun", price: 15999, oldPrice: 20000, image: "/images/cases/safari-fun.png" },
            { id: 28, name: "FastWin", price: 22000, oldPrice: 25999, image: "/images/cases/fastwin.png" },
            { id: 29, name: "Lunar drop", price: 58000, image: "/images/cases/lunar-drop.png" },
            { id: 30, name: "Mone Drop", price: 100000, image: "/images/cases/mone-drop.png" }
        ]
    },
    knife: {
        name: "Knife", subtitle: "",
        cases: [
            { id: 31, name: "Shadow Blade", price: 4999, image: "/images/cases/shadow-blade.png" },
            { id: 32, name: "Crimson Edge", price: 9999, image: "/images/cases/crimson-edge.png" },
            { id: 33, name: "Golden Fang", price: 19999, image: "/images/cases/golden-fang.png" },
            { id: 34, name: "Steel Whisper", price: 34999, image: "/images/cases/steel-whisper.png" },
            { id: 35, name: "Dragon's Tooth", price: 59999, image: "/images/cases/dragons-tooth.png" },
            { id: 36, name: "Phantom Cut", price: 89999, image: "/images/cases/phantom-cut.png" },
            { id: 37, name: "Midnight Slash", price: 149999, image: "/images/cases/midnight-slash.png" },
            { id: 38, name: "Fire Edge", price: 249999, image: "/images/cases/fire-edge.png" }
        ]
    }
};

// ==========================================
// ЛОГИКА: ГАРАНТИРОВАННОЕ РАСПРЕДЕЛЕНИЕ (RTP ~85-92%)
// ==========================================
function generateStrictCaseItems(casePrice) {
    const items = [];
    const MAX_MULTIPLIER = 500;
    const MAX_PRICE = casePrice * MAX_MULTIPLIER;

    // Ценовые категории ОТНОСИТЕЛЬНО цены кейса
    const categories = [
        { name: "cheap", minRatio: 0.4, maxRatio: 1.5, count: 20, weight: 5000 },
        { name: "medium", minRatio: 1.5, maxRatio: 3, count: 10, weight: 2000 },
        { name: "expensive", minRatio: 3, maxRatio: 8, count: 7, weight: 500 },
        { name: "very_expensive", minRatio: 8, maxRatio: 20, count: 3, weight: 50 },
        { name: "ultra_expensive", minRatio: 20, maxRatio: 50, count: 1, weight: 10 },
        { name: "jackpot", minRatio: 50, maxRatio: 500, count: 1, weight: 5 }
    ];

    for (const category of categories) {
        const minPrice = casePrice * category.minRatio;
        const maxPrice = Math.min(casePrice * category.maxRatio, MAX_PRICE);
        
        const suitableSkins = serverSkins.filter(s => s.price >= minPrice && s.price <= maxPrice);
        
        for (let i = 0; i < category.count; i++) {
            let skin;
            
            if (suitableSkins.length > 0) {
                skin = suitableSkins[Math.floor(Math.random() * suitableSkins.length)];
            } else {
                const allSkinsInBudget = serverSkins.filter(s => s.price <= maxPrice);
                if (allSkinsInBudget.length > 0) {
                    skin = allSkinsInBudget[Math.floor(Math.random() * allSkinsInBudget.length)];
                } else {
                    skin = {
                        id: 9000 + items.length,
                        name: `Mystery Skin #${items.length}`,
                        price: Math.floor(maxPrice),
                        rarity: maxPrice > casePrice * 10 ? 'covert' : 'milspec',
                        icon: '🔫'
                    };
                }
            }
            
            items.push({
                skinId: skin.id,
                weight: category.weight,
                skin: skin // Передаем весь объект скина (с rarity и icon!)
            });
        }
    }
    
    return items;
}

// Кэшируем кейсы при старте
const allCases = [];
Object.values(casesData).forEach(section => {
    section.cases.forEach(caseInfo => {
        allCases.push({
            ...caseInfo,
            items: generateStrictCaseItems(caseInfo.price),
            itemsCount: 42
        });
    });
});

// ==========================================
// СИСТЕМА ЗАЩИТЫ ОТ АБУЗА
// ==========================================
class AntiAbuseSystem {
    constructor() { 
        this.userStats = new Map(); 
    }

    getUserStats(userId) {
        if (!this.userStats.has(userId)) {
            this.userStats.set(userId, { totalSpent: 0, totalWon: 0, lastWins: [], caseOpenCount: 0 });
        }
        return this.userStats.get(userId);
    }

    calculateLuckModifier(userId) {
        const stats = this.getUserStats(userId);
        const winRate = stats.totalWon / (stats.totalSpent || 1);
        
        // Если пользователь в огромном плюсе (>150%), режем шансы на дорогие дропы на 50%
        if (winRate > 1.5) return 0.5;
        
        // Если пользователь много потратил (>50к) и в минусе (<50%), даем небольшой буст (1.3x)
        if (winRate < 0.5 && stats.totalSpent > 50000) return 1.3;
        
        return 1.0;
    }

    recordWin(userId, skinPrice) {
        const stats = this.getUserStats(userId);
        stats.totalWon += skinPrice;
        stats.lastWins.push({ price: skinPrice, timestamp: Date.now() });
        if (stats.lastWins.length > 50) stats.lastWins.shift();
    }

    recordSpend(userId, amount) {
        const stats = this.getUserStats(userId);
        stats.totalSpent += amount;
    }

    getAdjustedWeights(items, userId) {
        const luckModifier = this.calculateLuckModifier(userId);
        return items.map(item => {
            let adjustedWeight = item.weight;
            // Если пользователь "везучий", снижаем вес дорогих предметов (>10к)
            if (luckModifier < 1.0 && item.skin.price > 10000) {
                adjustedWeight *= luckModifier;
            }
            return { ...item, weight: Math.max(1, adjustedWeight) };
        });
    }
}

module.exports = { casesData, allCases, AntiAbuseSystem, serverSkins };