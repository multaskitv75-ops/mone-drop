const fetch = require('node-fetch');

class SteamAPI {
    constructor() {
        this.apiKey = process.env.STEAM_API_KEY;
        this.baseUrl = 'https://api.steampowered.com';
        this.communityUrl = 'https://steamcommunity.com';
        this.cache = new Map();
    }

    // Получить информацию о скине из Steam Market
    async getSkinMarketData(marketHashName) {
        try {
            const cacheKey = `market_${marketHashName}`;
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            const url = `${this.communityUrl}/market/listings/730/${encodeURIComponent(marketHashName)}`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (response.ok) {
                const html = await response.text();
                // Извлекаем данные из HTML страницы
                const marketData = this.extractMarketData(html);
                this.cache.set(cacheKey, marketData);
                return marketData;
            }

            return null;
        } catch (error) {
            console.error(`Error fetching market data for ${marketHashName}:`, error);
            return null;
        }
    }

    // Извлечение данных из HTML
    extractMarketData(html) {
        const data = {
            imageUrl: null,
            price: null,
            volume: null
        };

        // Извлекаем URL изображения
        const imgMatch = html.match(/"large":"([^"]+)"/);
        if (imgMatch) {
            data.imageUrl = imgMatch[1].replace('\\', '');
        }

        // Извлекаем цену
        const priceMatch = html.match(/"price":"([^"]+)"/);
        if (priceMatch) {
            data.price = priceMatch[1];
        }

        // Извлекаем объем продаж
        const volumeMatch = html.match(/"volume":"([^"]+)"/);
        if (volumeMatch) {
            data.volume = volumeMatch[1];
        }

        return data;
    }

    // Получить URL картинки скина по market hash name
    getSkinImageUrl(marketHashName) {
        // Формируем URL для Steam Economy Image API
        // Это более надежный способ получить картинки
        return `https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxk/360fx360f`;
    }

    // Получить все скины с картинками
    async getSkinsWithImages(skins) {
        const updatedSkins = [];

        for (const skin of skins) {
            const marketHashName = this.getMarketHashName(skin.name);
            const marketData = await this.getSkinMarketData(marketHashName);

            updatedSkins.push({
                ...skin,
                image: marketData?.imageUrl || skin.image,
                marketPrice: marketData?.price,
                marketVolume: marketData?.volume
            });

            // Небольшая задержка чтобы не блокировали
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return updatedSkins;
    }

    // Преобразование названия скина в market hash name
    getMarketHashName(skinName) {
        // Пример: "AK-47 | Redline (Field-Tested)" -> "AK-47%20%7C%20Redline%20%28Field-Tested%29"
        return skinName.replace(/\s+/g, ' ').trim();
    }

    // Получить актуальные цены для всех скинов
    async updateSkinsPrices(skins) {
        const updatedSkins = [];

        for (const skin of skins) {
            const marketHashName = this.getMarketHashName(skin.name);
            const marketData = await this.getSkinMarketData(marketHashName);

            if (marketData?.price) {
                // Конвертируем цену из строки типа "$12.34" в число
                const priceStr = marketData.price.replace(/[^0-9.]/g, '');
                const price = parseFloat(priceStr) * 70; // Примерный курс RUB/USD

                updatedSkins.push({
                    ...skin,
                    price: Math.floor(price),
                    image: marketData.imageUrl || skin.image
                });
            } else {
                updatedSkins.push(skin);
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return updatedSkins;
    }

    // Очистка кэша
    clearCache() {
        this.cache.clear();
    }
}

module.exports = new SteamAPI();