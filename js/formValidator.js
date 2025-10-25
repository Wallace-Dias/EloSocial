// Validação de formulários
export class FormValidator {
    constructor(formElement) {
        this.form = formElement;
        this.setupValidation();
        this.setupMasks();
    }

    setupValidation() {
        // Validar em tempo real para todos os campos
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => this.validateField(field));
            field.addEventListener('blur', () => this.validateField(field));
        });
    }

    setupMasks() {
        // Configurar máscaras para os campos especiais
        const cpfInput = this.form.querySelector('#cpf');
        const telefoneInput = this.form.querySelector('#telefone');
        const cepInput = this.form.querySelector('#cep');

        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                e.target.value = this.formatCPF(e.target.value);
            });
        }

        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                e.target.value = this.formatTelefone(e.target.value);
            });
        }

        if (cepInput) {
            cepInput.addEventListener('input', (e) => {
                e.target.value = this.formatCEP(e.target.value);
            });
        }

        // Validar no envio do formulário
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.handleSubmit();
            }
        });
    }

    formatCPF(value) {
        value = value.replace(/\D/g, '').slice(0, 11);
        
        if (value.length >= 3) {
            value = value.slice(0, 3) + '.' + value.slice(3);
        }
        if (value.length >= 7) {
            value = value.slice(0, 7) + '.' + value.slice(7);
        }
        if (value.length >= 11) {
            value = value.slice(0, 11) + '-' + value.slice(11);
        }
        
        return value;
    }

    formatTelefone(value) {
        // Remove tudo que não é número e limita a 11 dígitos
        value = value.replace(/\D/g, '').slice(0, 11);
        let formattedValue = '';
        
        if (value.length > 0) {
            // Adiciona parênteses no DDD
            formattedValue = '(' + value.slice(0, 2);
            
            if (value.length > 2) {
                // Adiciona fechamento do parênteses e espaço
                formattedValue += ') ' + value.slice(2);
                
                // Adiciona hífen na posição correta
                if (value.length > 7) {
                    // Para números com 9 dígitos
                    if (value.length > 7) {
                        formattedValue = formattedValue.slice(0, 10) + '-' + value.slice(7);
                    }
                } else if (value.length > 6) {
                    // Para números com 8 dígitos
                    formattedValue = formattedValue.slice(0, 9) + '-' + value.slice(6);
                }
            }
        }
        
        return formattedValue;
    }

    formatCEP(value) {
        value = value.replace(/\D/g, '').slice(0, 8);
        
        if (value.length >= 5) {
            value = value.slice(0, 5) + '-' + value.slice(5);
        }
        
        return value;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Remover mensagens de erro anteriores
        this.removeError(field);

        // Validações específicas por tipo
        switch (field.id) {
            case 'nome':
                if (value.length < 3) {
                    isValid = false;
                    message = 'Nome deve ter pelo menos 3 caracteres';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Email inválido';
                }
                break;

            case 'cpf':
                const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
                if (!cpfRegex.test(value)) {
                    isValid = false;
                    message = 'CPF deve estar no formato 000.000.000-00';
                }
                break;

            case 'telefone':
                const telRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
                if (value && !telRegex.test(value)) {
                    isValid = false;
                    message = 'Telefone deve estar no formato (00) 00000-0000 ou (00) 0000-0000';
                }
                break;

            case 'cep':
                const cepRegex = /^\d{5}-\d{3}$/;
                if (!cepRegex.test(value)) {
                    isValid = false;
                    message = 'CEP deve estar no formato 00000-000';
                }
                break;
        }

        // Validação de campos obrigatórios
        if (field.required && !value) {
            isValid = false;
            message = 'Este campo é obrigatório';
        }

        if (!isValid) {
            this.showError(field, message);
        }

        return isValid;
    }

    validateForm() {
        let isValid = true;
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }

    showError(field, message) {
        // Criar e exibir mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'var(--cor-erro)';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = message;

        field.classList.add('error');
        field.style.borderColor = 'var(--cor-erro)';
        field.parentNode.appendChild(errorDiv);
    }

    removeError(field) {
        // Remover mensagem de erro existente
        field.classList.remove('error');
        field.style.borderColor = '';
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    handleSubmit() {
        // Simular envio do formulário
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Salvar no localStorage
        localStorage.setItem('cadastro', JSON.stringify(data));
        
        // Exibir mensagem de sucesso
        const successMessage = document.createElement('div');
        successMessage.className = 'alerta sucesso';
        successMessage.textContent = 'Cadastro realizado com sucesso!';
        this.form.insertAdjacentElement('beforebegin', successMessage);
        
        // Limpar formulário
        this.form.reset();
        
        // Remover mensagem após 3 segundos
        setTimeout(() => successMessage.remove(), 3000);
    }
}