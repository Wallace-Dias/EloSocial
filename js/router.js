// Sistema de SPA básico
export class Router {
    constructor(routes) {
        this.routes = routes;
        this.container = document.getElementById('app');
        this.currentPage = '';

        // Converter URLs .html para rotas limpas
        this.normalizeRoute = (path) => {
            if (path === '/' || path === '/index.html') return '/';
            return path.replace('.html', '');
        };

        // Redirecionar URLs .html diretas para SPA
        document.addEventListener('DOMContentLoaded', () => {
            const directHtml = window.location.pathname.match(/^\/(\w+)\.html$/);
            if (directHtml && this.routes['/' + directHtml[1]]) {
                history.replaceState(null, '', '/' + directHtml[1]);
            }
            this.handleRoute();
            this.setupNavigation();
        });
    }

    setupNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href.includes(window.location.origin)) {
                e.preventDefault();
                const path = this.normalizeRoute(link.pathname);
                if (path !== this.currentPage) {
                    history.pushState(null, '', path);
                    this.handleRoute();
                }
            }
        });
    }

    async handleRoute() {
        const path = this.normalizeRoute(window.location.pathname);
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