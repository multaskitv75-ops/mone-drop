const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

function getUsers() {
    try {
        const data = fs.readFileSync(usersFile, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

passport.serializeUser((user, done) => {
    done(null, user.steamId || user.id);
});

passport.deserializeUser((id, done) => {
    const users = getUsers();
    const user = users.find(u => u.steamId === id || u.id === id);
    done(null, user || null);
});

passport.use(new SteamStrategy({
    returnURL: process.env.STEAM_RETURN_URL,
    realm: 'http://localhost:3000',
    apiKey: process.env.STEAM_API_KEY
}, (identifier, profile, done) => {
    process.nextTick(() => {
        const users = getUsers();
        let user = users.find(u => u.steamId === identifier);

        if (!user) {
            user = {
                id: Date.now(), // ← ВАЖНО: id это число, не steamId
                steamId: identifier,
                username: profile.displayName || `Steam_${identifier.slice(-8)}`,
                avatar: profile.photos?.[2]?.value || profile.photos?.[0]?.value || '',
                balance: 1000,
                xp: 0,
                level: 1,
                pride: 0,
                claimedRewards: [],
                frames: [],
                equippedFrame: null,
                inventory: [],
                stats: { casesOpened: 0, totalSpent: 0, bestDrop: null, skinsSold: 0 },
                createdAt: new Date().toISOString()
            };
            users.push(user);
            saveUsers(users);
            console.log('✅ Новый пользователь Steam создан:', user.username, '| ID:', user.id);
        } else {
            user.username = profile.displayName || user.username;
            const newAvatar = profile.photos?.[2]?.value || profile.photos?.[0]?.value || '';
            if (newAvatar) user.avatar = newAvatar;
            saveUsers(users);
            console.log('✅ Пользователь Steam обновлен:', user.username);
        }

        return done(null, user);
    });
}));

module.exports = passport;