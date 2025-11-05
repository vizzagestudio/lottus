// ==================== MENU HAMBURGUER ( funciona em TODAS as páginas ) ====================
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const nav = document.querySelector('nav');
    
    if (!mobileMenu || !nav) return; // Se não existir, sai da função
    
    mobileMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Animação dos spans para formar um X
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            nav.classList.remove('active');
            
            // Resetar animação do hamburguer
            const spans = mobileMenu.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ========== NOVO CÓDIGO: ATIVAR LINK ATUAL NO MENU ==========
    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop();
        const menuLinks = document.querySelectorAll('nav ul li a');
        
        menuLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }

    highlightCurrentPage();
    // ========== FIM DO NOVO CÓDIGO ==========
}

// ==================== BANNER SLIDER ( só funciona na HOME ) ====================
function initBannerSlider() {
    const bannerContainer = document.querySelector('.banner');
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');
    
    if (!bannerContainer || !prev || !next) return; // Se não existir, sai da função
    
    let slides = [];
    let index = 0;
    const maxBanners = 10;

    // Função para checar se a imagem existe
    function imageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    // Carregar os banners dinamicamente
    async function loadBanners() {
        const bannerWrapper = document.createElement('div');
        bannerWrapper.id = 'banner-container';
        bannerContainer.insertBefore(bannerWrapper, bannerContainer.querySelector('.banner-controls'));

        for (let i = 1; i <= maxBanners; i++) {
            const path = `images/banner${i}.png`;
            const exists = await imageExists(path);

            if (!exists) break;

            const slide = document.createElement('div');
            slide.classList.add('banner-slide');
            if (slides.length === 0) slide.classList.add('active');

            const img = document.createElement('img');
            img.src = path;
            img.alt = `Banner ${i}`;

            slide.appendChild(img);
            bannerWrapper.appendChild(slide);
            slides.push(slide);
        }
    }

    // Exibir slide específico
    function showSlide(n) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === n);
        });
    }

    // Próximo slide
    function nextSlide() {
        if (slides.length === 0) return;
        index = (index + 1) % slides.length;
        showSlide(index);
    }

    // Slide anterior
    function prevSlide() {
        if (slides.length === 0) return;
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
    }

    // Eventos dos botões
    next.addEventListener('click', nextSlide);
    prev.addEventListener('click', prevSlide);

    // Troca automática a cada 5s
    setInterval(nextSlide, 5000);

    // Inicializa
    loadBanners();
}

// ==================== INICIALIZAR TUDO ====================
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu(); // Sempre executa (em todas as páginas)
    initBannerSlider(); // Só executa se existir banner na página

});

// esconder o .html na barra de endereço
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href.endsWith('.html')) {
        e.preventDefault();
        window.history.pushState({}, '', href.replace('.html', ''));
        window.location.href = href; // ainda abre a página normal
      }
    });
  });
});
