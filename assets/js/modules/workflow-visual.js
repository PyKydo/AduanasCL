// Módulo de Workflow Visual
class WorkflowVisual {
    constructor() {
        this.currentWorkflow = 'menores';
        this.isRunning = false;
        this.currentStep = 0;
        this.workflows = {
            menores: this.getWorkflowMenores(),
            vehiculos: this.getWorkflowVehiculos(),
            sag: this.getWorkflowSAG(),
            pdi: this.getWorkflowPDI()
        };
        
        this.metrics = {
            totalProcessed: 0,
            successCount: 0,
            errorCount: 0,
            totalTime: 0
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderWorkflow();
        this.updateMetrics();
        this.loadConfiguration();
    }

    setupEventListeners() {
        console.log('Configurando event listeners...');
        
        // Botones de workflow
        const workflowBtns = document.querySelectorAll('.workflow-btn');
        if (workflowBtns.length > 0) {
            workflowBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.workflow-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.currentWorkflow = btn.dataset.workflow;
                    this.renderWorkflow();
                    this.resetWorkflow();
                });
            });
            console.log('Event listeners de workflow configurados');
        } else {
            console.warn('No se encontraron botones de workflow');
        }

        // Controles de workflow
        const btnPlay = document.getElementById('btnPlay');
        if (btnPlay) {
            btnPlay.addEventListener('click', () => {
                console.log('Botón Ejecutar clickeado');
                this.startWorkflow();
            });
        } else {
            console.error('No se encontró el botón btnPlay');
        }

        const btnPause = document.getElementById('btnPause');
        if (btnPause) {
            btnPause.addEventListener('click', () => {
                this.pauseWorkflow();
            });
        } else {
            console.error('No se encontró el botón btnPause');
        }

        const btnReset = document.getElementById('btnReset');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                this.resetWorkflow();
            });
        } else {
            console.error('No se encontró el botón btnReset');
        }

        // Configuración
        const btnToggleConfig = document.getElementById('btnToggleConfig');
        if (btnToggleConfig) {
            btnToggleConfig.addEventListener('click', () => {
                this.toggleConfiguration();
            });
        } else {
            console.error('No se encontró el botón btnToggleConfig');
        }

        // Limpiar logs
        const btnClearLogs = document.getElementById('btnClearLogs');
        if (btnClearLogs) {
            btnClearLogs.addEventListener('click', () => {
                this.clearLogs();
            });
        } else {
            console.error('No se encontró el botón btnClearLogs');
        }

        // Configuración automática
        const configInputs = document.querySelectorAll('#configContent input');
        if (configInputs.length > 0) {
            configInputs.forEach(input => {
                input.addEventListener('change', () => {
                    this.saveConfiguration();
                });
            });
        } else {
            console.warn('No se encontraron inputs de configuración');
        }
        
        console.log('Event listeners configurados completamente');
    }

    getWorkflowMenores() {
        return {
            title: 'Workflow de Gestión de Menores',
            steps: [
                {
                    id: 'inicio',
                    name: 'Inicio',
                    description: 'Recepción de solicitud',
                    icon: 'input',
                    status: 'pending'
                },
                {
                    id: 'validacion-datos',
                    name: 'Validación de Datos',
                    description: 'Verificación de información del menor',
                    icon: 'verified',
                    status: 'pending'
                },
                {
                    id: 'validacion-documentos',
                    name: 'Validación de Documentos',
                    description: 'Revisión de autorizaciones',
                    icon: 'description',
                    status: 'pending'
                },
                {
                    id: 'verificacion-edad',
                    name: 'Verificación de Edad',
                    description: 'Confirmación de edad del menor',
                    icon: 'child_care',
                    status: 'pending'
                },
                {
                    id: 'consulta-sistemas',
                    name: 'Consulta a Sistemas',
                    description: 'Verificación en bases de datos',
                    icon: 'search',
                    status: 'pending'
                },
                {
                    id: 'decision',
                    name: 'Decisión',
                    description: 'Evaluación final y decisión',
                    icon: 'gavel',
                    status: 'pending'
                },
                {
                    id: 'finalizacion',
                    name: 'Finalización',
                    description: 'Generación de autorización',
                    icon: 'check_circle',
                    status: 'pending'
                }
            ]
        };
    }

    getWorkflowVehiculos() {
        return {
            title: 'Workflow de Gestión de Vehículos',
            steps: [
                {
                    id: 'inicio',
                    name: 'Inicio',
                    description: 'Recepción de solicitud vehicular',
                    icon: 'directions_car',
                    status: 'pending'
                },
                {
                    id: 'validacion-patente',
                    name: 'Validación de Patente',
                    description: 'Verificación de patente',
                    icon: 'verified',
                    status: 'pending'
                },
                {
                    id: 'validacion-documentos',
                    name: 'Validación de Documentos',
                    description: 'Revisión de documentación',
                    icon: 'description',
                    status: 'pending'
                },
                {
                    id: 'verificacion-permisos',
                    name: 'Verificación de Permisos',
                    description: 'Control de permisos temporales',
                    icon: 'schedule',
                    status: 'pending'
                },
                {
                    id: 'consulta-sistemas',
                    name: 'Consulta a Sistemas',
                    description: 'Verificación en registros',
                    icon: 'search',
                    status: 'pending'
                },
                {
                    id: 'decision',
                    name: 'Decisión',
                    description: 'Evaluación final',
                    icon: 'gavel',
                    status: 'pending'
                },
                {
                    id: 'finalizacion',
                    name: 'Finalización',
                    description: 'Generación de autorización',
                    icon: 'check_circle',
                    status: 'pending'
                }
            ]
        };
    }

    getWorkflowSAG() {
        return {
            title: 'Workflow de Integración SAG',
            steps: [
                {
                    id: 'inicio',
                    name: 'Inicio',
                    description: 'Recepción de declaración',
                    icon: 'agriculture',
                    status: 'pending'
                },
                {
                    id: 'validacion-producto',
                    name: 'Validación de Producto',
                    description: 'Verificación de tipo de producto',
                    icon: 'verified',
                    status: 'pending'
                },
                {
                    id: 'consulta-sag',
                    name: 'Consulta SAG',
                    description: 'Verificación en sistema SAG',
                    icon: 'search',
                    status: 'pending'
                },
                {
                    id: 'validacion-sanitaria',
                    name: 'Validación Sanitaria',
                    description: 'Revisión de requisitos sanitarios',
                    icon: 'health_and_safety',
                    status: 'pending'
                },
                {
                    id: 'decision',
                    name: 'Decisión',
                    description: 'Evaluación final SAG',
                    icon: 'gavel',
                    status: 'pending'
                },
                {
                    id: 'finalizacion',
                    name: 'Finalización',
                    description: 'Generación de certificado',
                    icon: 'check_circle',
                    status: 'pending'
                }
            ]
        };
    }

    getWorkflowPDI() {
        return {
            title: 'Workflow de Integración PDI',
            steps: [
                {
                    id: 'inicio',
                    name: 'Inicio',
                    description: 'Recepción de solicitud',
                    icon: 'security',
                    status: 'pending'
                },
                {
                    id: 'verificacion-identidad',
                    name: 'Verificación de Identidad',
                    description: 'Validación de identidad',
                    icon: 'verified',
                    status: 'pending'
                },
                {
                    id: 'consulta-antecedentes',
                    name: 'Consulta de Antecedentes',
                    description: 'Verificación de antecedentes',
                    icon: 'search',
                    status: 'pending'
                },
                {
                    id: 'validacion-seguridad',
                    name: 'Validación de Seguridad',
                    description: 'Revisión de seguridad',
                    icon: 'security',
                    status: 'pending'
                },
                {
                    id: 'decision',
                    name: 'Decisión',
                    description: 'Evaluación final PDI',
                    icon: 'gavel',
                    status: 'pending'
                },
                {
                    id: 'finalizacion',
                    name: 'Finalización',
                    description: 'Generación de autorización',
                    icon: 'check_circle',
                    status: 'pending'
                }
            ]
        };
    }

    renderWorkflow() {
        const workflow = this.workflows[this.currentWorkflow];
        const diagram = document.getElementById('workflowDiagram');
        const title = document.getElementById('workflowTitle');
        
        title.textContent = workflow.title;
        
        diagram.innerHTML = `
            <div class="workflow-steps">
                ${workflow.steps.map((step, index) => `
                    <div class="workflow-step ${step.status}" data-step="${index}">
                        <div class="step-icon">
                            <span class="material-symbols-outlined">${step.icon}</span>
                        </div>
                        <div class="step-content">
                            <h4>${step.name}</h4>
                            <p>${step.description}</p>
                        </div>
                        <div class="step-arrow">
                            ${index < workflow.steps.length - 1 ? '<span class="material-symbols-outlined">arrow_forward</span>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    updateButtonStates() {
        const btnPlay = document.getElementById('btnPlay');
        const btnPause = document.getElementById('btnPause');
        const btnReset = document.getElementById('btnReset');
        
        if (this.isRunning) {
            btnPlay.disabled = true;
            btnPause.disabled = false;
            btnReset.disabled = true;
        } else {
            btnPlay.disabled = false;
            btnPause.disabled = true;
            btnReset.disabled = false;
        }
    }

    async startWorkflow() {
        console.log('startWorkflow() llamado');
        console.log('isRunning:', this.isRunning);
        console.log('currentWorkflow:', this.currentWorkflow);
        
        if (this.isRunning) {
            console.log('Workflow ya está ejecutándose, retornando');
            return;
        }
        
        console.log('Iniciando workflow...');
        this.isRunning = true;
        this.currentStep = 0;
        this.startTime = Date.now();
        this.resetWorkflow();
        this.updateButtonStates();
        
        const workflow = this.workflows[this.currentWorkflow];
        console.log('Workflow seleccionado:', workflow);
        
        const stepDelay = parseInt(document.getElementById('stepDelay').value) || 1000;
        
        this.addLog('Iniciando workflow: ' + workflow.title, 'info');
        
        try {
            for (let i = 0; i < workflow.steps.length; i++) {
                if (!this.isRunning) break;
                
                this.currentStep = i;
                await this.executeStep(i);
                await this.delay(stepDelay);
            }
            
            if (this.isRunning) {
                this.completeWorkflow();
            }
        } catch (error) {
            console.error('Error en startWorkflow:', error);
            this.addLog(`❌ Error en el workflow: ${error.message}`, 'error');
            this.isRunning = false;
        } finally {
            this.updateButtonStates();
        }
    }

    async executeStep(stepIndex) {
        const workflow = this.workflows[this.currentWorkflow];
        const step = workflow.steps[stepIndex];
        
        // Actualizar UI
        this.updateStepStatus(stepIndex, 'running');
        this.updateProgress((stepIndex + 1) / workflow.steps.length * 100);
        this.updateCurrentStep(step.name);
        
        this.addLog(`Ejecutando: ${step.name}`, 'info');
        
        try {
            // Simular procesamiento
            const processingTime = Math.random() * 2000 + 1000; // 1-3 segundos
            await this.delay(processingTime);
            
            // Simular resultado basado en el tipo de paso
            let success = true;
            let errorMessage = '';
            
            // Diferentes probabilidades de éxito según el tipo de paso
            switch (step.id) {
                case 'validacion-datos':
                case 'validacion-documentos':
                    success = Math.random() > 0.05; // 95% de éxito
                    errorMessage = 'Datos inválidos o documentos faltantes';
                    break;
                case 'consulta-sistemas':
                    success = Math.random() > 0.1; // 90% de éxito
                    errorMessage = 'Error de conexión con sistemas externos';
                    break;
                case 'decision':
                    success = Math.random() > 0.02; // 98% de éxito
                    errorMessage = 'Criterios de aprobación no cumplidos';
                    break;
                default:
                    success = Math.random() > 0.1; // 90% de éxito
                    errorMessage = 'Error en el procesamiento';
            }
            
            if (success) {
                this.updateStepStatus(stepIndex, 'completed');
                this.addLog(`✅ ${step.name} completado exitosamente`, 'success');
            } else {
                this.updateStepStatus(stepIndex, 'error');
                this.addLog(`❌ Error en ${step.name}: ${errorMessage}`, 'error');
                this.metrics.errorCount++;
                this.isRunning = false;
                return;
            }
        } catch (error) {
            this.updateStepStatus(stepIndex, 'error');
            this.addLog(`❌ Error inesperado en ${step.name}: ${error.message}`, 'error');
            this.metrics.errorCount++;
            this.isRunning = false;
        }
    }

    updateStepStatus(stepIndex, status) {
        const steps = document.querySelectorAll('.workflow-step');
        if (steps[stepIndex]) {
            steps[stepIndex].className = `workflow-step ${status}`;
        }
    }

    updateProgress(percentage) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressFill.style.width = percentage + '%';
        progressText.textContent = Math.round(percentage) + '% Completado';
    }

    updateCurrentStep(stepName) {
        const currentStep = document.getElementById('currentStep');
        currentStep.textContent = `Paso: ${stepName}`;
    }

    pauseWorkflow() {
        this.isRunning = false;
        this.updateButtonStates();
        this.addLog('Workflow pausado', 'warning');
    }

    resetWorkflow() {
        this.isRunning = false;
        this.currentStep = 0;
        this.updateButtonStates();
        
        const workflow = this.workflows[this.currentWorkflow];
        workflow.steps.forEach((step, index) => {
            this.updateStepStatus(index, 'pending');
        });
        
        this.updateProgress(0);
        this.updateCurrentStep('Inicio');
        this.addLog('Workflow reiniciado', 'info');
    }

    completeWorkflow() {
        this.metrics.totalProcessed++;
        this.metrics.successCount++;
        this.metrics.totalTime += Date.now() - this.startTime;
        
        this.updateMetrics();
        this.addLog('🎉 Workflow completado exitosamente', 'success');
        this.isRunning = false;
    }

    addLog(message, type = 'info') {
        const logsContent = document.getElementById('logsContent');
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.innerHTML = `
            <span class="log-timestamp">[${timestamp}]</span>
            <span class="log-message">${message}</span>
        `;
        
        logsContent.appendChild(logEntry);
        logsContent.scrollTop = logsContent.scrollHeight;
    }

    clearLogs() {
        const logsContent = document.getElementById('logsContent');
        logsContent.innerHTML = '';
    }

    toggleConfiguration() {
        const configContent = document.getElementById('configContent');
        const isVisible = configContent.style.display !== 'none';
        configContent.style.display = isVisible ? 'none' : 'block';
    }

    loadConfiguration() {
        const config = JSON.parse(localStorage.getItem('workflowConfig') || '{}');
        
        if (config.autoValidation !== undefined) {
            document.getElementById('autoValidation').checked = config.autoValidation;
        }
        if (config.autoApproval !== undefined) {
            document.getElementById('autoApproval').checked = config.autoApproval;
        }
        if (config.notifications !== undefined) {
            document.getElementById('notifications').checked = config.notifications;
        }
        if (config.sagIntegration !== undefined) {
            document.getElementById('sagIntegration').checked = config.sagIntegration;
        }
        if (config.pdiIntegration !== undefined) {
            document.getElementById('pdiIntegration').checked = config.pdiIntegration;
        }
        if (config.externalSystems !== undefined) {
            document.getElementById('externalSystems').checked = config.externalSystems;
        }
        if (config.stepDelay !== undefined) {
            document.getElementById('stepDelay').value = config.stepDelay;
        }
        if (config.validationTimeout !== undefined) {
            document.getElementById('validationTimeout').value = config.validationTimeout;
        }
    }

    saveConfiguration() {
        const config = {
            autoValidation: document.getElementById('autoValidation').checked,
            autoApproval: document.getElementById('autoApproval').checked,
            notifications: document.getElementById('notifications').checked,
            sagIntegration: document.getElementById('sagIntegration').checked,
            pdiIntegration: document.getElementById('pdiIntegration').checked,
            externalSystems: document.getElementById('externalSystems').checked,
            stepDelay: parseInt(document.getElementById('stepDelay').value),
            validationTimeout: parseInt(document.getElementById('validationTimeout').value)
        };
        
        localStorage.setItem('workflowConfig', JSON.stringify(config));
        this.addLog('Configuración guardada', 'info');
    }

    updateMetrics() {
        const avgTime = this.metrics.totalProcessed > 0 ? 
            Math.round(this.metrics.totalTime / this.metrics.totalProcessed / 1000) : 0;
        const successRate = this.metrics.totalProcessed > 0 ? 
            Math.round((this.metrics.successCount / this.metrics.totalProcessed) * 100) : 0;
        const errorRate = this.metrics.totalProcessed > 0 ? 
            Math.round((this.metrics.errorCount / this.metrics.totalProcessed) * 100) : 0;
        
        document.getElementById('avgProcessingTime').textContent = avgTime;
        document.getElementById('successRate').textContent = successRate + '%';
        document.getElementById('totalProcessed').textContent = this.metrics.totalProcessed;
        document.getElementById('errorRate').textContent = errorRate + '%';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicializar módulo cuando el DOM esté listo
function initializeWorkflowVisual() {
    try {
        console.log('Inicializando Workflow Visual...');
        window.workflowVisual = new WorkflowVisual();
        console.log('Workflow Visual inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar Workflow Visual:', error);
    }
}

// Verificar si el DOM ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWorkflowVisual);
} else {
    // El DOM ya está listo
    initializeWorkflowVisual();
}

// Estilos adicionales para el workflow visual
const workflowStyles = `
    .workflow-selector {
        background: var(--surface-color);
        padding: 25px;
        border-radius: 12px;
        margin-bottom: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .workflow-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 20px;
    }
    
    .workflow-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 20px;
        border: 2px solid var(--border-color);
        border-radius: 10px;
        background: var(--background-color);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
    }
    
    .workflow-btn:hover {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: white;
        transform: translateY(-2px);
    }
    
    .workflow-btn.active {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: white;
        box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
    }
    
    .workflow-container {
        background: var(--surface-color);
        border-radius: 12px;
        padding: 30px;
        margin-bottom: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .workflow-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }
    
    .workflow-controls {
        display: flex;
        gap: 10px;
    }
    
    .workflow-steps {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 30px;
    }
    
    .workflow-step {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 20px;
        border-radius: 10px;
        background: var(--background-color);
        border: 2px solid var(--border-color);
        transition: all 0.3s ease;
    }
    
    .workflow-step.pending {
        border-color: var(--border-color);
        background: var(--background-color);
    }
    
    .workflow-step.running {
        border-color: var(--warning-color);
        background: rgba(var(--warning-rgb), 0.1);
        animation: pulse 1.5s infinite;
    }
    
    .workflow-step.completed {
        border-color: var(--success-color);
        background: rgba(var(--success-rgb), 0.1);
    }
    
    .workflow-step.error {
        border-color: var(--error-color);
        background: rgba(var(--error-rgb), 0.1);
    }
    
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
    }
    
    .step-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-color);
        color: white;
        flex-shrink: 0;
    }
    
    .workflow-step.completed .step-icon {
        background: var(--success-color);
    }
    
    .workflow-step.error .step-icon {
        background: var(--error-color);
    }
    
    .step-content {
        flex: 1;
    }
    
    .step-content h4 {
        margin: 0 0 5px 0;
        color: var(--text-primary);
    }
    
    .step-content p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .step-arrow {
        color: var(--text-secondary);
    }
    
    .workflow-progress {
        margin-top: 30px;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: var(--border-color);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 10px;
    }
    
    .progress-fill {
        height: 100%;
        background: var(--primary-color);
        width: 0%;
        transition: width 0.3s ease;
    }
    
    .progress-text {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .logs-panel {
        background: var(--surface-color);
        border-radius: 12px;
        margin-bottom: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .logs-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 30px;
        background: var(--primary-color);
        color: white;
    }
    
    .logs-header h3 {
        margin: 0;
        font-size: 1.2rem;
    }
    
    .logs-content {
        padding: 20px;
        max-height: 300px;
        overflow-y: auto;
        background: var(--background-color);
    }
    
    .log-entry {
        padding: 8px 0;
        border-bottom: 1px solid var(--border-color);
        font-family: monospace;
        font-size: 0.9rem;
    }
    
    .log-entry:last-child {
        border-bottom: none;
    }
    
    .log-timestamp {
        color: var(--text-secondary);
        margin-right: 10px;
    }
    
    .log-info .log-message { color: var(--text-primary); }
    .log-success .log-message { color: var(--success-color); }
    .log-error .log-message { color: var(--error-color); }
    .log-warning .log-message { color: var(--warning-color); }
    
    .config-panel {
        background: var(--surface-color);
        border-radius: 12px;
        margin-bottom: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .config-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 30px;
        background: var(--primary-color);
        color: white;
    }
    
    .config-header h3 {
        margin: 0;
        font-size: 1.2rem;
    }
    
    .config-content {
        padding: 30px;
        background: var(--background-color);
    }
    
    .config-section {
        margin-bottom: 30px;
    }
    
    .config-section h4 {
        margin-bottom: 15px;
        color: var(--text-primary);
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 5px;
    }
    
    .config-item {
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .config-item label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        color: var(--text-primary);
    }
    
    .config-item input[type="number"] {
        width: 100px;
        padding: 5px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--surface-color);
        color: var(--text-primary);
    }
    
    .metrics-panel {
        background: var(--surface-color);
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .metric-card {
        background: var(--background-color);
        padding: 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
        border: 1px solid var(--border-color);
    }
    
    .metric-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-color);
        color: white;
    }
    
    .metric-content h4 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--text-primary);
    }
    
    .metric-content p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
`;

// Agregar estilos al documento
const workflowStyleSheet = document.createElement('style');
workflowStyleSheet.textContent = workflowStyles;
document.head.appendChild(workflowStyleSheet); 