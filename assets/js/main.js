// assets/js/main.js
import {
  displayFieldError,
  clearFieldError,
  markFieldAsValid,
} from "./modules/dom-utils.js";
import {
  validateTramiteField,
  validateContactField,
  validateSeguimientoField,
  formatRUT,
} from "./modules/form-validation.js";
import {
  getTramiteSubmissions,
  saveTramiteSubmission,
} from "./modules/localStorage-helpers.js";

// EXPORTAR funciones de localStorage-helpers AL ÁMBITO GLOBAL PARA LOS MÓDULOS
window.saveTramiteSubmission = saveTramiteSubmission;
window.getTramiteSubmissions = getTramiteSubmissions;

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
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        this.isAuthenticated = true;
      } catch (e) {
        console.error("Error loading user data:", e);
        this.logout();
      }
    }
  }

  saveUserToStorage() {
    if (this.currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem("currentUser");
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
    const loginToggle = document.getElementById("loginToggle");
    const authPanel = document.getElementById("auth-panel");
    const authClose = document.getElementById("authClose");
    const loginForm = document.getElementById("login-form");
    const logoutBtn = document.getElementById("logoutBtn");
    const userPanel = document.getElementById("user-panel");

    if (loginToggle) {
      loginToggle.addEventListener("click", () => {
        if (authPanel) authPanel.style.display = "flex";
      });
    }

    if (authClose) {
      authClose.addEventListener("click", () => {
        if (authPanel) authPanel.style.display = "none";
      });
    }

    if (authPanel) {
      authPanel.addEventListener("click", (e) => {
        if (e.target === authPanel) {
          authPanel.style.display = "none";
        }
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleLogin(e.target);
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        this.logout();
      });
    }

    // Toggle user panel
    const userPanelToggle = document.createElement("button");
    userPanelToggle.className = "user-panel-toggle";
    userPanelToggle.innerHTML =
      '<span class="material-symbols-outlined">account_circle</span>';
    userPanelToggle.addEventListener("click", () => {
      if (userPanel) userPanel.classList.toggle("active");
    });

    // Insert user panel toggle after login toggle
    if (loginToggle && loginToggle.parentNode) {
      loginToggle.parentNode.insertBefore(
        userPanelToggle,
        loginToggle.nextSibling
      );
    }
  }

  handleLogin(form) {
    const rut = form.rut.value.trim();
    const password = form.password.value;
    const role = form.role.value;

    // Validaciones básicas
    if (!this.validateRUT(rut)) {
      displayFieldError(form.rut, "RUT inválido");
      return;
    }

    if (password.length < 6) {
      displayFieldError(
        form.password,
        "La contraseña debe tener al menos 6 caracteres"
      );
      return;
    }

    if (!role) {
      displayFieldError(form.role, "Debe seleccionar un rol");
      return;
    }

    // Simulación de autenticación exitosa
    const userData = {
      rut: rut,
      name: this.getUserNameByRUT(rut),
      role: role,
      loginTime: new Date().toISOString(),
    };

    this.login(userData);

    // Cerrar panel de autenticación
    const authPanel = document.getElementById("auth-panel");
    if (authPanel) authPanel.style.display = "none";

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
      "12345678-9": "Juan Pérez González",
      "87654321-0": "María Silva Rodríguez",
      "11111111-1": "Carlos López Mendoza",
      "22222222-2": "Ana Torres Vega",
    };
    return names[rut] || "Usuario " + rut.split("-")[0];
  }

  updateUI() {
    const loginToggle = document.getElementById("loginToggle");
    const userPanel = document.getElementById("user-panel");
    const userName = document.getElementById("user-name");
    const userRole = document.getElementById("user-role");
    const adminPanelBtn = document.getElementById("adminPanelBtn");

    if (this.isAuthenticated && this.currentUser) {
      // Ocultar botón de login
      if (loginToggle) {
        loginToggle.style.display = "none";
      }

      // Mostrar información del usuario
      if (userName) userName.textContent = this.currentUser.name;
      if (userRole) userRole.textContent = this.currentUser.role;

      // Mostrar botón de admin si es administrador
      if (adminPanelBtn) {
        adminPanelBtn.style.display =
          this.currentUser.role === "admin" ? "flex" : "none";
      }

      // Agregar botones de acceso según el rol
      this.addRoleBasedAccess();

      // Mostrar panel de usuario
      if (userPanel) {
        userPanel.style.display = "block";
      }
    } else {
      // Mostrar botón de login
      if (loginToggle) {
        loginToggle.style.display = "flex";
      }

      // Ocultar panel de usuario
      if (userPanel) {
        userPanel.style.display = "none";
        userPanel.classList.remove("active");
      }
    }
  }

  addRoleBasedAccess() {
    const quickActions = document.querySelector(".action-buttons");
    if (!quickActions) return;

    // Remover botones de acceso específicos existentes
    const existingRoleButtons =
      quickActions.querySelectorAll(".role-access-btn");
    existingRoleButtons.forEach((btn) => btn.remove());

    // Detectar si estamos en una página de módulo para ajustar las rutas
    const isInModule = window.location.pathname.includes("/modulos/");
    const basePath = isInModule ? "../../" : "";

    // Agregar botones según el rol
    if (this.currentUser.role === "funcionario") {
      // Botón para Dashboard de Menores
      const dashboardBtn = document.createElement("button");
      dashboardBtn.className = "button button-secondary role-access-btn";
      dashboardBtn.innerHTML = `
                <span class="material-symbols-outlined">child_care</span>
                Dashboard Menores
            `;
      dashboardBtn.onclick = () =>
        (window.location.href =
          basePath + "modulos/menores/dashboard-menores.html");
      quickActions.appendChild(dashboardBtn);
    }

    if (this.currentUser.role === "admin") {
      // Botón para Workflow Visual
      const workflowBtn = document.createElement("button");
      workflowBtn.className = "button button-secondary role-access-btn";
      workflowBtn.innerHTML = `
                <span class="material-symbols-outlined">account_tree</span>
                Workflow Visual
            `;
      workflowBtn.onclick = () =>
        (window.location.href =
          basePath + "modulos/automatizacion/workflow-visual.html");
      quickActions.appendChild(workflowBtn);
    }
  }

  loadUserMetrics() {
    // Simulación de métricas del usuario
    const submissions = getTramiteSubmissions();
    const userSubmissions = submissions.filter(
      (sub) => sub.rutSolicitante === this.currentUser.rut
    );

    const activeProcedures = document.getElementById("active-procedures");
    const pendingProcedures = document.getElementById("pending-procedures");
    const completedProcedures = document.getElementById("completed-procedures");

    if (activeProcedures) activeProcedures.textContent = userSubmissions.length;
    if (pendingProcedures)
      pendingProcedures.textContent = Math.floor(userSubmissions.length * 0.3);
    if (completedProcedures)
      completedProcedures.textContent = Math.floor(
        userSubmissions.length * 0.7
      );
  }
}

// Sistema de Validaciones en Tiempo Real
class ValidationSystem {
  constructor() {
    this.touchedFields = new Set();
    this.init();
  }

  init() {
    this.setupFieldValidation();
    this.clearAllFieldsOnLoad();
  }

  setupFieldValidation() {
    // Configurar validación para todos los campos de formulario
    const formFields = document.querySelectorAll("input, select, textarea");
    formFields.forEach((field) => {
      // Solo validar después de que el usuario haya interactuado con el campo
      field.addEventListener("blur", (e) => {
        this.touchedFields.add(e.target);
        this.validateField(e.target);
      });

      // Validar en tiempo real solo si el campo ya ha sido tocado
      field.addEventListener("input", (e) => {
        if (this.touchedFields.has(e.target)) {
          this.validateField(e.target);
        }
      });
    });
  }

  validateField(field) {
    // Usar el sistema de validación existente si está disponible
    if (field.closest("#tramite-form")) {
      return validateTramiteField(field, this.touchedFields);
    } else if (field.closest("#contact-form")) {
      return validateContactField(field, this.touchedFields);
    } else if (field.closest("#seguimiento-form")) {
      return validateSeguimientoField(field, this.touchedFields);
    } else {
      const value = field.value.trim();
      if (value === "" && field.required) {
        if (this.touchedFields.has(field)) {
          const fieldName =
            field
              .closest(".form-group")
              ?.querySelector("label")
              ?.textContent.replace(": *", "")
              .replace(":", "") || field.name;
          displayFieldError(field, `${fieldName} es requerido`);
          return false;
        }
      }
      if (value !== "") {
        markFieldAsValid(field);
        return true;
      }
    }
    return true;
  }

  validateAllFields(form) {
    let isValid = true;
    const fields = form.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );

    fields.forEach((field) => {
      this.touchedFields.add(field);
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  clearAllFieldsOnLoad() {
    const formFields = document.querySelectorAll("input, select, textarea");
    formFields.forEach((field) => {
      clearFieldError(field);
      field.classList.remove(
        "error",
        "valid",
        "form-field-error",
        "form-field-success",
        "rut-valid",
        "rut-invalid",
        "patent-valid",
        "patent-invalid",
        "email-valid",
        "email-invalid"
      );
      field.style.borderColor = "";
      field.style.borderWidth = "";
    });
  }
}

// Función para manejar menús desplegables
function initDropdownMenus() {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");

    if (toggle && menu) {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isExpanded = toggle.getAttribute("aria-expanded") === "true";

        // Cerrar todos los otros dropdowns
        dropdowns.forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            const otherToggle = otherDropdown.querySelector(".dropdown-toggle");
            const otherMenu = otherDropdown.querySelector(".dropdown-menu");
            if (otherToggle && otherMenu) {
              otherToggle.setAttribute("aria-expanded", "false");
              otherDropdown.setAttribute("aria-expanded", "false");
            }
          }
        });

        // Toggle del dropdown actual
        toggle.setAttribute("aria-expanded", !isExpanded);
        dropdown.setAttribute("aria-expanded", !isExpanded);
      });
    }
  });

  // Cerrar dropdowns al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle");
        const menu = dropdown.querySelector(".dropdown-menu");
        if (toggle && menu) {
          toggle.setAttribute("aria-expanded", "false");
          dropdown.setAttribute("aria-expanded", "false");
        }
      });
    }
  });
}

// Inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar el sistema de autenticación
  const auth = new AuthSystem();
  const validation = new ValidationSystem();

  // Inicializar otras funcionalidades
  initDropdownMenus();
  initThemeToggle();
  initWhatsAppChat();
  initFormValidation();
  initRUTFormatting();

  // Limpiar campos de formularios al cargar la página si no hay datos de sesión
  validation.clearAllFieldsOnLoad();

  // Mostrar documentación en la consola
  // showDocumentation(); // Comentado para evitar que se muestre en todas las páginas

  /**
   * Actualiza el mensaje de alerta de mantenimiento para que sea dinámico.
   * Cambia "el domingo" por una fecha específica como "el próximo domingo 15 de septiembre".
   */
  const updateMaintenanceAlert = () => {
    // Selecciona el párrafo dentro de la alerta de advertencia del sistema
    const alertParagraph = document.querySelector(
      ".alert-system .alert-warning p"
    );

    // Si no se encuentra el párrafo, no hace nada
    if (!alertParagraph) {
      return;
    }

    const originalHTML = alertParagraph.innerHTML;
    const maintenanceDayName = "domingo";
    const maintenanceDayOfWeek = 0; // 0 para Domingo

    /**
     * Calcula la fecha del próximo día de la semana especificado.
     * @param {Date} startDate - La fecha desde la cual calcular.
     * @param {number} dayOfWeek - El día de la semana (0=Domingo, 1=Lunes...).
     * @returns {Date} La fecha del próximo día de la semana.
     */
    const getNextDayOfWeek = (startDate, dayOfWeek) => {
      const resultDate = new Date(startDate.getTime());
      let daysToAdd = (dayOfWeek - startDate.getDay() + 7) % 7;

      // Si el día de mantenimiento es hoy, calcula para la próxima semana
      if (daysToAdd === 0) {
        daysToAdd = 7;
      }

      resultDate.setDate(startDate.getDate() + daysToAdd);
      return resultDate;
    };

    const today = new Date();
    const nextMaintenanceDate = getNextDayOfWeek(today, maintenanceDayOfWeek);

    const day = nextMaintenanceDate.getDate();
    const month = nextMaintenanceDate.toLocaleString("es-ES", {
      month: "long",
    });

    // Construye el texto dinámico, p.ej., "el próximo domingo 15 de septiembre"
    const dynamicDateString = `el próximo ${maintenanceDayName} ${day} de ${month}`;

    // Reemplaza el texto estático "el domingo" con la fecha dinámica
    const newHTML = originalHTML.replace(
      /para el domingo/g,
      `para ${dynamicDateString}`
    );

    alertParagraph.innerHTML = newHTML;
  };

  // Llama a la función para actualizar la alerta
  updateMaintenanceAlert();

  // Habilitar JS para el menú responsive
  document.body.classList.add("js-enabled");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuItems = document.querySelector(".menu-items");
  if (menuToggle && menuItems) {
    menuToggle.addEventListener("click", function () {
      const isActive = menuItems.classList.contains("is-active");
      menuItems.classList.toggle("is-active", !isActive);
      menuToggle.setAttribute("aria-expanded", String(!isActive));
    });
    // Cerrar menú al hacer clic en un enlace
    menuItems.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuItems.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Lógica para seguimiento de trámites
  const formSeguimiento = document.getElementById("seguimiento-form");
  const resultadoDiv = document.getElementById("resultado-seguimiento");

  if (formSeguimiento && resultadoDiv) {
    formSeguimiento.addEventListener("submit", function (e) {
      e.preventDefault();
      const numero = document
        .getElementById("numero-tramite-busqueda")
        .value.trim();
      const tramites = window.getTramiteSubmissions(); // Usar la función global consistentemente
      const tramite = tramites.find(
        (t) => (t.numeroTramite || "").toUpperCase() === numero.toUpperCase()
      );

      if (tramite) {
        resultadoDiv.innerHTML = `
                    <div class="validation-status success">
                        <span class="material-symbols-outlined">check_circle</span>
                        <strong>Trámite encontrado</strong>
                        <p><b>Número:</b> ${tramite.numeroTramite}</p>
                        <p><b>Tipo:</b> ${tramite.tipoTramite}</p>
                        <p><b>Estado:</b> ${tramite.estado}</p>
                        <p><b>Fecha:</b> ${tramite.fecha}</p>
                        <p><b>Observaciones:</b> ${
                          tramite.observaciones || "N/A"
                        }</p>
                    </div>
                `;
      } else {
        resultadoDiv.innerHTML = `
                    <div class="validation-status error">
                        <span class="material-symbols-outlined">error</span>
                        <strong>No se encontró el trámite</strong>
                        <p>Verifique el número ingresado.</p>
                    </div>
                `;
      }
    });
  }

  // Eliminar o recordar cierre de alertas (alert-system)
  const alertSystem = document.querySelector(".alert-system");
  if (alertSystem) {
    // Si ya fue cerrada en esta sesión, no mostrar
    if (sessionStorage.getItem("alertSystemDismissed")) {
      alertSystem.style.display = "none";
    } else {
      const dismissBtn = alertSystem.querySelector(".alert-dismiss");
      if (dismissBtn) {
        dismissBtn.addEventListener("click", () => {
          alertSystem.style.display = "none";
          sessionStorage.setItem("alertSystemDismissed", "1");
        });
      }
    }
  }
});

// Theme Toggle Function
function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.contains("darkmode");
      const newTheme = isDark ? "light" : "dark";

      localStorage.setItem("theme", newTheme);

      if (newTheme === "dark") {
        document.documentElement.classList.add("darkmode");
        document.body.classList.add("darkmode");
      } else {
        document.documentElement.classList.remove("darkmode");
        document.body.classList.remove("darkmode");
      }

      updateThemeIcon();
    });

    updateThemeIcon();
  }
}

function updateThemeIcon() {
  const themeToggle = document.getElementById("themeToggle");
  const icon = themeToggle?.querySelector(".material-symbols-outlined");
  if (icon) {
    icon.textContent = document.documentElement.classList.contains("darkmode")
      ? "light_mode"
      : "dark_mode";
  }
}

// WhatsApp Chat Function
function initWhatsAppChat() {
  const whatsappFloat = document.getElementById("whatsapp-float");
  const whatsappModal = document.getElementById("whatsapp-chat-modal");
  const modalClose = document.querySelector(".whatsapp-modal-close");

  if (whatsappFloat && whatsappModal) {
    whatsappFloat.addEventListener("click", (e) => {
      e.preventDefault();
      whatsappModal.style.display = "flex";
      whatsappModal.classList.add("is-active");
    });
  }

  if (modalClose && whatsappModal) {
    modalClose.addEventListener("click", closeModal);
  }

  if (whatsappModal) {
    whatsappModal.addEventListener("click", (e) => {
      if (e.target === whatsappModal) {
        closeModal();
      }
    });
  }

  function closeModal() {
    if (whatsappModal) {
      whatsappModal.classList.remove("is-active");
      setTimeout(() => {
        whatsappModal.style.display = "none";
      }, 300);
    }
  }
}

// Exponer funciones globalmente si son llamadas desde HTML
function showDocumentation() {
  alert(
    "Documentación requerida:\n\n" +
      "• Gestión de Menores: RUT, documentos de autorización, certificados\n" +
      "• Gestión de Vehículos: RUT propietario, documentos del vehículo\n" +
      "• Productos Animales: Certificados sanitarios, declaraciones juradas\n" +
      "• Todos los trámites requieren identificación válida"
  );
}

// Función para inicializar la validación de formularios
function initFormValidation() {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    // Evitar doble listener en formularios ya manejados por AuthSystem
    if (form.id === "login-form") return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      handleFormSubmission(this);
    });
  });
}

// Función para inicializar el formateo de RUT
function initRUTFormatting() {
  // Buscar todos los campos que contengan "rut" en su ID o nombre
  const rutFields = document.querySelectorAll(
    'input[id*="rut"], input[name*="rut"]'
  );

  rutFields.forEach((field) => {
    // Aplicar formateo mientras se escribe
    field.addEventListener("input", function () {
      formatRUT(this);
    });

    // Aplicar formateo al perder el foco
    field.addEventListener("blur", function () {
      formatRUT(this);
    });

    // Limpiar formateo al obtener el foco para facilitar la edición
    field.addEventListener("focus", function () {
      this.value = this.value.replace(/\./g, "").replace(/-/g, "");
    });
  });
}

// Manejar el envío de formularios genéricos
function handleFormSubmission(form) {
  if (!window.validationSystem) return;

  const isValid = window.validationSystem.validateAllFields(form);

  if (isValid) {
    if (form.id === "seguimiento-form") {
      const trackingNumber = form.querySelector(
        "#numero-tramite-busqueda"
      ).value;
      displayTrackingResult(trackingNumber);
    } else {
      showSuccessMessage(form, "Formulario enviado con éxito. Gracias.");
    }
    form.reset();
    window.validationSystem.clearAllFieldsOnLoad();
  } else {
    const firstErrorField = form.querySelector(".error, .form-field-error");
    if (firstErrorField) {
      firstErrorField.focus();
    }
  }
}

function displayTrackingResult(trackingNumber) {
  const resultsContainer = document.getElementById("resultado-seguimiento");
  if (!resultsContainer) return;

  // Buscar en el storage centralizado
  let tramite = null;
  // Ya hemos establecido que getTramiteSubmissions estará en window.
  // La verificación typeof puede permanecer si se desea, pero llamaremos a window.getTramiteSubmissions
  if (typeof window.getTramiteSubmissions === "function") {
    const tramites = window.getTramiteSubmissions(); // Usar la función global consistentemente
    tramite = tramites.find(
      (t) =>
        (t.numeroTramite || "").toUpperCase() === trackingNumber.toUpperCase()
    );
  }

  if (tramite) {
    resultsContainer.innerHTML = `
            <div class="card card-flat" style="padding: 1.5rem;">
                <h3>Resultado para el Trámite: ${trackingNumber}</h3>
                <ul style="list-style: none; padding-left: 0; margin-top: 1rem;">
                    <li style="margin-bottom: 0.5rem;"><strong>Tipo de Trámite:</strong> ${
                      tramite.tipoTramite || "-"
                    }</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Estado:</strong> ${
                      tramite.estado || "-"
                    }</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Fecha:</strong> ${
                      tramite.fecha
                        ? new Date(tramite.fecha).toLocaleString("es-CL")
                        : "-"
                    }</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Observaciones:</strong> ${
                      tramite.observaciones || "-"
                    }</li>
                </ul>
                <details style="margin-top:1rem;"><summary>Ver datos del trámite</summary><pre style="white-space:pre-wrap;">${JSON.stringify(
                  tramite.datos,
                  null,
                  2
                )}</pre></details>
            </div>
        `;
  } else {
    resultsContainer.innerHTML = `
            <div class="card card-flat" style="padding: 1.5rem; text-align:center; color:var(--error-color);">
                <h3>No se encontró ningún trámite con el código ingresado.</h3>
                <p>Verifica que el código esté bien escrito y corresponde a un trámite registrado.</p>
            </div>
        `;
  }
  resultsContainer.style.display = "block";
}
