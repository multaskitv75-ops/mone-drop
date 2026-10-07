import { skins, cases, rarityColors } from './data.js';
import { gameState } from './state.js';
import { auth } from './auth.js';

export class CasesModule {
    constructor() {
        this.casesGrid = document.getElementById('casesGrid');
        this.lastWonSkin = null; // ← Сохраняем последний выигранный скин
    }

    init() {
        this.renderCases();
    }

   renderCases() {
    if (!this.casesGrid) return;

    this.casesGrid.innerHTML = cases.map(c => `
        <div class="case-card" onclick="window.location.href='/case-detail?id=${c.id}'" style="cursor: pointer;">
            <div class="case-image">${c.icon}</div>
            <div class="case-name">${c.name}</div>
            <div class="case-price">${c.price.toFixed(2)} ₽</div>
        </div>
    `).join('');
}

    getRandomItemFromCase(caseData) {
        const totalWeight = caseData.items.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        for (const item of caseData.items) {
            random -= item.weight;
            if (random <= 0) return skins.find(s => s.id === item.skinId);
        }
        return skins.find(s => s.id === caseData.items[0].skinId);
    }

    openCase(caseId) {
        console.log('openCase called with id:', caseId);
        
        if (!auth.isAuthenticated()) {
            auth.showAuthModal();
            return;
        }
        
        const caseData = cases.find(c => c.id === caseId);
        if (!caseData) return;
        
        if (gameState.balance < caseData.price) {
            this.showNotification('Недостаточно средств!', 'error');
            return;
        }

        gameState.balance -= caseData.price;
        gameState.notifyBalanceUpdate();
        gameState.saveBalanceToServer(); // ← Сохраняем баланс
        
        gameState.initAudio();

        const overlay = document.getElementById('caseOpenOverlay');
        const itemsContainer = document.getElementById('rouletteItems');
        const closeBtn = document.getElementById('caseCloseBtn');
        const title = document.getElementById('caseOpenTitle');
        
        if (!overlay || !itemsContainer || !closeBtn || !title) return;
        
        overlay.classList.add('active');
        closeBtn.style.display = 'none';
        title.textContent = `Открытие: ${caseData.name}`;

        const wonSkin = this.getRandomItemFromCase(caseData);
        this.lastWonSkin = wonSkin; // ← Сохраняем выигранный скин
        
        const totalItems = 60;
        const winPosition = 50;
        const itemWidth = 180;
        
        let html = '';
        for (let i = 0; i < totalItems; i++) {
            let skin;
            if (i === winPosition) {
                skin = wonSkin;
            } else {
                const randomItem = caseData.items[Math.floor(Math.random() * caseData.items.length)];
                skin = skins.find(s => s.id === randomItem.skinId);
            }
            html += `
                <div class="roulette-item" style="border-top: 3px solid ${rarityColors[skin.rarity] || '#fff'}">
                    ${skin.image ? `<img src="${skin.image}" alt="${skin.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><span class="roulette-item-icon" style="display:none">${skin.icon}</span>` : `<span class="roulette-item-icon">${skin.icon || '🔫'}</span>`}
                    <div class="roulette-item-name">${skin.name}</div>
                    <div class="roulette-item-price">${skin.price.toFixed(2)} ₽</div>
                </div>
            `;
        }
        itemsContainer.innerHTML = html;
        itemsContainer.style.transition = 'none';
        itemsContainer.style.transform = 'translateX(0)';

        setTimeout(() => {
            const containerWidth = document.querySelector('.roulette-container').offsetWidth;
            const offset = -(winPosition * itemWidth) + (containerWidth / 2) - (itemWidth / 2);
            const randomWithin = (Math.random() - 0.5) * (itemWidth * 0.6);
            
            itemsContainer.style.transition = 'transform 6s cubic-bezier(0.15, 0.85, 0.35, 1)';
            itemsContainer.style.transform = `translateX(${offset + randomWithin}px)`;

            let tickInterval = setInterval(() => gameState.playCaseTick(), 100);
            setTimeout(() => { clearInterval(tickInterval); tickInterval = setInterval(() => gameState.playCaseTick(), 200); }, 2000);
            setTimeout(() => { clearInterval(tickInterval); tickInterval = setInterval(() => gameState.playCaseTick(), 400); }, 4000);
            setTimeout(() => { clearInterval(tickInterval); }, 5500);

            setTimeout(() => {
                gameState.playCaseWin();
                title.textContent = `Выпало: ${wonSkin.name}!`;
                
                // Добавляем скин в инвентарь
                const item = { ...wonSkin, uniqueId: Date.now() + Math.random() };
                if (!gameState.inventory) {
                    gameState.inventory = [];
                }
                gameState.inventory.push(item);
                gameState.saveInventoryToServer(); // ← Сохраняем инвентарь
                
                // Показываем обе кнопки: Забрать и Продать
                closeBtn.style.display = 'inline-block';
                closeBtn.innerHTML = 'ЗАБРАТЬ';
                
                // Создаем кнопку "Продать" если её нет
                let sellBtn = document.getElementById('caseSellBtn');
                if (!sellBtn) {
                    sellBtn = document.createElement('button');
                    sellBtn.id = 'caseSellBtn';
                    sellBtn.className = 'case-sell-btn';
                    sellBtn.onclick = () => window.casesModule.sellLastSkin();
                    closeBtn.parentNode.insertBefore(sellBtn, closeBtn.nextSibling);
                }
                sellBtn.style.display = 'inline-block';
                sellBtn.textContent = `ПРОДАТЬ ЗА ${wonSkin.price.toFixed(2)} ₽`;
                
                if (window.shopModule) {
                    window.shopModule.renderInventory();
                }
                
                console.log('Won skin:', wonSkin.name);
            }, 6200);
        }, 100);
    }

    // ПРОДАТЬ ПОСЛЕДНИЙ ВЫИГРАННЫЙ СКИН
    async sellLastSkin() {
        if (!this.lastWonSkin) return;
        
        // Находим скин в инвентаре
        const skinInInventory = gameState.inventory.find(s => 
            s.id === this.lastWonSkin.id && s.name === this.lastWonSkin.name
        );
        
        if (skinInInventory) {
            const soldSkin = await gameState.sellSkinViaAPI(skinInInventory.uniqueId);
            
            if (soldSkin) {
                this.showNotification(`Продан: ${soldSkin.name} за ${soldSkin.price.toFixed(2)} ₽`, 'success');
                
                // Скрываем кнопки
                const closeBtn = document.getElementById('caseCloseBtn');
                const sellBtn = document.getElementById('caseSellBtn');
                if (closeBtn) closeBtn.style.display = 'none';
                if (sellBtn) sellBtn.style.display = 'none';
                
                // Закрываем оверлей через секунду
                setTimeout(() => {
                    this.closeCaseOpen();
                }, 1000);
                
                if (window.shopModule) {
                    window.shopModule.renderInventory();
                }
            }
        }
    }

    closeCaseOpen() {
        const overlay = document.getElementById('caseOpenOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        this.lastWonSkin = null;
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

export const casesModule = new CasesModule();

if (typeof window !== 'undefined') {
    window.casesModule = casesModule;
}