document.addEventListener('DOMContentLoaded', () => {
    
    // Load saved settings and update display
    const savedUsername = localStorage.getItem('username');
    const savedBalanceYen = localStorage.getItem('balanceYen');
    const savedBalanceUsd = localStorage.getItem('balanceUsd');

    
    if (savedUsername) {
        const usernameEl = document.querySelector('.username');
        if (usernameEl) usernameEl.textContent = savedUsername;
    }
    
    if (savedBalanceYen && savedBalanceUsd) {
        const balanceEl = document.querySelector('.balance');
        if (balanceEl) {
            balanceEl.innerHTML = `¥${savedBalanceYen} <span>($${savedBalanceUsd})</span>`;
        }
    }
    
    // Menu items click handlers
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', (e) => {
            const label = item.querySelector('span').textContent.trim();
            
            // My Parcels ya tiene href, no necesita handler
            if (label === 'My Parcels') {
                return; // Deja que el <a> funcione normalmente
            }
            
            if (label === 'Setting') {
                window.location.href = 'settings.html';
            } else {
                // Todos los demás van a la página de error
                window.location.href = 'error.html';
            }
        });
    });
    
    // Recharge and Refund buttons
    const rechargeBtn = document.querySelector('.btn-recharge');
    const refundBtn = document.querySelector('.btn-refund');
    
    if (rechargeBtn) {
        rechargeBtn.addEventListener('click', () => {
            window.location.href = 'error.html';
        });
    }
    
    if (refundBtn) {
        refundBtn.addEventListener('click', () => {
            window.location.href = 'error.html';
        });
    }
    
    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            alert('Logged out successfully!');
            window.location.reload();
        });
    }
    
    // Amount buttons selection
    const amountBtns = document.querySelectorAll('.amount-btn');
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active-amount'));
            btn.classList.add('active-amount');
        });
    });
    
    // Bottom nav items
    const navItems = document.querySelectorAll('.nav-item:not(.active-nav)');
    navItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            window.location.href = 'error.html';
        });
    });
});