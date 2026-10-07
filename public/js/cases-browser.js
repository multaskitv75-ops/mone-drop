// Для браузера используем ES modules
export const casesData = {
    robero: {
        name: "Robero",
        subtitle: "new",
        cases: [
            { id: 1, name: "Fiesko", price: 29, icon: "📦" },
            { id: 2, name: "Millstar", price: 49, icon: "" },
            { id: 3, name: "Alibaba", price: 99, icon: "🎯" },
            { id: 4, name: "Sun diego", price: 189, icon: "" },
            { id: 5, name: "StayCary", price: 279, icon: "" },
            { id: 6, name: "Wingo", price: 498, icon: "" },
            { id: 7, name: "DepClose", price: 799, icon: "" },
            { id: 8, name: "Cry", price: 1399, icon: "" },
            { id: 9, name: "Laytaco", price: 2199, icon: "" },
            { id: 10, name: "Selvador", price: 2999, icon: "🎪" }
        ]
    },
    eliteSailoop: {
        name: "Elite Sailoop",
        subtitle: "actions",
        cases: [
            { id: 11, name: "Qwantum", price: 59, icon: "" },
            { id: 12, name: "Saiga", price: 119, icon: "" },
            { id: 13, name: "Starbox", price: 259, icon: "" },
            { id: 14, name: "Viento", price: 399, icon: "" },
            { id: 15, name: "Blowtine", price: 599, icon: "" },
            { id: 16, name: "Surface", price: 999, oldPrice: 1200, icon: "" },
            { id: 17, name: "StreamCause", price: 1499, oldPrice: 1799, icon: "" },
            { id: 18, name: "Clavkingo", price: 1999, oldPrice: 2599, icon: "" },
            { id: 19, name: "Retage", price: 2699, oldPrice: 3299, icon: "" },
            { id: 20, name: "WallStrike", price: 3300, oldPrice: 4699, icon: "" }
        ]
    },
    noiseDun: {
        name: "NoiseDun",
        subtitle: "",
        cases: [
            { id: 21, name: "Caratel", price: 499, icon: "" },
            { id: 22, name: "Tsar", price: 999, icon: "" },
            { id: 23, name: "Tiger", price: 1999, icon: "" },
            { id: 24, name: "Monser", price: 2999, icon: "" },
            { id: 25, name: "LongAce", price: 4999, icon: "" },
            { id: 26, name: "Stillclear", price: 9999, oldPrice: 12999, icon: "" },
            { id: 27, name: "Safari fun", price: 15999, oldPrice: 20000, icon: "" },
            { id: 28, name: "FastWin", price: 22000, oldPrice: 25999, icon: "" },
            { id: 29, name: "Lunar drop", price: 58000, icon: "" },
            { id: 30, name: "Mone Drop", price: 100000, icon: "" }
        ]
    },
    knife: {
        name: "Knife",
        subtitle: "",
        cases: [
            { id: 31, name: "Shadow Blade", price: 4999, icon: "" },
            { id: 32, name: "Crimson Edge", price: 9999, icon: "" },
            { id: 33, name: "Golden Fang", price: 19999, icon: "" },
            { id: 34, name: "Steel Whisper", price: 34999, icon: "" },
            { id: 35, name: "Dragon's Tooth", price: 59999, icon: "" },
            { id: 36, name: "Phantom Cut", price: 89999, icon: "" },
            { id: 37, name: "Midnight Slash", price: 149999, icon: "" },
            { id: 38, name: "Fire Edge", price: 249999, icon: "" }
        ]
    }
};

export function generateCaseItems(casePrice, itemsCount = 42) {
    const items = [];
    const RTP = 0.90;
    
    const priceRanges = [
        { min: casePrice * 0.1, max: casePrice * 0.5, weight: 4000 },
        { min: casePrice * 0.5, max: casePrice * 1.0, weight: 2500 },
        { min: casePrice * 1.0, max: casePrice * 2.0, weight: 1000 },
        { min: casePrice * 2.0, max: casePrice * 5.0, weight: 400 },
        { min: casePrice * 5.0, max: casePrice * 10.0, weight: 100 },
        { min: casePrice * 10.0, max: casePrice * 50.0, weight: 20 }
    ];

    const totalWeight = priceRanges.reduce((sum, range) => sum + range.weight, 0);
    const adjustedRanges = priceRanges.map(range => ({
        ...range,
        weight: Math.floor(range.weight * RTP)
    }));

    for (let i = 0; i < itemsCount; i++) {
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

        const skinPrice = Math.floor(
            Math.random() * (selectedRange.max - selectedRange.min) + selectedRange.min
        );

        // Здесь должна быть логика выбора скина из базы
        // Для простоты создаём заглушку
        items.push({
            skinId: 1000 + i,
            weight: selectedRange.weight,
            skin: { 
                id: 1000 + i, 
                name: `Skin #${i}`, 
                price: skinPrice, 
                rarity: 'milspec',
                icon: ''
            }
        });
    }

    return items;
}