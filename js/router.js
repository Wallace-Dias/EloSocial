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
            // Se acessar diretamente /rota.html, converte para hash /rota
            const directHtml = window.location.pathname.match(/^\/(\w+)\.html$/);
            if (directHtml && this.routes['/' + directHtml[1]]) {
                if (this.useHash) {
                    // Mantém path atual e só ajusta o hash
                    window.location.hash = `/${directHtml[1]}`;
                } else {
                    history.replaceState(null, '', '/' + directHtml[1]);
                }
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
                const path = this.normalizeRoute(link.pathname);
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