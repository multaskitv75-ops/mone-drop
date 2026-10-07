import { skins, multipliers } from './data.js';
import { gameState } from './state.js';

// ЛОГИКА АПГРЕЙДА
export class UpgradeModule {
    constructor() {
        this.wheel = document.getElementById('wheel');
        this.arrow = document.getElementById('arrow');
        this.upgradeBtn = document.getElementById('upgradeBtn');
        this.chanceValue = document.getElementById('chanceValue');
        this.multiplierButtons = document.getElementById('multiplierButtons');
        this.betSkinContent = document.getElementById('betSkinContent');
        this.betSkinName = document.getElementById('betSkinName');
        this.betSkinPrice = document.getElementById('betSkinPrice');
        this.winSkinContent = document.getElementById('winSkinContent');
        this.winSkinName = document.getElementById('winSkinName');
        this.winSkinPrice = document.getElementById('winSkinPrice');
    }

    init() {
        // Если элементов нет на странице, не инициализируем
        if (!this.multiplierButtons) return;
        
        this.renderMultipliers();
        this.updateBetSkinDisplay();
        this.updateWinSkinDisplay();
    }

    renderMultipliers() {
        if (!this.multiplierButtons) return;
        
        this.multiplierButtons.innerHTML = multipliers.map(m => `
            <button class="multiplier-btn" onclick="upgradeModule.selectMultiplier(${m.value})" id="mult-${m.value}" disabled>
                <span class="multiplier-value">x${m.value}</span>
                <span class="multiplier-chance">${m.chance}% шанс</span>
            </button>
        `).join('');
    }

    selectMultiplier(value) {
        if (!gameState.selectMultiplier(value)) return;

        document.querySelectorAll('.multiplier-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`mult-${value}`).classList.add('active');

        const chance = multipliers.find(m => m.value === value).chance;
        if (this.chanceValue) {
            this.chanceValue.textContent = chance + '%';
        }

        this.updateWheel();
        this.updateWinSkinDisplay();
        if (this.upgradeBtn) {
            this.upgradeBtn.disabled = false;
        }
    }

    updateWheel() {
        if (!this.wheel) return;
        
        const chance = gameState.selectedMultiplier 
            ? multipliers.find(m => m.value === gameState.selectedMultiplier).chance 
            : 0;
        const winAngle = (chance / 100) * 360;
        this.wheel.style.setProperty('--win-angle', winAngle + 'deg');
    }

    enableMultipliers() {
        if (!gameState.selectedSkin) {
            multipliers.forEach(m => {
                const btn = document.getElementById(`mult-${m.value}`);
                if (btn) {
                    btn.disabled = true;
                    btn.classList.remove('active');
                }
            });
            return;
        }

        multipliers.forEach(m => {
            const btn = document.getElementById(`mult-${m.value}`);
            if (!btn) return;
            
            const targetPrice = gameState.selectedSkin.price * m.value;
            const hasTargetSkin = skins.some(s => s.price >= targetPrice * 0.9 && s.price <= targetPrice * 1.1);
            btn.disabled = !hasTargetSkin;
            if (!hasTargetSkin) btn.classList.remove('active');
        });
    }

    updateBetSkinDisplay() {
        if (!this.betSkinContent || !this.betSkinName || !this.betSkinPrice) return;
        
        if (gameState.selectedSkin) {
            this.betSkinContent.innerHTML = this.renderSkinImage(gameState.selectedSkin);
            this.betSkinName.textContent = gameState.selectedSkin.name;
            this.betSkinPrice.textContent = gameState.selectedSkin.price.toFixed(2) + ' ₽';
        } else {
            this.betSkinContent.innerHTML = '<span class="empty-preview">Выберите скин из инвентаря</span>';
            this.betSkinName.textContent = '-';
            this.betSkinPrice.textContent = '-';
        }
    }

    updateWinSkinDisplay() {
        if (!this.winSkinContent || !this.winSkinName || !this.winSkinPrice) return;
        
        if (gameState.selectedSkin && gameState.selectedMultiplier) {
            const targetPrice = gameState.selectedSkin.price * gameState.selectedMultiplier;
            const possibleSkins = skins.filter(s => s.price >= targetPrice * 0.9 && s.price <= targetPrice * 1.1);
            const winSkin = possibleSkins.length > 0 
                ? possibleSkins[Math.floor(Math.random() * possibleSkins.length)]
                : skins.find(s => s.price >= targetPrice) || skins[skins.length - 1];
            
            this.winSkinContent.innerHTML = this.renderSkinImage(winSkin);
            this.winSkinName.textContent = winSkin.name;
            this.winSkinPrice.textContent = winSkin.price.toFixed(2) + ' ₽';
        } else {
            this.winSkinContent.innerHTML = '<span class="empty-preview">Выберите множитель</span>';
            this.winSkinName.textContent = '-';
            this.winSkinPrice.textContent = '-';
        }
    }

    renderSkinImage(skin) {
        if (skin.image) {
            return `<img src="${skin.image}" alt="${skin.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><span class="emoji-fallback" style="display:none">${skin.icon}</span>`;
        }
        return `<span class="emoji-fallback">${skin.icon}</span>`;
    }

    startUpgrade() {
        if (!gameState.selectedSkin || !gameState.selectedMultiplier || gameState.isSpinning) return;
        if (!this.wheel || !this.arrow || !this.upgradeBtn) return;

        gameState.initAudio();
        gameState.isSpinning = true;
        this.upgradeBtn.disabled = true;

        const chance = multipliers.find(m => m.value === gameState.selectedMultiplier).chance;
        const winAngle = (chance / 100) * 360;

        let finalAngleOnWheel;
        const rand = Math.random() * 100;
        
        if (rand < chance) {
            if (Math.random() < 0.25) finalAngleOnWheel = winAngle - 1 - Math.random() * 3;
            else finalAngleOnWheel = Math.random() * (winAngle - 5);
        } else {
            if (Math.random() < 0.25) finalAngleOnWheel = winAngle + 1 + Math.random() * 3;
            else finalAngleOnWheel = winAngle + 10 + Math.random() * (360 - winAngle - 15);
        }

        const spins = 8;
        const totalRotation = gameState.currentArrowAngle + (spins * 360) + finalAngleOnWheel;

        this.wheel.classList.add('spinning');
        this.arrow.classList.add('shaking');

        let startTime = Date.now();
        const duration = 5000;
        const startAngle = gameState.currentArrowAngle;
        let lastClickAngle = Math.floor(startAngle / 10) * 10;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const currentAngle = startAngle + (totalRotation - startAngle) * eased;
            
            this.arrow.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;

            const currentClickAngle = Math.floor(currentAngle / 10) * 10;
            if (currentClickAngle !== lastClickAngle) {
                gameState.playClick();
                lastClickAngle = currentClickAngle;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                gameState.currentArrowAngle = totalRotation % 360;
                this.wheel.classList.remove('spinning');
                this.arrow.classList.remove('shaking');
                
                gameState.isSpinning = false;

                const finalNormalized = gameState.currentArrowAngle % 360;
                const won = finalNormalized <= winAngle;

                setTimeout(() => this.showResult(won), 500);
            }
        };

        animate();
    }

        showResult(won) {
        const modal = document.getElementById('resultModal');
        const content = document.getElementById('resultContent');
        const icon = document.getElementById('resultIcon');
        const title = document.getElementById('resultTitle');
        const skinDiv = document.getElementById('resultSkin');

        if (!modal || !content || !icon || !title || !skinDiv) return;

        modal.classList.add('active');

        if (won) {
            gameState.playWinSound();
            const targetPrice = gameState.selectedSkin.price * gameState.selectedMultiplier;
            const possibleSkins = skins.filter(s => s.price >= targetPrice * 0.9 && s.price <= targetPrice * 1.1);
            const wonSkin = possibleSkins.length > 0 
                ? possibleSkins[Math.floor(Math.random() * possibleSkins.length)]
                : skins.find(s => s.price >= targetPrice) || skins[skins.length - 1];

            content.className = 'result-content win';
            icon.textContent = '🎉';
            title.textContent = 'ВЫИГРЫШ!';
            skinDiv.innerHTML = `
                <div class="result-skin-icon">${this.renderSkinImage(wonSkin)}</div>
                <div class="result-skin-name">${wonSkin.name}</div>
                <div class="result-skin-price">${wonSkin.price.toFixed(2)} ₽</div>
            `;
            
            // Добавляем скин и сохраняем
            const item = { ...wonSkin, uniqueId: Date.now() + Math.random() };
            if (!gameState.inventory) {
                gameState.inventory = [];
            }
            gameState.inventory.push(item);
            gameState.saveInventoryToServer(); // ← Сохраняем инвентарь
        } else {
            gameState.playLoseSound();
            content.className = 'result-content lose';
            icon.textContent = '💔';
            title.textContent = 'ПРОИГРЫШ';
            skinDiv.innerHTML = `
                <div style="font-size: 1.2em; color: #ff4444;">
                    Вы потеряли:<br>${gameState.selectedSkin.name}<br>${gameState.selectedSkin.price.toFixed(2)} ₽
                </div>
            `;
            
            // Удаляем скин через API
            if (gameState.selectedSkin && gameState.selectedSkin.uniqueId) {
                gameState.sellSkinViaAPI(gameState.selectedSkin.uniqueId);
            }
        }

        // Сброс состояния
        gameState.deselectSkin();
        gameState.deselectMultiplier();
        this.updateBetSkinDisplay();
        this.updateWinSkinDisplay();
        if (this.chanceValue) this.chanceValue.textContent = '0%';
        if (this.upgradeBtn) this.upgradeBtn.disabled = true;
        document.querySelectorAll('.multiplier-btn').forEach(b => b.classList.remove('active'));
        this.enableMultipliers();

        // Обновить инвентарь
        if (window.shopModule) {
            window.shopModule.renderInventory();
        }
    }
}

export const upgradeModule = new UpgradeModule();