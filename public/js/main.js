import { auth } from './auth.js';
import { upgradeModule } from './upgrade.js';
import { shopModule } from './shop.js';
import { casesModule } from './cases.js';
import { gameState } from './state.js';

class MainModule {
    constructor() {
        this.upgradeModule = upgradeModule;
        this.shopModule = shopModule;
        this.casesModule = casesModule;
    }

    async init() {
        // Делаем модули доступными глобально
        window.upgradeModule = this.upgradeModule;
        window.shopModule = this.shopModule;
        window.casesModule = this.casesModule;
        window.gameState = gameState;

        // Загружаем данные пользователя
        const user = await auth.loadUser();
        await gameState.loadUserData(user);

        // Рендерим шапку
        this.renderHeader();

        // Инициализация модулей
        this.upgradeModule.init();
        this.shopModule.init();
        this.casesModule.init();

        // Глобальные функции
        window.startUpgrade = () => this.upgradeModule.startUpgrade();
        window.closeResult = () => document.getElementById('resultModal').classList.remove('active');
        window.closeCaseOpen = () => this.casesModule.closeCaseOpen();
        window.addBalance = () => this.addBalance();

        console.log('🚀 Все модули загружены!');
        console.log(' Пользователь:', user ? user.username : 'Гость');
    }

    renderHeader() {
        const balanceSection = document.getElementById('balanceSection');
        
        if (auth.isAuthenticated() && gameState.isUserLoaded) {
            balanceSection.innerHTML = `
                <div class="balance-display">
                    <span class="balance-icon"></span>
                    <div>
                        <div class="balance-label">Баланс</div>
                        <div class="balance-amount"><span id="balance">${gameState.balance.toLocaleString()}</span><span class="balance-currency">₽</span></div>
                    </div>
                </div>
                <button class="add-balance-btn" onclick="addBalance()">
                    <span>+</span>
                    Пополнить
                </button>
                <div class="profile-dropdown">
                    <button class="profile-btn" onclick="toggleProfileDropdown()">
                        <span>👤</span>
                        ${auth.user.username}
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="dropdown-menu" id="profileDropdownMenu">
                        <a href="/profile" class="dropdown-item">
                            <span>👤</span> Профиль
                        </a>
                        <button class="dropdown-item logout-btn" onclick="logout()">
                            <span>🚪</span> Выйти
                        </button>
                    </div>
                </div>
            `;
        } else {
            balanceSection.innerHTML = `
                <a href="/login" class="login-header-btn">Войти</a>
                <a href="/register" class="register-header-btn">Регистрация</a>
            `;
        }
    }

    addBalance() {
        if (!gameState.checkAuth()) return;
        
        const amount = prompt('Введите сумму для пополнения:', '10000');
        if (amount && !isNaN(amount) && amount > 0) {
            gameState.updateBalance(parseFloat(amount));
            this.shopModule.showNotification('Баланс пополнен!', 'success');
        }
    }
}

window.toggleProfileDropdown = () => {
    const menu = document.getElementById('profileDropdownMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
};

document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.profile-dropdown');
    const menu = document.getElementById('profileDropdownMenu');
    
    if (dropdown && menu && !dropdown.contains(e.target)) {
        menu.classList.remove('active');
    }
});

window.logout = () => {
    auth.logout();
};

document.addEventListener('DOMContentLoaded', () => {
    const main = new MainModule();
    main.init();
});