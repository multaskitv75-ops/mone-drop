const fetch = require('node-fetch');

class SteamMarketService {
    constructor() {
        this.cache = new Map();
        this.lastUpdate = null;
        this.apiKey = process.env.STEAM_API_KEY;
    }

    // Получить все скины CS:GO с рынка
    async getAllCSGOSkins() {
        const cacheKey = 'csgo_skins';
        const cached = this.cache.get(cacheKey);
        
        // Если кэш есть и он моложе 1 часа, возвращаем его
        if (cached && this.lastUpdate && (Date.now() - this.lastUpdate) < 3600000) {
            console.log(' Возвращаем кэшированные скины');
            return cached;
        }

        console.log('🔄 Загрузка скинов с Steam Market...');
        
        try {
            // Список популярных скинов для примера (в реальности можно расширить)
            const popularSkins = [
                'AK-47 | Redline (Field-Tested)',
                'AK-47 | Asiimov (Field-Tested)',
                'AK-47 | Vulcan (Minimal Wear)',
                'AK-47 | Fire Serpent (Field-Tested)',
                'M4A4 | Asiimov (Field-Tested)',
                'M4A4 | Howl (Minimal Wear)',
                'AWP | Dragon Lore (Field-Tested)',
                'AWP | Asiimov (Field-Tested)',
                'AWP | Hyper Beast (Minimal Wear)',
                'Desert Eagle | Blaze (Factory New)',
                'USP-S | Kill Confirmed (Minimal Wear)',
                'Glock-18 | Fade (Factory New)',
                'M4A1-S | Printstream (Minimal Wear)',
                'USP-S | Printstream (Minimal Wear)',
                'P90 | Asiimov (Field-Tested)',
                'AK-47 | Neon Rider (Minimal Wear)',
                'M4A4 | Neo-Noir (Minimal Wear)',
                'AWP | Wildfire (Minimal Wear)',
                'AK-47 | Bloodsport (Minimal Wear)',
                'M4A1-S | Hyper Beast (Minimal Wear)',
                'Desert Eagle | Kumicho Dragon (Minimal Wear)',
                'USP-S | Neo-Noir (Minimal Wear)',
                'Glock-18 | Water Elemental (Field-Tested)',
                'AWP | Electric Hive (Field-Tested)',
                'AK-47 | Point Disarray (Minimal Wear)',
                'M4A4 | The Emperor (Minimal Wear)',
                'AWP | Containment Breach (Minimal Wear)',
                'USP-S | Cortex (Minimal Wear)',
                'M4A1-S | Cyrex (Minimal Wear)',
                'Desert Eagle | Code Red (Minimal Wear)',
                'AK-47 | The Empress (Minimal Wear)',
                'M4A4 | Desolate Space (Minimal Wear)',
                'AWP | Fever Dream (Minimal Wear)',
                'USP-S | Ticket to Hell (Minimal Wear)',
                'Glock-18 | Neo-Noir (Minimal Wear)',
                'P90 | Neo-Noir (Minimal Wear)',
                'MP7 | Bloodsport (Minimal Wear)',
                'UMP-45 | Blaze (Factory New)',
                'Nova | Hyper Beast (Minimal Wear)',
                'MAG-7 | Heat (Minimal Wear)',
                '★ Karambit | Fade (Factory New)',
                '★ Butterfly Knife | Fade (Factory New)',
                '★ M9 Bayonet | Fade (Factory New)',
                '★ Bayonet | Fade (Factory New)',
                '★ Flip Knife | Fade (Factory New)',
                '★ Karambit | Doppler (Factory New)',
                '★ Butterfly Knife | Doppler (Factory New)',
                '★ Karambit | Tiger Tooth (Factory New)',
                '★ M9 Bayonet | Doppler (Factory New)',
                '★ Bayonet | Doppler (Factory New)'
            ];

            const skins = [];
            
            for (const skinName of popularSkins) {
                try {
                    const marketData = await this.getMarketData(skinName);
                    if (marketData) {
                        skins.push(marketData);
                    }
                    // Небольшая задержка чтобы не блокировали
                    await new Promise(resolve => setTimeout(resolve, 200));
                } catch (error) {
                    console.error(`Ошибка при загрузке ${skinName}:`, error.message);
                }
            }

            // Генерируем StatTrak версии
            const stattrakSkins = skins.map(skin => ({
                ...skin,
                name: `StatTrak™ ${skin.name}`,
                price: Math.floor(skin.price * 2.5),
                isStatTrak: true
            }));

            const allSkins = [...skins, ...stattrakSkins];
            
            this.cache.set(cacheKey, allSkins);
            this.lastUpdate = Date.now();
            
            console.log(`✅ Загружено ${allSkins.length} скинов`);
            return allSkins;
            
        } catch (error) {
            console.error('❌ Ошибка загрузки скинов:', error);
            return this.getFallbackSkins();
        }
    }

    // Получить данные о скине с рынка
    async getMarketData(marketHashName) {
        try {
            const url = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=5&market_hash_name=${encodeURIComponent(marketHashName)}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success && data.median_price) {
                // Конвертируем цену (убираем валюту и запятые)
                const priceStr = data.median_price.replace(/[^0-9.]/g, '');
                const priceUSD = parseFloat(priceStr);
                const priceRUB = Math.floor(priceUSD * 75); // Примерный курс
                
                // Определяем редкость
                const rarity = this.getRarityFromName(marketHashName);
                
                // Получаем картинку
                const image = this.getSkinImage(marketHashName);
                
                return {
                    id: skins.length + 1,
                    name: marketHashName.split(' | ')[0] + ' | ' + marketHashName.split(' | ')[1]?.split(' (')[0] || marketHashName,
                    fullName: marketHashName,
                    price: priceRUB,
                    rarity: rarity,
                    icon: marketHashName.includes('★') ? '🔪' : '🔫',
                    image: image,
                    isStatTrak: marketHashName.includes('StatTrak'),
                    steamPrice: data.median_price,
                    volume: data.volume || 0
                };
            }
            
            return null;
        } catch (error) {
            console.error(`Ошибка получения данных для ${marketHashName}:`, error.message);
            return null;
        }
    }

    // Определить редкость по названию
    getRarityFromName(name) {
        if (name.includes('★')) return 'rare';
        if (name.includes('Covert') || name.includes('Howl') || name.includes('Dragon Lore')) return 'covert';
        if (name.includes('Classified')) return 'classified';
        if (name.includes('Restricted')) return 'restricted';
        if (name.includes('Mil-Spec')) return 'milspec';
        if (name.includes('Industrial')) return 'industrial';
        return 'consumer';
    }

    // Получить URL картинки
    getSkinImage(marketHashName) {
        // Генерируем хэш для CDN Steam
        // В реальности нужно парсить страницу рынка для получения точного URL
        return ''; // Пока пусто, будем использовать fallback
    }

    // Fallback скины если API не работает
    getFallbackSkins() {
        return [
            { id: 1, name: 'AK-47 | Redline', price: 45000, rarity: 'classified', icon: '🔫', image: '' },
            { id: 2, name: 'AWP | Asiimov', price: 85000, rarity: 'covert', icon: '🔫', image: '' },
            { id: 3, name: 'M4A4 | Howl', price: 450000, rarity: 'covert', icon: '🔫', image: '' },
            // ... больше скинов
        ];
    }

    // Очистить кэш
    clearCache() {
        this.cache.clear();
        this.lastUpdate = null;
    }
}

module.exports = new SteamMarketService();