// Bottom Navigation Component
// This component creates a reusable bottom navigation bar

class BottomNav extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const activePage = this.getAttribute('active') || 'home';
        this.innerHTML = this.render(activePage);
    }

    render(activePage) {
        const navItems = [
            { id: 'home', href: 'index.html', icon: 'iconos-menu/homeactive.svg', label: 'Home' },
            { id: 'notices', href: '#', icon: 'iconos-menu/notificationsactive.svg', label: 'Notices', badge: '0' },
            { id: 'cart', href: '#', icon: 'iconos-menu/cartactive.svg', label: 'Cart' },
            { id: 'profile', href: 'profile.html', icon: 'iconos-menu/useractive.svg', label: 'Profile' }
        ];

        const navItemsHtml = navItems.map(item => {
            const isActive = item.id === activePage;
            const tag = item.href !== '#' ? 'a' : 'div';
            const hrefAttr = item.href !== '#' ? `href="${item.href}"` : '';
            const activeClass = isActive ? ' active-nav' : '';
            const badgeHtml = item.badge ? `<div class="badge">${item.badge}</div>` : '';

            return `
                <${tag} ${hrefAttr} class="nav-item${activeClass}" style="text-decoration: none;">
                    ${badgeHtml}
                    <img src="${item.icon}" alt="${item.label}" class="nav-icon">
                    <span>${item.label}</span>
                </${tag}>
            `;
        }).join('');

        return `
            <nav class="bottom-nav">
                ${navItemsHtml}
            </nav>
        `;
    }
}

// Register the custom element
customElements.define('bottom-nav', BottomNav);
