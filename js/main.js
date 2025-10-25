// Arquivo principal que inicializa a aplicação
import { Router } from './router.js';
import { TemplateEngine } from './templateEngine.js';
import { FormValidator } from './formValidator.js';

// Configuração das rotas
const routes = {
    '/': {
        template: 'templates/home.html',
        title: 'EloSocial - Início',
        script: () => {
            initializeModals();
        }
    },
    '/projetos': {
        template: 'templates/projetos.html',
        title: 'EloSocial - Projetos',
        script: () => {
            initializeFilters();
        }
    },
    '/cadastro': {
        template: 'templates/cadastro.html',
        title: 'EloSocial - Cadastro',
        script: () => {
            const form = document.getElementById('cadastroForm');
            if (form) {
                // Inicializa validação
                const validator = new FormValidator(form);

                // Adiciona listeners para formatação em tempo real nos novos ids
                const cpfInput = form.querySelector('#cadastro-cpf');
                const telefoneInput = form.querySelector('#cadastro-telefone');
                const cepInput = form.querySelector('#cadastro-cep');

                if (cpfInput) {
                    cpfInput.addEventListener('input', (e) => {
                        e.target.value = validator.formatCPF(e.target.value);
                    });
                }

                if (telefoneInput) {
                    telefoneInput.addEventListener('input', (e) => {
                        e.target.value = validator.formatTelefone(e.target.value);
                    });
                }

                if (cepInput) {
                    cepInput.addEventListener('input', (e) => {
                        e.target.value = validator.formatCEP(e.target.value);
                    });
                }
            }
        }
    },
    '/404': {
        template: 'templates/404.html',
        title: 'Página não encontrada'
    }
};

// Inicializar router
const router = new Router(routes);

// Funções de inicialização
function initializeModals() {
    // Código do modal já existente
    if (!sessionStorage.getItem('modalVisto')) {
        const modal = document.getElementById('modal-exemplo');
        modal.style.display = 'flex';
        sessionStorage.setItem('modalVisto', '1');

        // Acessibilidade: trap de foco e fechar com ESC
        const focusable = modal.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        first && first.focus();
        const handleKey = (e) => {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                document.removeEventListener('keydown', handleKey);
                return;
            }
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener('keydown', handleKey);
    }
}

function initializeFilters() {
    const filters = document.querySelectorAll('.filtro-container select');
    filters.forEach(filter => {
        filter.addEventListener('change', updateProjects);
    });
    // Inicializa as animações das métricas
    initializeMetricas();
    // Inicializa o carrossel de depoimentos
    initializeDepoimentos();
}

function initializeDepoimentos() {
    const container = document.querySelector('.depoimentos-container');
    const cards = document.querySelectorAll('.depoimento-card');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    const dotsContainer = document.querySelector('.depoimentos-dots');

    // Só inicializa se todos os elementos necessários existirem
    if (!container || !cards.length || !prevBtn || !nextBtn || !dotsContainer) {
        return;
    }

    let currentIndex = 0;

    // Criar dots para navegação
    cards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Atualizar estado dos botões
    function updateButtons() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === cards.length - 1;
    }

    // Atualizar dots ativos
    function updateDots() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Ir para um slide específico
    function goToSlide(index) {
        currentIndex = index;
        const offset = -100 * currentIndex;
        container.style.transform = `translateX(${offset}%)`;
        updateButtons();
        updateDots();
    }

    // Event listeners para os botões
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            goToSlide(currentIndex + 1);
        }
    });

    // Inicializar estado dos botões
    updateButtons();

    // Autoplay opcional
    let autoplayInterval = setInterval(() => {
        if (currentIndex < cards.length - 1) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0);
        }
    }, 5000);

    // Parar autoplay quando o usuário interagir
    const slider = document.querySelector('.depoimentos-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        slider.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(() => {
                if (currentIndex < cards.length - 1) {
                    goToSlide(currentIndex + 1);
                } else {
                    goToSlide(0);
                }
            }, 5000);
        });
    }
}

function initializeMetricas() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Inicia a animação quando a seção é visível
                document.querySelectorAll('.numero-impacto').forEach(numero => {
                    animateNumber(numero);
                });
                // Observa apenas uma vez
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observa a seção de métricas
    const metricasSection = document.querySelector('.metricas-impacto');
    if (metricasSection) {
        observer.observe(metricasSection);
    }
}

function animateNumber(element) {
    const valor = parseInt(element.dataset.valor);
    const duracao = 2000; // 2 segundos
    const passos = 50;
    const incremento = valor / passos;
    let atual = 0;
    let contador = 0;

    const timer = setInterval(() => {
        contador++;
        atual = Math.ceil(incremento * contador);
        
        if (contador >= passos || atual >= valor) {
            element.textContent = valor.toLocaleString('pt-BR');
            clearInterval(timer);
        } else {
            element.textContent = atual.toLocaleString('pt-BR');
        }
    }, duracao / passos);
}

function updateProjects() {
    const categoria = document.getElementById('categoria').value;
    const estado = document.getElementById('estado').value;
    const publico = document.getElementById('publico').value;
    const status = document.getElementById('status').value;
    
    // Filtrar projetos
    document.querySelectorAll('.project-card').forEach(card => {
        const matchCategoria = !categoria || card.dataset.categoria === categoria;
        const matchEstado = !estado || card.dataset.estado === estado;
        const matchPublico = !publico || card.dataset.publico === publico;
        const matchStatus = !status || card.dataset.status === status;
        
        const shouldShow = matchCategoria && matchEstado && matchPublico && matchStatus;
        
        // Animação suave para mostrar/esconder cards
        if (shouldShow) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });

    // Atualizar contador de resultados
    const visibleProjects = document.querySelectorAll('.project-card[style*="display: block"]').length;
    updateResultsCount(visibleProjects);
}

function updateResultsCount(count) {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'resultados-count';
    resultDiv.textContent = `${count} projeto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    
    const existingCount = document.querySelector('.resultados-count');
    if (existingCount) {
        existingCount.replaceWith(resultDiv);
    } else {
        document.querySelector('.filtro-container').after(resultDiv);
    }
}

// Adicionar interatividade às tags
document.querySelectorAll('.filtro-tags .tag').forEach(tag => {
    tag.addEventListener('click', function() {
        document.querySelectorAll('.filtro-tags .tag').forEach(t => t.classList.remove('ativo'));
        this.classList.add('ativo');
        
        // Resetar outros filtros
        document.querySelectorAll('.filtro-container select').forEach(select => {
            select.value = '';
        });
        
        // Aplicar filtro específico baseado na tag
        const tagValue = this.textContent.toLowerCase();
        if (tagValue === 'todos') {
            updateProjects();
        } else if (tagValue === 'urgentes') {
            document.getElementById('status').value = 'urgente';
            updateProjects();
        } else if (tagValue === 'recentes') {
            // Filtrar por data (assumindo que temos um atributo data-data nos cards)
            filterByDate();
        } else if (tagValue === 'mais populares') {
            // Filtrar por popularidade (assumindo que temos um atributo data-popularidade nos cards)
            filterByPopularity();
        } else if (tagValue === 'precisa de voluntários') {
            document.getElementById('status').value = 'ativo';
            updateProjects();
        }
    });
});

// ==============================
// Acessibilidade e Preferências
// ==============================
function initAccessibility() {
    const root = document.documentElement;
    // Restaurar preferências salvas
    const savedTheme = localStorage.getItem('elosocial:theme') || 'light';
    const savedContrast = localStorage.getItem('elosocial:contrast') === 'on';

    root.classList.toggle('theme-dark', savedTheme === 'dark');
    root.classList.toggle('high-contrast', !!savedContrast);

    // Ajustar estado visual dos botões
    document.querySelectorAll('.toggle-theme').forEach(btn => {
        btn.setAttribute('aria-pressed', String(savedTheme === 'dark'));
        btn.textContent = savedTheme === 'dark' ? 'Modo claro' : 'Modo escuro';
        btn.addEventListener('click', () => {
            const isDark = root.classList.toggle('theme-dark');
            localStorage.setItem('elosocial:theme', isDark ? 'dark' : 'light');
            document.querySelectorAll('.toggle-theme').forEach(b => {
                b.setAttribute('aria-pressed', String(isDark));
                b.textContent = isDark ? 'Modo claro' : 'Modo escuro';
            });
        });
    });

    document.querySelectorAll('.toggle-contrast').forEach(btn => {
        btn.setAttribute('aria-pressed', String(!!savedContrast));
        btn.addEventListener('click', () => {
            const active = root.classList.toggle('high-contrast');
            localStorage.setItem('elosocial:contrast', active ? 'on' : 'off');
            document.querySelectorAll('.toggle-contrast').forEach(b => b.setAttribute('aria-pressed', String(active)));
        });
    });

    // Menu hambúrguer: suporte a teclado e ARIA expanded
    const checkbox = document.getElementById('menu-toggle');
    const label = document.querySelector('label.menu-hamburguer');
    if (checkbox && label) {
        const syncExpanded = () => label.setAttribute('aria-expanded', String(checkbox.checked));
        checkbox.addEventListener('change', syncExpanded);
        syncExpanded();

        label.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    }
}

// Expor inicializador global para o roteador chamar após cada troca de rota
window.__initA11y = initAccessibility;