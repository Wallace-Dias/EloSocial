// Sistema de SPA básico
export class Router {
    constructor(routes) {
        this.routes = routes;
        this.container = document.getElementById('app');
        this.currentPage = '';
        this.useHash = true; // Usa hash routing para compatibilidade com GitHub Pages

        // Converter URLs .html para rotas limpas
        this.normalizeRoute = (path) => {
            if (path === '/' || path === '/index.html') return '/';
            return path.replace('.html', '');
        };

        // Inicialização e handling de hash
        document.addEventListener('DOMContentLoaded', () => {
            // Em hash mode, sempre garante um hash padrão
            if (this.useHash && (!window.location.hash || window.location.hash === '#')) {
                window.location.hash = '/';
            }
            this.handleRoute();
            this.setupNavigation();
            // Reage à troca de hash
            window.addEventListener('hashchange', () => this.handleRoute());
        });
    }

    setupNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href.includes(window.location.origin)) {
                e.preventDefault();
                // Deriva a rota a partir do href (robusto a subcaminhos do GitHub Pages)
                const href = link.getAttribute('href') || '';
                const path = this.hrefToRoute(href);
                if (path !== this.currentPage) {
                    if (this.useHash) {
                        window.location.hash = path; // Ex.: #/projetos
                    } else {
                        history.pushState(null, '', path);
                        this.handleRoute();
                    }
                }
            }
        });
    }

    hrefToRoute(href) {
        // Links absolutos com hash já rotas
        if (href.startsWith('#/')) return href.slice(1);
        // Placeholder '#' não deve navegar
        if (href === '#' || href === '') return this.currentPage || '/';
        // Home
        if (href === '/' || href === 'index.html' || href.endsWith('/index.html')) return '/';
        // Arquivos .html -> /nome
        if (href.endsWith('.html')) {
            const file = href.split('/').pop();
            const name = file.replace('.html','');
            return name === 'index' ? '/' : `/${name}`;
        }
        // Caminhos simples -> prefixa com /
        if (!href.startsWith('/')) return `/${href}`;
        return href;
    }

    async handleRoute() {
        // Prioriza hash quando ativo
        let path = '/';
        if (this.useHash) {
            const hash = window.location.hash || '';
            if (hash.startsWith('#/')) {
                path = hash.slice(1); // remove '#'
            } else {
                path = '/';
            }
        } else {
            path = this.normalizeRoute(window.location.pathname);
        }
        if (this.currentPage === path) return;
        
        this.currentPage = path;
        const route = this.routes[path] || this.routes['/404'];
        
        try {
            const response = await fetch(route.template);
            if (!response.ok) throw new Error(`Template não encontrado: ${route.template}`);
            
            const html = await response.text();
            this.container.innerHTML = html;
            document.title = route.title;
            
            // Executar script específico da página
            if (route.script) {
                route.script();
            }
            // Inicialização global (acessibilidade, temas, etc.)
            if (typeof window !== 'undefined' && typeof window.__initA11y === 'function') {
                try { window.__initA11y(); } catch (e) { console.warn('Falha ao inicializar acessibilidade', e); }
            }
            
            // Restaurar estado do menu mobile
            const menuToggle = document.getElementById('menu-toggle');
            if (menuToggle) {
                menuToggle.checked = false;
            }

            // Rolar para o topo da página
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Erro ao carregar página:', error);
            this.container.innerHTML = '<h1>Erro ao carregar página</h1>';
        }
    }
}