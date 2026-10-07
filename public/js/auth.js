// АВТОРИЗАЦИЯ
class Auth {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    async loadUser() {
        if (!this.token) return null;
        try {
            const res = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            if (!res.ok) {
                this.logout();
                return null;
            }
            const data = await res.json();
            this.user = data.user;
            localStorage.setItem('user', JSON.stringify(this.user));
            this.updateUI();
            return this.user;
        } catch (err) {
            console.error('Ошибка загрузки пользователя:', err);
            return null;
        }
    }

   updateUI() {
    if (!this.user) {
        const profileName = document.getElementById('profileName');
        if (profileName) profileName.textContent = 'Гость';
        return;
    }

    const profileName = document.getElementById('profileName');
    if (profileName) {
        const level = this.user.level || 1;
        profileName.textContent = `${this.user.username} (Ур. ${level})`;
    }

    const balanceSection = document.getElementById('balanceSection');
    if (balanceSection && this.user.balance !== undefined) {
        balanceSection.innerHTML = `
            <img src="/images/icons/icon-balance.png" alt="Balance" class="balance-icon-png">
            <span class="balance-amount">${this.user.balance.toLocaleString('ru-RU')} mon</span>
        `;
    }

    // Отображение Pride
     // Pride
    const prideSection = document.getElementById('prideSection');
    if (prideSection && this.user.pride !== undefined) {
        prideSection.innerHTML = `
            <div class="pride-display" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: rgba(255, 215, 0, 0.15); border: 1px solid rgba(255, 215, 0, 0.4); border-radius: 10px;">
                <span style="font-size: 20px;">👑</span>
                <span style="font-size: 14px; font-weight: bold; color: #ffd700; text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);">${this.user.pride} Pride</span>
            </div>
        `;
    }

    const xpSection = document.getElementById('xpSection');
    if (xpSection && this.user.xp !== undefined) {
        const currentLevel = this.user.level || 1;
        const xpInLevel = this.user.xp % 100;
        xpSection.innerHTML = `
            <div class="xp-display" style="display: flex; align-items: center; gap: 10px;">
                <span class="xp-level" style="font-size: 14px; font-weight: bold; color: #00d4ff;">Ур. ${currentLevel}</span>
                <div class="xp-bar" style="width: 80px; height: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; overflow: hidden;">
                    <div class="xp-progress" style="width: ${xpInLevel}%; height: 100%; background: linear-gradient(90deg, #00d4ff, #0099cc); border-radius: 4px;"></div>
                </div>
                <span class="xp-amount" style="font-size: 12px; color: #888;">${this.user.xp} XP</span>
            </div>
        `;
    }
}
    async logout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
        } catch (err) {
            console.error('Ошибка выхода:', err);
        }
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    async checkUrlToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const username = urlParams.get('username');
        if (token && username) {
            this.token = token;
            this.user = { username, balance: 0 };
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
            window.history.replaceState({}, document.title, '/');
            await this.loadUser();
        }
    }

    async register(username, password) {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            this.token = data.token;
            this.user = data.user;
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
            this.updateUI();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    async login(username, password) {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            this.token = data.token;
            this.user = data.user;
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
            this.updateUI();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) modal.classList.add('active');
    }
}

const auth = new Auth();
window.auth = auth;

window.closeAuthModal = () => {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('active');
};

document.addEventListener('DOMContentLoaded', async () => {
    await auth.checkUrlToken();
    if (localStorage.getItem('token')) {
        await auth.loadUser();
    } else {
        const profileName = document.getElementById('profileName');
        if (profileName) profileName.textContent = 'Гость';
    }
});

export { auth };