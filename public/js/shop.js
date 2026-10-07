import { skins, rarityNames } from './data.js';
import { gameState } from './state.js';
import { auth } from './auth.js'; 

// ЛОГИКА МАГАЗИНА И ИНВЕНТАРЯ
export class ShopModule {
    constructor() {
        this.shopGrid = document.getElementById('shopGrid');
        this.inventoryGrid = document.getElementById('inventoryGrid');
    }

    init() {
        this.renderShop();
        this.renderInventory();
    }

    renderShop() {
        if (!this.shopGrid) return;
        
        this.shopGrid.innerHTML = skins.map(skin => `
            <div class="skin-card">
                <div class="skin-image rarity-${skin.rarity}">
                    <span class="skin-rarity rarity-${skin.rarity}">${rarityNames[skin.rarity]}</span>
                    ${this.renderSkinImage(skin)}
                </div>
                <div class="skin-name">${skin.name}</div>
                <div class="skin-price">${skin.price.toFixed(2)} ₽</div>
                <button class="buy-btn" onclick="window.shopModule.buySkin(${skin.id})">КУПИТЬ</button>
            </div>
        `).join('');
    }

    renderInventory() {
        if (!this.inventoryGrid) return;
        
        if (!gameState.inventory || gameState.inventory.length === 0) {
            this.inventoryGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #556070; font-size: 1.2em;">Инвентарь пуст - купите скины или откройте кейсы!</div>';
            return;
        }

        this.inventoryGrid.innerHTML = gameState.inventory.map(skin => `
            <div class="skin-card" id="inv-${skin.uniqueId}" onclick="window.shopModule.selectSkin(${skin.uniqueId})">
                <div class="skin-image rarity-${skin.rarity}">
                    <span class="skin-rarity rarity-${skin.rarity}">${rarityNames[skin.rarity]}</span>
                    ${this.renderSkinImage(skin)}
                </div>
                <div class="skin-name">${skin.name}</div>
                <div class="skin-price">${skin.price.toFixed(2)} ₽</div>
                <button class="sell-btn" onclick="event.stopPropagation(); window.shopModule.sellSkin(${skin.uniqueId})">ПРОДАТЬ</button>
            </div>
        `).join('');
    }

    renderSkinImage(skin) {
        if (skin.image) {
            return `<img src="${skin.image}" alt="${skin.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><span class="emoji-fallback" style="display:none">${skin.icon}</span>`;
        }
        return `<span class="emoji-fallback">${skin.icon || '🔫'}</span>`;
    }

        buySkin(id) {
        console.log('buySkin called with id:', id);
        
        if (!auth.isAuthenticated()) {
            console.log('Not authenticated');
            auth.showAuthModal();
            return;
        }
        
        const skin = skins.find(s => s.id === id);
        if (!skin) {
            console.log('Skin not found');
            return;
        }
        
        console.log('Current balance:', gameState.balance, 'Skin price:', skin.price);
        
        if (gameState.balance < skin.price) {
            this.showNotification('Недостаточно средств!', 'error');
            return;
        }

        // Используем методы gameState которые сохраняют на сервер
        gameState.balance -= skin.price;
        gameState.notifyBalanceUpdate();
        gameState.saveBalanceToServer(); // ← Сохраняем баланс
        
        const item = { ...skin, uniqueId: Date.now() + Math.random() };
        if (!gameState.inventory) {
            gameState.inventory = [];
        }
        gameState.inventory.push(item);
        gameState.saveInventoryToServer(); // ← Сохраняем инвентарь
        
        console.log('Bought skin:', skin.name, 'New balance:', gameState.balance);
        
        this.renderInventory();
        this.showNotification(`Куплен: ${skin.name}`, 'success');
    }

    sellSkin(uniqueId) {
        if (!gameState.inventory) return;
        
        const skin = gameState.inventory.find(s => s.uniqueId === uniqueId);
        if (skin) {
            // Используем API для продажи
            gameState.sellSkinViaAPI(uniqueId).then(soldSkin => {
                if (soldSkin) {
                    this.renderInventory();
                    this.showNotification(`Продан: ${soldSkin.name} за ${soldSkin.price.toFixed(2)} ₽`, 'success');
                    
                    if (window.upgradeModule) {
                        window.upgradeModule.updateBetSkinDisplay();
                        window.upgradeModule.enableMultipliers();
                    }
                }
            });
        }
    }

    selectSkin(uniqueId) {
        if (!gameState.inventory) return;
        
        const skin = gameState.inventory.find(s => s.uniqueId === uniqueId);
        if (skin) {
            gameState.selectedSkin = skin;
            
            document.querySelectorAll('#inventoryGrid .skin-card').forEach(c => c.classList.remove('selected'));
            const card = document.getElementById(`inv-${uniqueId}`);
            if (card) card.classList.add('selected');

            if (window.upgradeModule) {
                window.upgradeModule.updateBetSkinDisplay();
                window.upgradeModule.updateWinSkinDisplay();
                window.upgradeModule.enableMultipliers();
            }
        }
    }

    showNotification(text, type) {
        const notif = document.createElement('div');
        notif.className = 'notification ' + (type === 'success' ? 'success' : '');
        notif.textContent = text;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.opacity = '0';
            notif.style.transform = 'translateX(400px)';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }
}

export const shopModule = new ShopModule();

// Делаем глобальным для onclick
if (typeof window !== 'undefined') {
    window.shopModule = shopModule;
}