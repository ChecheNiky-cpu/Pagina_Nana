// ===== CARGAR DESDE CONFIGURACIÓN =====
// Este script ahora lee los datos desde config.js

// ===== MODO CLARO/OSCURO =====

// Cargar preferencia de tema guardada
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
}

// Actualizar ícono del botón de tema
function updateThemeIcon(isDark) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = isDark ? '☀️' : '🌙';
    }
}

// Alternar tema
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');

    // Guardar preferencia
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Actualizar ícono
    updateThemeIcon(isDark);

    // Animación suave
    body.style.transition = 'background 0.3s ease';
}

// Inicializar botón de tema
function initThemeToggle() {
    const themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    }
}

// ===== FUNCIONES DE INICIALIZACIÓN =====

// Cargar datos del perfil desde config
function loadProfile() {
    if (typeof config === 'undefined') {
        console.warn('⚠️ config.js no está cargado. Usando datos del HTML.');
        return;
    }

    document.querySelector('h1').textContent = config.profile.name;

    // Cargar imagen de perfil
    const profileImg = document.querySelector('.profile-img');
    if (config.profile.image) {
        profileImg.innerHTML = `<img src="${config.profile.image}" alt="${config.profile.name}">`;
    } else if (config.profile.emoji) {
        profileImg.textContent = config.profile.emoji;
    }

    const bioElement = document.querySelector('.bio');
    bioElement.innerHTML = `${config.profile.bio}<br>${config.profile.subtitle}`;
}

// Cargar tecnologías desde config
function loadTechnologies() {
    if (typeof config === 'undefined') return;

    const tagsContainer = document.querySelector('.tags');
    tagsContainer.innerHTML = '';

    config.technologies.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = tech;
        tagsContainer.appendChild(tag);
    });
}

// Cargar enlaces principales desde config
function loadMainLinks() {
    if (typeof config === 'undefined') return;

    const linksContainer = document.querySelector('.links');
    linksContainer.innerHTML = '';

    config.links.forEach(link => {
        const linkButton = document.createElement('a');
        linkButton.href = link.url;
        linkButton.className = 'link-button';
        linkButton.innerHTML = `
            <span class="link-icon">${link.icon}</span>
            <span class="link-text">
                ${link.title}
                <span class="link-subtitle">${link.subtitle}</span>
            </span>
        `;
        linksContainer.appendChild(linkButton);
    });
}

// Cargar redes sociales desde config
function loadSocialLinks() {
    if (typeof config === 'undefined') return;

    const socialContainer = document.querySelector('.social-links');
    socialContainer.innerHTML = '';

    config.socialLinks.forEach(social => {
        const socialIcon = document.createElement('a');
        socialIcon.href = social.url;
        socialIcon.className = 'social-icon';
        socialIcon.title = social.platform;
        socialIcon.textContent = social.icon;
        socialContainer.appendChild(socialIcon);
    });
}

// ===== ANALÍTICAS Y EVENTOS =====

// Rastrear clics en enlaces (útil para Google Analytics)
function trackLinkClick(linkTitle) {
    console.log(`Click en: ${linkTitle}`);
    // Aquí puedes agregar código de Google Analytics o similar
    // Ejemplo: gtag('event', 'click', { event_category: 'link', event_label: linkTitle });
}

// Agregar eventos de clic
function addClickTracking() {
    document.querySelectorAll('.link-button').forEach(button => {
        button.addEventListener('click', function (e) {
            const linkTitle = this.querySelector('.link-text').textContent.trim().split('\n')[0];
            trackLinkClick(linkTitle);
        });
    });
}

// ===== ANIMACIONES ADICIONALES =====

// Animación de entrada para los enlaces
function animateLinks() {
    const linkButtons = document.querySelectorAll('.link-button');
    linkButtons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';

        setTimeout(() => {
            button.style.transition = 'all 0.5s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// ===== INICIALIZACIÓN =====

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Cargar tema guardado PRIMERO (para evitar flash)
    loadThemePreference();

    // Inicializar botón de tema
    initThemeToggle();

    // Cargar configuración desde config.js
    loadProfile();
    loadTechnologies();
    loadMainLinks();
    loadSocialLinks();

    // Agregar tracking de clics
    addClickTracking();

    // Agregar animaciones
    animateLinks();

    console.log('✅ Link-in-Bio cargado correctamente');
});

// ===== FUNCIONES DE UTILIDAD =====

// Función para actualizar un enlace específico
function updateLink(index, newData) {
    if (typeof config === 'undefined') return;
    config.links[index] = { ...config.links[index], ...newData };
    loadMainLinks();
    addClickTracking();
}

// Función para agregar una nueva tecnología
function addTechnology(techName) {
    if (typeof config === 'undefined') return;
    if (!config.technologies.includes(techName)) {
        config.technologies.push(techName);
        loadTechnologies();
    }
}

// Exportar funciones para uso externo (si lo necesitas)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateLink,
        addTechnology,
        profileData,
        links,
        socialLinks
    };
}