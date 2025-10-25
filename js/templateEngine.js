// Sistema de templates
export class TemplateEngine {
    static render(templateId, data = {}) {
        const template = document.getElementById(templateId);
        if (!template) throw new Error(`Template ${templateId} não encontrado`);
        
        let html = template.innerHTML;
        
        // Substituir variáveis
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            html = html.replace(regex, data[key]);
        });
        
        return html;
    }

    static async loadAndRender(templatePath, data = {}) {
        try {
            const response = await fetch(templatePath);
            if (!response.ok) throw new Error(`Erro ao carregar template: ${response.status}`);
            const html = await response.text();
            
            // Substituir variáveis no template carregado
            let renderedHtml = html;
            Object.keys(data).forEach(key => {
                const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                renderedHtml = renderedHtml.replace(regex, data[key]);
            });
            
            return renderedHtml;
        } catch (error) {
            console.error('Erro ao carregar e renderizar template:', error);
            return '';
        }
    }
}