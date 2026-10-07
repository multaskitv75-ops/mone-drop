const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const usersFile = path.join(__dirname, '../data/users.json');

function getUsers() {
    const data = fs.readFileSync(usersFile, 'utf-8');
    return JSON.parse(data);
}

function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}


// РЕГИСТРАЦИЯ (обычная)
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Заполните все поля' });
        }

        const users = getUsers();
        
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'Пользователь уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now(),
            username,
            password: hashedPassword,
            balance: 10000,
            pride: 0,
            frames: [], // Полученные рамки
    equippedFrame: null,
            xp: 0, // ← ДОБАВЬ ЭТО
            level: 1, // ← ДОБАВЬ ЭТО
            inventory: [],
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        const token = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                balance: newUser.balance
            }
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ВХОД (обычный)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Заполните все поля' });
        }

        const users = getUsers();
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(400).json({ error: 'Пользователь не найден' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Неверный пароль' });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                balance: user.balance
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// STEAM АВТОРИЗАЦИЯ - начало
router.get('/steam', (req, res, next) => {
    passport.authenticate('steam', { failureRedirect: '/login' })(req, res, next);
});

// STEAM CALLBACK
router.get('/steam/return',
    (req, res, next) => {
        passport.authenticate('steam', { failureRedirect: '/login' })(req, res, next);
    },
    (req, res) => {
        console.log('=== STEAM AUTH SUCCESS ===');
        console.log('User:', req.user);
        
        // ВСЕГДА используем id (не steamId) для токена
        const token = jwt.sign(
            { userId: req.user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        });
        
        res.redirect(`/?token=${token}&username=${encodeURIComponent(req.user.username)}`);
    }
);
// ВЫХОД
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
});

// ПОЛУЧИТЬ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
// ПОЛУЧИТЬ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
// ПОЛУЧИТЬ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
// ПОЛУЧИТЬ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
router.get('/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    if (!token) {
        return res.status(401).json({ error: 'Не авторизован' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const users = getUsers();
        
        // Ищем пользователя по id ИЛИ по steamId
        const user = users.find(u => u.id === decoded.userId || u.steamId === decoded.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        res.json({
            user: {
                id: user.id,
                steamId: user.steamId || null,
                username: user.username,
                balance: user.balance,
                xp: user.xp || 0,
                level: user.level || 1,
                pride: user.pride || 0,
                claimedRewards: user.claimedRewards || [],
                frames: Array.isArray(user.frames) ? user.frames : [],
                equippedFrame: user.equippedFrame || null,
                inventory: user.inventory || [],
                avatar: user.avatar || '',
                stats: user.stats || { casesOpened: 0, totalSpent: 0, bestDrop: null, skinsSold: 0 }
            }
        });
    } catch (err) {
        console.error('Ошибка /me:', err);
        res.status(401).json({ error: 'Неверный токен' });
    }
});
// ОБНОВИТЬ БАЛАНС
router.post('/balance', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (!token) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const users = getUsers();
        const user = users.find(u => u.id === decoded.userId);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const { balance } = req.body;
        user.balance = balance;
        saveUsers(users);

        res.json({ success: true, balance: user.balance });
    } catch (err) {
        res.status(401).json({ error: 'Неверный токен' });
    }
});

// ОБНОВИТЬ ИНВЕНТАРЬ
router.post('/inventory', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (!token) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const users = getUsers();
        const user = users.find(u => u.id === decoded.userId);

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const { inventory } = req.body;
        user.inventory = inventory;
        saveUsers(users);

        res.json({ success: true, inventory: user.inventory });
    } catch (err) {
        res.status(401).json({ error: 'Неверный токен' });
    }
});

// ПРОДАТЬ СКИН
// ПРОДАЖА СКИНА (с защитой от двойной продажи)
router.post('/sell-skin', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Не авторизован' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const users = getUsers();
        const user = users.find(u => u.id === decoded.userId);
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

        const { uniqueId } = req.body;
        if (!uniqueId) return res.status(400).json({ error: 'Не указан uniqueId скина' });

        // Ищем скин в инвентаре
        const skinIndex = user.inventory.findIndex(item => item.uniqueId === uniqueId);
        
        // ЖЕЛЕЗОБЕТОННАЯ ЗАЩИТА: если скина нет, значит он уже продан или его нет
        if (skinIndex === -1) {
            return res.status(404).json({ error: 'Скин не найден в инвентаре или уже продан' });
        }

        const skin = user.inventory[skinIndex];
        
        // 1. СРАЗУ удаляем скин из инвентаря
        user.inventory.splice(skinIndex, 1);
        
        // 2. Начисляем деньги
        user.balance += skin.price;
        
        // 3. Обновляем статистику
        if (!user.stats) user.stats = { casesOpened: 0, totalSpent: 0, bestDrop: null, skinsSold: 0 };
        user.stats.skinsSold = (user.stats.skinsSold || 0) + 1;

        // 4. Сохраняем в БД
        saveUsers(users);

        res.json({
            success: true,
            balance: user.balance,
            inventory: user.inventory,
            soldPrice: skin.price
        });
    } catch (err) {
        console.error('Ошибка продажи:', err);
        res.status(401).json({ error: 'Неверный токен' });
    }
});
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Выход выполнен' });
});
// ОБМЕН УРОВНЯ
router.post('/exchange-level', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Не авторизован' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const users = getUsers();
        const user = users.find(u => u.id === decoded.userId);
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
        
        const { level } = req.body;
        const currentLevel = user.level || 1;
        
        if (level > currentLevel) {
            return res.status(400).json({ error: 'Уровень ещё не достигнут' });
        }
        
        if (level < 5) {
            return res.status(400).json({ error: 'Минимальный уровень для обмена: 5' });
        }
        
        if (!user.exchangedLevels) user.exchangedLevels = [];
        if (user.exchangedLevels.includes(level)) {
            return res.status(400).json({ error: 'Уровень уже обменян' });
        }
        
        // Награда
        const rewards = {
            5: { coins: 25000, xp: 500 },
            10: { coins: 50000, xp: 1000 },
            15: { coins: 100000, xp: 2000 },
            20: { coins: 200000, xp: 5000 },
            25: { coins: 350000, xp: 10000 },
            30: { coins: 500000, xp: 20000 },
            35: { coins: 1000000, xp: 50000 }
        };
        
        const reward = rewards[level] || { coins: level * 5000, xp: level * 100 };
        
        user.balance = (user.balance || 0) + reward.coins;
        user.xp = (user.xp || 0) + reward.xp;
        user.exchangedLevels.push(level);
        
        saveUsers(users);
        
        res.json({
            success: true,
            reward: `${reward.coins.toLocaleString()} mon + ${reward.xp} XP`,
            coins: reward.coins,
            xp: reward.xp
        });
    } catch (err) {
        res.status(401).json({ error: 'Неверный токен' });
    }
});
// ЗАБРАТЬ НАГРАДУ ЗА УРОВЕНЬ
// ЗАБРАТЬ НАГРАДУ ЗА УРОВЕНЬ
router.post('/claim-reward', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Не авторизован' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const users = getUsers();
        const user = users.find(u => u.id === decoded.userId);
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

        const { level } = req.body;
        if (!user.claimedRewards) user.claimedRewards = [];

        if (user.level < level) return res.status(400).json({ error: 'Уровень еще не достигнут' });
        if (user.claimedRewards.includes(level)) return res.status(400).json({ error: 'Награда уже забрана' });

        // Определяем, является ли уровень кратным 5 (рамка)
        const isFrameLevel = level % 5 === 0;
        
        // Таблица наград
        const baseRewards = {
            2: 200,
            3: 300,
            4: 500,
            5: 1000,
            6: 800,
            7: 1000,
            8: 1500,
            9: 2000,
            10: 3000,
            11: 2500,
            12: 3000,
            13: 4000,
            14: 3500,
            15: 5000,
            16: 4500,
            17: 6000,
            18: 5500,
            19: 7000,
            20: 8000,
            21: 7500,
            22: 9000,
            23: 10000,
            24: 9500,
            25: 12000,
            26: 11000,
            27: 13000,
            28: 12500,
            29: 14000,
            30: 15000,
            31: 14500,
            32: 16000,
            33: 17000,
            34: 16500,
            35: 20000
        };

        const coins = baseRewards[level] || level * 1000;
        let pride = 1; // Базовый pride за каждый уровень
        
        // Дополнительные pride за рамки (каждые 5 уровней)
        if (isFrameLevel) {
            pride += 1; // +1 pride за рамку
        }

        // Название награды
        let rewardName = `${coins} mon + ${pride} Pride`;
        if (isFrameLevel) {
            const frameNames = {
                5: 'Бронзовая',
                10: 'Серебряная',
                15: 'Золотая',
                20: 'Платиновая',
                25: 'Алмазная',
                30: 'Рубиновая',
                35: 'Легендарная'
            };
            rewardName += ` + ${frameNames[level] || ''} рамка`;
        }

        // Выдаем награду
        user.balance += coins;
        user.pride = (user.pride || 0) + pride;
        
        // Сохраняем рамку если есть
        if (isFrameLevel) {
            if (!user.frames) user.frames = [];
            user.frames.push({
                level: level,
                type: isFrameLevel ? 'frame' : 'none',
                name: rewardName,
                claimedAt: new Date().toISOString()
            });
        }
        
        user.claimedRewards.push(level);
        saveUsers(users);

        res.json({
            success: true,
            rewardName: rewardName,
            coins: coins,
            pride: pride,
            hasFrame: isFrameLevel,
            newBalance: user.balance,
            newPride: user.pride,
            newLevel: user.level
        });
    } catch (err) {
        res.status(401).json({ error: 'Неверный токен' });
    }
    
});
// ПРИМЕНИТЬ РАМКУ
router.post('/equip-frame', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Не авторизован' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const users = getUsers();
        const user = users.find(u => u.id === decoded.userId);
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

        const { level } = req.body;
        
        // Проверяем, есть ли у пользователя эта рамка
        if (!user.frames || !user.frames.some(f => f.level === level)) {
            return res.status(400).json({ error: 'У вас нет этой рамки' });
        }

        // Применяем рамку
        user.equippedFrame = level;
        saveUsers(users);

        res.json({
            success: true,
            equippedFrame: level
        });
    } catch (err) {
        res.status(401).json({ error: 'Неверный токен' });
    }
});

// СНЯТЬ РАМКУ
router.post('/unequip-frame', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Не авторизован' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const users = getUsers();
        const user = users.find(u => u.id === decoded.userId);
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

        user.equippedFrame = null;
        saveUsers(users);

        res.json({
            success: true,
            equippedFrame: null
        });
    } catch (err) {
        res.status(401).json({ error: 'Неверный токен' });
    }
});
module.exports = router;