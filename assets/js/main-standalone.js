// assets/js/main-standalone.js - Versión sin importaciones ES6

// Funciones de utilidad para manejo de errores en formularios
function displayFieldError(field, message) {
    const errorElement = field.parentNode.querySelector('.validation-message') || 
                        field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        field.classList.add('error');
    }
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.validation-message') || 
                        field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        field.classList.remove('error');
    }
}

function markFieldAsValid(field) {
    clearFieldError(field);
    field.classList.add('valid');
}

// Sistema de Autenticación Simulada
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.setupAuthUI();
        this.updateUI();
    }

    loadUserFromStorage() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.isAuthenticated = true;
            } catch (e) {
                console.error('Error loading user data:', e);
                this.logout();
            }
        }
    }

    saveUserToStorage() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }

    login(userData) {
        this.currentUser = userData;
        this.isAuthenticated = true;
        this.saveUserToStorage();
        this.updateUI();
        this.loadUserMetrics();
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.saveUserToStorage();
        this.updateUI();
    }

    setupAuthUI() {
        const loginToggle = document.getElementById('loginToggle');
        const authPanel = document.getElementById('auth-panel');
        const authClose = document.getElementById('authClose');
        const loginForm = document.getElementById('login-form');
        const logoutBtn = document.getElementById('logoutBtn');
        const userPanel = document.getElementById('user-panel');

        if (loginToggle) {
            loginToggle.addEventListener('click', () => {
                if (authPanel) authPanel.style.display = 'flex';
            });
        }

        if (authClose) {
            authClose.addEventListener('click', () => {
                if (authPanel) authPanel.style.display = 'none';
            });
        }

        if (authPanel) {
            authPanel.addEventListener('click', (e) => {
                if (e.target === authPanel) {
                    authPanel.style.display = 'none';
                }
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e.target);
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Toggle user panel
        const userPanelToggle = document.createElement('button');
        userPanelToggle.className = 'user-panel-toggle';
        userPanelToggle.innerHTML = '<span class="material-symbols-outlined">account_circle</span>';
        userPanelToggle.addEventListener('click', () => {
            if (userPanel) userPanel.classList.toggle('active');
        });

        // Insert user panel toggle after login toggle
        if (loginToggle && loginToggle.parentNode) {
            loginToggle.parentNode.insertBefore(userPanelToggle, loginToggle.nextSibling);
        }
    }

    handleLogin(form) {
        const rut = form.rut.value.trim();
        const password = form.password.value;
        const role = form.role.value;

        // Validaciones básicas
        if (!this.validateRUT(rut)) {
            displayFieldError(form.rut, 'RUT inválido');
            return;
        }

        if (password.length < 6) {
            displayFieldError(form.password, 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (!role) {
            displayFieldError(form.role, 'Debe seleccionar un rol');
            return;
        }

        // Simulación de autenticación exitosa
        const userData = {
            rut: rut,
            name: this.getUserNameByRUT(rut),
            role: role,
            loginTime: new Date().toISOString()
        };

        this.login(userData);
        
        // Cerrar panel de autenticación
        const authPanel = document.getElementById('auth-panel');
        if (authPanel) authPanel.style.display = 'none';
        
        // Limpiar formulario
        form.reset();
    }

    validateRUT(rut) {
        // Validación básica de RUT chileno
        const rutRegex = /^[0-9]{7,8}-[0-9kK]$/;
        if (!rutRegex.test(rut)) return false;
        
        // Aquí se podría agregar validación del dígito verificador
        return true;
    }

    getUserNameByRUT(rut) {
        // Simulación de nombres por RUT
        const names = {
            '12345678-9': 'Juan Pérez González',
            '87654321-0': 'María Silva Rodríguez',
            '11111111-1': 'Carlos López Mendoza',
            '22222222-2': 'Ana Torres Vega'
        };
        return names[rut] || 'Usuario ' + rut.split('-')[0];
    }

    updateUI() {
        const loginToggle = document.getElementById('loginToggle');
        const userPanel = document.getElementById('user-panel');
        const userName = document.getElementById('user-name');
        const userRole = document.getElementById('user-role');
        const adminPanelBtn = document.getElementById('adminPanelBtn');

        if (this.isAuthenticated && this.currentUser) {
            // Ocultar botón de login
            if (loginToggle) {
                loginToggle.style.display = 'none';
            }

            // Mostrar información del usuario
            if (userName) userName.textContent = this.currentUser.name;
            if (userRole) userRole.textContent = this.currentUser.role;

            // Mostrar botón de admin si es administrador
            if (adminPanelBtn) {
                adminPanelBtn.style.display = this.currentUser.role === 'admin' ? 'flex' : 'none';
            }

            // Agregar botones de acceso según el rol
            this.addRoleBasedAccess();

            // Mostrar panel de usuario
            if (userPanel) {
                userPanel.style.display = 'block';
            }
        } else {
            // Mostrar botón de login
            if (loginToggle) {
                loginToggle.style.display = 'flex';
            }

            // Ocultar panel de usuario
            if (userPanel) {
                userPanel.style.display = 'none';
                userPanel.classList.remove('active');
            }
        }
    }

    addRoleBasedAccess() {
        const quickActions = document.querySelector('.action-buttons');
        if (!quickActions) return;

        // Remover botones de acceso específicos existentes
        const existingRoleButtons = quickActions.querySelectorAll('.role-access-btn');
        existingRoleButtons.forEach(btn => btn.remove());

        // Detectar si estamos en una página de módulo para ajustar las rutas
        const isInModule = window.location.pathname.includes('/modulos/');
        const basePath = isInModule ? '../../' : '';

        // Agregar botones según el rol
        if (this.currentUser.role === 'funcionario') {
            // Botón para Dashboard de Menores
            const dashboardBtn = document.createElement('button');
            dashboardBtn.className = 'button button-secondary role-access-btn';
            dashboardBtn.innerHTML = `
                <span class="material-symbols-outlined">child_care</span>
                Dashboard Menores
            `;
            dashboardBtn.onclick = () => window.location.href = basePath + 'modulos/menores/dashboard-menores.html';
            quickActions.appendChild(dashboardBtn);
        }

        if (this.currentUser.role === 'admin') {
            // Botón para Workflow Visual
            const workflowBtn = document.createElement('button');
            workflowBtn.className = 'button button-secondary role-access-btn';
            workflowBtn.innerHTML = `
                <span class="material-symbols-outlined">account_tree</span>
                Workflow Visual
            `;
            workflowBtn.onclick = () => window.location.href = basePath + 'modulos/automatizacion/workflow-visual.html';
            quickActions.appendChild(workflowBtn);
        }
    }

    loadUserMetrics() {
        // Simulación de métricas del usuario
        const activeProcedures = document.getElementById('active-procedures');
        const pendingProcedures = document.getElementById('pending-procedures');
        const completedProcedures = document.getElementById('completed-procedures');

        if (activeProcedures) activeProcedures.textContent = '3';
        if (pendingProcedures) pendingProcedures.textContent = '1';
        if (completedProcedures) completedProcedures.textContent = '2';
    }
}

// Sistema de Validaciones en Tiempo Real
class ValidationSystem {
    constructor() {
        this.touchedFields = new Set(); // Campos que han sido tocados por el usuario
        this.init();
    }

    init() {
        this.setupFieldValidation();
        this.clearAllFieldsOnLoad();
    }

    setupFieldValidation() {
        // Configurar validación para todos los campos de formulario
        const formFields = document.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            // Solo validar después de que el usuario haya interactuado con el campo
            field.addEventListener('blur', (e) => {
                this.touchedFields.add(e.target);
                this.validateField(e.target);
            });
            
            // Validar en tiempo real solo si el campo ya ha sido tocado
            field.addEventListener('input', (e) => {
                if (this.touchedFields.has(e.target)) {
                    this.validateField(e.target);
                }
            });
        });
    }

    validateField(field) {
        // Si el campo está vacío y no ha sido tocado, limpiar cualquier error y no mostrar color rojo
        if (field.value.trim() === '' && !this.touchedFields.has(field)) {
            clearFieldError(field);
            // Limpiar todas las clases de validación para que no se vea rojo
            field.classList.remove('error', 'valid', 'form-field-error', 'form-field-success', 'rut-valid', 'rut-invalid', 'patent-valid', 'patent-invalid', 'email-valid', 'email-invalid');
            return true;
        }

        // Usar el sistema de validación existente si está disponible
        if (window.validateTramiteField) {
            return window.validateTramiteField(field);
        } else if (window.validateContactField) {
            return window.validateContactField(field);
        } else {
            // Validación básica de respaldo
            return this.basicValidation(field);
        }
    }

    basicValidation(field) {
        const value = field.value.trim();
        
        // Si el campo está vacío pero ya fue tocado, mostrar error
        if (value === '' && field.required) {
            const fieldName = field.closest('.form-group')?.querySelector('label')?.textContent.replace(': *', '').replace(':', '') || field.name;
            displayFieldError(field, `${fieldName} es requerido`);
            return false;
        }

        // Si el campo tiene valor, marcarlo como válido
        if (value !== '') {
            markFieldAsValid(field);
            return true;
        }

        return true;
    }

    // Método para validar todos los campos cuando se envía el formulario
    validateAllFields(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        fields.forEach(field => {
            this.touchedFields.add(field); // Marcar como tocado
            
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    clearAllFieldsOnLoad() {
        // Limpiar todos los campos al cargar la página para evitar colores rojos iniciales
        const formFields = document.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            // Limpiar mensajes de error
            clearFieldError(field);
            
            // Remover todas las clases de validación
            field.classList.remove(
                'error', 'valid', 
                'form-field-error', 'form-field-success', 
                'rut-valid', 'rut-invalid', 
                'patent-valid', 'patent-invalid', 
                'email-valid', 'email-invalid'
            );
            
            // Asegurar que el campo tenga el estilo por defecto
            field.style.borderColor = '';
            field.style.borderWidth = '';
            
            // Limpiar cualquier mensaje de error visible
            const errorElement = field.parentNode.querySelector('.validation-message') || 
                                field.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        });
        
        // También limpiar cualquier mensaje de éxito
        const successMessages = document.querySelectorAll('.success-message');
        successMessages.forEach(msg => {
            msg.textContent = '';
            msg.style.display = 'none';
        });
    }
}

// Función para manejar menús desplegables
function initDropdownMenus() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                
                // Cerrar todos los otros dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        const otherToggle = otherDropdown.querySelector('.dropdown-toggle');
                        const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                        if (otherToggle && otherMenu) {
                            otherToggle.setAttribute('aria-expanded', 'false');
                            otherDropdown.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                // Toggle del dropdown actual
                toggle.setAttribute('aria-expanded', !isExpanded);
                dropdown.setAttribute('aria-expanded', !isExpanded);
            });
        }
    });
    
    // Cerrar dropdowns al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('.dropdown-toggle');
                const menu = dropdown.querySelector('.dropdown-menu');
                if (toggle && menu) {
                    toggle.setAttribute('aria-expanded', 'false');
                    dropdown.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
}

// Theme Toggle Function
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('darkmode');
            const newTheme = isDark ? 'light' : 'dark';
            
            localStorage.setItem('theme', newTheme);
            
            if (newTheme === 'dark') {
                document.documentElement.classList.add('darkmode');
                document.body.classList.add('darkmode');
            } else {
                document.documentElement.classList.remove('darkmode');
                document.body.classList.remove('darkmode');
            }
            
            updateThemeIcon();
        });
        
        updateThemeIcon();
    }
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle?.querySelector('.material-symbols-outlined');
    if (icon) {
        icon.textContent = document.documentElement.classList.contains('darkmode') ? 'light_mode' : 'dark_mode';
    }
}

// WhatsApp Chat Function
function initWhatsAppChat() {
    const whatsappFloat = document.getElementById('whatsapp-float');
    const whatsappModal = document.getElementById('whatsapp-chat-modal');
    const modalClose = document.querySelector('.whatsapp-modal-close');
    
    if (whatsappFloat && whatsappModal) {
        whatsappFloat.addEventListener('click', (e) => {
            e.preventDefault();
            whatsappModal.style.display = 'flex';
            whatsappModal.classList.add('is-active');
        });
    }
    
    if (modalClose && whatsappModal) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (whatsappModal) {
        whatsappModal.addEventListener('click', (e) => {
            if (e.target === whatsappModal) {
                closeModal();
            }
        });
    }
    
    function closeModal() {
        if (whatsappModal) {
            whatsappModal.classList.remove('is-active');
            setTimeout(() => {
                whatsappModal.style.display = 'none';
            }, 300);
        }
    }
}

// Exponer funciones globalmente si son llamadas desde HTML
function showDocumentation() {
    alert('Documentación requerida:\n\n' +
          '• Gestión de Menores: RUT, documentos de autorización, certificados\n' +
          '• Gestión de Vehículos: RUT propietario, documentos del vehículo\n' +
          '• Productos Animales: Certificados sanitarios, declaraciones juradas\n' +
          '• Todos los trámites requieren identificación válida');
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistemas existentes
    window.authSystem = new AuthSystem();
    window.validationSystem = new ValidationSystem();
    
    // Inicializar funcionalidades adicionales
    initThemeToggle();
    initWhatsAppChat();
    initDropdownMenus();
    initFormValidation();
    
    // Inicializar menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const menuItems = document.querySelector('.menu-items');
    
    if (menuToggle && menuItems) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            menuItems.classList.toggle('active');
        });
    }
    
    // Cerrar menú móvil al hacer clic en un enlace
    const menuLinks = document.querySelectorAll('.menu-items a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuItems) menuItems.classList.remove('active');
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Sistema de alertas
    const alertDismissButtons = document.querySelectorAll('.alert-dismiss');
    alertDismissButtons.forEach(button => {
        button.addEventListener('click', function() {
            const alert = this.closest('.alert');
            if (alert) {
                alert.style.display = 'none';
            }
        });
    });
    
    // Traducción básica (placeholder)
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            console.log('Idioma seleccionado:', selectedLang);
            // Aquí se implementaría la lógica de traducción
        });
    }
});

// Función para inicializar la validación de formularios
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar todos los campos del formulario
            if (window.validationSystem && window.validationSystem.validateAllFields(this)) {
                // Si todos los campos son válidos, proceder con el envío
                console.log('Formulario válido, procediendo con el envío...');
                // Aquí se puede agregar la lógica de envío del formulario
                handleFormSubmission(this);
            } else {
                console.log('Formulario inválido, corrija los errores antes de continuar.');
                // Hacer scroll al primer campo con error
                const firstError = this.querySelector('.error, .validation-message[style*="block"]');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });
}

// Función para manejar el envío del formulario
function handleFormSubmission(form) {
    const formId = form.id;
    
    // Mostrar indicador de carga
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton ? submitButton.innerHTML : '';
    
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Procesando...';
    }
    
    // Simular procesamiento (aquí se conectaría con el backend real)
    setTimeout(() => {
        // Restaurar botón
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
        
        // Mostrar mensaje de éxito
        showSuccessMessage(form, 'Formulario enviado correctamente');
        
        // Limpiar formulario
        form.reset();
        
        // Limpiar errores
        const errorMessages = form.querySelectorAll('.validation-message, .error-message');
        errorMessages.forEach(msg => {
            msg.textContent = '';
            msg.style.display = 'none';
        });
        
        // Limpiar clases de validación
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('error', 'valid', 'rut-valid', 'rut-invalid', 'patent-valid', 'patent-invalid', 'email-valid', 'email-invalid');
        });
        
        // Resetear campos tocados para este formulario
        if (window.validationSystem) {
            const formFields = form.querySelectorAll('input, select, textarea');
            formFields.forEach(field => {
                window.validationSystem.touchedFields.delete(field);
            });
        }
        
    }, 2000);
}

// Función para mostrar mensaje de éxito
function showSuccessMessage(form, message) {
    // Crear elemento de mensaje de éxito
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.innerHTML = `
        <span class="material-symbols-outlined">check_circle</span>
        <p>${message}</p>
        <button class="alert-dismiss" aria-label="Cerrar mensaje">
            <span class="material-symbols-outlined">close</span>
        </button>
    `;
    
    // Insertar antes del formulario
    form.parentNode.insertBefore(successDiv, form);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
    
    // Permitir cerrar manualmente
    const dismissBtn = successDiv.querySelector('.alert-dismiss');
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            successDiv.remove();
        });
    }
} 