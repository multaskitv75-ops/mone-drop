import { skins } from './data.js';
import { auth } from './auth.js'; 

class GameState {
    constructor() {
        this.balance = 0;
        this.inventory = [];
        this.selectedSkin = null;
        this.selectedMultiplier = null;
        this.isSpinning = false;
        this.currentArrowAngle = 0;
        this.audioContext = null;
        this.isUserLoaded = false;
    }

    async loadUserData(user) {
        console.log('Loading user data:', user);
        if (user) {
            this.balance = user.balance || 0;
            this.inventory = user.inventory || [];
            this.isUserLoaded = true;
            console.log('User data loaded. Balance:', this.balance);
        } else {
            this.balance = 0;
            this.inventory = [];
            this.isUserLoaded = false;
        }
        this.notifyBalanceUpdate();
    }

    // СОХРАНИТЬ БАЛАНС НА СЕРВЕРЕ
    async saveBalanceToServer() {
        if (!auth || !auth.token) return;
        
        try {
            await fetch('/api/auth/balance', {
                method: 'POST',
                headers: auth.getHeaders(),
                body: JSON.stringify({ balance: this.balance })
            });
            console.log('Balance saved to server:', this.balance);
        } catch (err) {
            console.error('Failed to save balance:', err);
        }
    }

    // СОХРАНИТЬ ИНВЕНТАРЬ НА СЕРВЕРЕ
    async saveInventoryToServer() {
        if (!auth || !auth.token) return;
        
        try {
            await fetch('/api/auth/inventory', {
                method: 'POST',
                headers: auth.getHeaders(),
                body: JSON.stringify({ inventory: this.inventory })
            });
            console.log('Inventory saved to server');
        } catch (err) {
            console.error('Failed to save inventory:', err);
        }
    }

    checkAuth() {
        if (!auth || !auth.isAuthenticated()) {
            if (auth && auth.showAuthModal) {
                auth.showAuthModal();
            }
            return false;
        }
        return true;
    }

    updateBalance(amount) {
        if (!this.checkAuth()) return false;
        this.balance += amount;
        this.notifyBalanceUpdate();
        this.saveBalanceToServer(); // ← Сохраняем на сервер
        return true;
    }

    setBalance(amount) {
        this.balance = amount;
        this.notifyBalanceUpdate();
        this.saveBalanceToServer();
    }

    notifyBalanceUpdate() {
        const balanceEl = document.getElementById('balance');
        if (balanceEl) {
            balanceEl.textContent = this.balance.toLocaleString();
        }
    }

    addToInventory(skin) {
        if (!this.checkAuth()) return null;
        const item = { ...skin, uniqueId: Date.now() + Math.random() };
        if (!this.inventory) {
            this.inventory = [];
        }
        this.inventory.push(item);
        this.saveInventoryToServer(); // ← Сохраняем на сервер
        return item;
    }

    removeFromInventory(uniqueId) {
        if (!this.inventory) return null;
        const skin = this.inventory.find(s => s.uniqueId === uniqueId);
        if (skin) {
            this.inventory = this.inventory.filter(s => s.uniqueId !== uniqueId);
            if (this.selectedSkin && this.selectedSkin.uniqueId === uniqueId) {
                this.selectedSkin = null;
            }
            this.saveInventoryToServer(); // ← Сохраняем на сервер
        }
        return skin;
    }

    // ПРОДАТЬ СКИН ЧЕРЕЗ API
    async sellSkinViaAPI(uniqueId) {
        if (!this.checkAuth()) return null;
        
        try {
            const res = await fetch('/api/auth/sell-skin', {
                method: 'POST',
                headers: auth.getHeaders(),
                body: JSON.stringify({ uniqueId })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            this.balance = data.balance;
            this.inventory = data.inventory;
            this.notifyBalanceUpdate();
            
            return data.soldSkin;
        } catch (err) {
            console.error('Failed to sell skin:', err);
            return null;
        }
    }

    selectSkin(uniqueId) {
        if (!this.checkAuth()) return false;
        if (this.isSpinning) return false;
        if (!this.inventory) return false;
        
        const skin = this.inventory.find(s => s.uniqueId === uniqueId);
        if (!skin) return false;

        this.selectedSkin = skin;
        return true;
    }

    deselectSkin() {
        this.selectedSkin = null;
    }

    selectMultiplier(value) {
        if (!this.checkAuth()) return false;
        if (this.isSpinning || !this.selectedSkin) return false;
        this.selectedMultiplier = value;
        return true;
    }

    deselectMultiplier() {
        this.selectedMultiplier = null;
    }

    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playClick() {
        if (!this.audioContext) return;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.frequency.value = 1200;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.08, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.03);
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.03);
    }

    playWinSound() {
        if (!this.audioContext) return;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.15, this.audioContext.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + i * 0.1 + 0.3);
            osc.start(this.audioContext.currentTime + i * 0.1);
            osc.stop(this.audioContext.currentTime + i * 0.1 + 0.3);
        });
    }

    playLoseSound() {
        if (!this.audioContext) return;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.frequency.value = 200;
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.5);
    }

    playCaseTick() {
        if (!this.audioContext) return;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.frequency.value = 600 + Math.random() * 400;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.02);
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.02);
    }

    playCaseWin() {
        if (!this.audioContext) return;
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'triangle';
            gain.gain.setValueAtTime(0.2, this.audioContext.currentTime + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + i * 0.15 + 0.4);
            osc.start(this.audioContext.currentTime + i * 0.15);
            osc.stop(this.audioContext.currentTime + i * 0.15 + 0.4);
        });
    }
}

export const gameState = new GameState();