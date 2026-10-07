require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('./src/config/passport');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const steamMarket = require('./src/services/steamMarket');

// ВАЖНО: импортируем serverSkins для генерации предметов кейса
const { casesData, allCases, AntiAbuseSystem, serverSkins } = require('./src/cases-server.js');
const antiAbuseSystem = new AntiAbuseSystem();

// Путь к файлу дропов
const dropsFilePath = path.join(__dirname, 'src', 'data', 'drops.json');

// Функция для чтения дропов
function getDrops() {
    try {
        const data = fs.readFileSync(dropsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Функция для сохранения дропа
function saveDrop(drop) {
    const drops = getDrops();
    drops.unshift(drop);
    if (drops.length > 50) {
        drops.length = 50;
    }
    fs.writeFileSync(dropsFilePath, JSON.stringify(drops, null, 2));
}

// ===== БЕЗОПАСНОСТЬ =====
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

// ===== СТАТИЧЕСКИЕ ФАЙЛЫ =====
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===== СЕССИИ =====
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// ===== PASSPORT =====
app.use(passport.initialize());
app.use(passport.session());

// ===== RATE LIMITING =====
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Слишком много запросов'
});
app.use('/api/', limiter);

// ===== API МАРШРУТЫ =====
// Все роуты авторизации (/api/auth/me, /api/auth/logout, /api/auth/register, и т.д.)
// находятся в src/routes/auth.js — НЕ дублируем их здесь!
app.use('/api/auth', require('./src/routes/auth'));

// API: Получить скины (один раз!)
app.get('/api/skins', (req, res) => {
    res.json(serverSkins);
});

// API: Получить последние дропы
app.get('/api/drops', (req, res) => {
    const drops = getDrops();
    res.json(drops);
});

// ===== API: Открыть кейс (ИСПРАВЛЕННЫЙ) =====
app.post('/api/case/open', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Не авторизован' });

    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usersFilePath = path.join(__dirname, 'src', 'data', 'users.json');
        const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
        const user = users.find(u => u.id === decoded.userId);
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

        const caseId = parseInt(req.body.caseId);
        let caseData = null;
        for (const section of Object.values(casesData)) {
            const found = section.cases.find(c => c.id === caseId);
            if (found) { caseData = found; break; }
        }
        if (!caseData) return res.status(404).json({ error: 'Кейс не найден' });
        if (user.balance < caseData.price) return res.status(400).json({ error: 'Недостаточно средств' });

        const userId = user.id;
        user.balance -= caseData.price;
        antiAbuseSystem.recordSpend(userId, caseData.price);

        const { serverSkins } = require('./src/cases-server.js');
        const caseItems = [];
        const categories = [
            { minRatio: 0.4, maxRatio: 1.5, count: 20, weight: 5000 },
            { minRatio: 1.5, maxRatio: 3, count: 10, weight: 2000 },
            { minRatio: 3, maxRatio: 8, count: 7, weight: 500 },
            { minRatio: 8, maxRatio: 20, count: 3, weight: 50 },
            { minRatio: 20, maxRatio: 50, count: 1, weight: 10 },
            { minRatio: 50, maxRatio: 500, count: 1, weight: 5 }
        ];

        for (const category of categories) {
            const minPrice = caseData.price * category.minRatio;
            const maxPrice = Math.min(caseData.price * category.maxRatio, caseData.price * 500);
            const suitableSkins = serverSkins.filter(s => s.price >= minPrice && s.price <= maxPrice);
            for (let i = 0; i < category.count; i++) {
                const skin = suitableSkins.length > 0 
                    ? suitableSkins[Math.floor(Math.random() * suitableSkins.length)]
                    : serverSkins[Math.floor(Math.random() * serverSkins.length)];
                caseItems.push({ skinId: skin.id, weight: category.weight, skin });
            }
        }

        const adjustedItems = antiAbuseSystem.getAdjustedWeights(caseItems, userId);
        const totalWeight = adjustedItems.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        let wonItem = adjustedItems[0];
        for (const item of adjustedItems) {
            random -= item.weight;
            if (random <= 0) { wonItem = item; break; }
        }

        if (wonItem.skin.price > caseData.price * 500) {
            const cheapItems = adjustedItems.filter(i => i.skin.price <= caseData.price * 0.5);
            wonItem = cheapItems[Math.floor(Math.random() * cheapItems.length)];
        }

        if (!user.inventory) user.inventory = [];
        const wonSkin = { ...wonItem.skin, uniqueId: Date.now() + Math.random(), wonAt: new Date().toISOString(), caseName: caseData.name, casePrice: caseData.price };
        user.inventory.push(wonSkin);
        user.lastDrop = { skin: wonSkin, timestamp: Date.now() };
        antiAbuseSystem.recordWin(userId, wonItem.skin.price);

        // ===== НАЧИСЛЕНИЕ XP И ПОВЫШЕНИЕ УРОВНЯ =====
        const totalXP = 2 + Math.floor(caseData.price / 100);
        user.xp = (user.xp || 0) + totalXP;
        
        const oldLevel = user.level || 1;
        user.level = Math.floor(user.xp / 100) + 1;
        // Обновляем статистику (ЭТОГО НЕ ХВАТАЛО!)
        if (!user.stats) user.stats = { casesOpened: 0, totalSpent: 0, bestDrop: null, skinsSold: 0 };
        user.stats.casesOpened++;
        user.stats.totalSpent += caseData.price;

        if (!user.stats.bestDrop || wonSkin.price > user.stats.bestDrop.price) {
            user.stats.bestDrop = {
                name: wonSkin.name,
                price: wonSkin.price,
                image: wonSkin.image,
                date: new Date().toISOString()
            };
        }

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        
        saveDrop({ username: user.username, skin: wonSkin, caseName: caseData.name, timestamp: new Date().toISOString() });
        console.log(`[DROP] User: ${user.username} (ID: ${user.id}), Level: ${user.level}, XP: ${user.xp}, Best Drop: ${user.stats.bestDrop.price} mon`);

        res.json({
            skin: wonSkin,
            balance: user.balance,
            xp: user.xp,
            level: user.level,
            leveledUp: user.level > oldLevel,
            xpGained: totalXP,
            inventory: user.inventory,
            stats: user.stats // <-- Отправляем обновленную статистику
        });
        
        if (!user.claimedRewards) user.claimedRewards = []; // Массив забранных наград

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        saveDrop({ username: user.username, skin: wonSkin, caseName: caseData.name, timestamp: new Date().toISOString() });

        res.json({
            skin: wonSkin,
            balance: user.balance,
            xp: user.xp,
            level: user.level,
            leveledUp: user.level > oldLevel,
            xpGained: totalXP,
            inventory: user.inventory
        });
    } catch (err) {
        console.error('Ошибка:', err);
        res.status(401).json({ error: 'Неверный токен' });
    }
});
// ===== API: Получить последний дроп пользователя =====
app.get('/api/last-drop', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
        return res.json({ lastDrop: null });
    }

    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usersFilePath = path.join(__dirname, 'src', 'data', 'users.json');
        const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
        const user = users.find(u => u.id === decoded.userId);

        if (!user || !user.lastDrop) {
            return res.json({ lastDrop: null });
        }

        // Сохраняем дроп в ответе
        const lastDrop = user.lastDrop;

        // Очищаем lastDrop после получения
        user.lastDrop = null;
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

        res.json({ lastDrop });
    } catch (err) {
        res.json({ lastDrop: null });
    }
});

// ===== СТРАНИЦЫ =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.get('/upgrade', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'cases.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'shop.html'));
});

app.get('/levels', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'levels.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'register.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'profile.html'));
});

app.get('/case-detail', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'case-detail.html'));
});

// API: Обновить кэш скинов
app.post('/api/skins/refresh', (req, res) => {
    steamMarket.clearCache();
    res.json({ success: true, message: 'Cache cleared' });
});

// ===== 404 =====
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен!`);
    console.log(`🌐 http://localhost:${PORT}`);
    console.log(` Steam авторизация активна`);
});