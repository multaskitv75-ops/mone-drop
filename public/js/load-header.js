// Загрузка единого хедера на все страницы
document.addEventListener('DOMContentLoaded', async () => {
    // Находим все элементы с классом header-container
    const headerContainers = document.querySelectorAll('.header-container');
    
    if (headerContainers.length > 0) {
        try {
            const response = await fetch('/components/header.html');
            const headerHTML = await response.text();
            
            headerContainers.forEach(container => {
                container.innerHTML = headerHTML;
            });
            
            // После загрузки хедера инициализируем выпадающее меню
            initProfileDropdown();
            
            // Обновляем данные пользователя
            if (typeof auth !== 'undefined') {
                await auth.loadUser();
            }
            
        } catch (error) {
            console.error('Ошибка загрузки хедера:', error);
        }
    }
});

// Инициализация выпадающего меню профиля
function initProfileDropdown() {
    const profileBtn = document.getElementById('profileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (profileBtn && dropdownMenu) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
            profileBtn.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                profileBtn.classList.remove('active');
            }
        });
    }
}