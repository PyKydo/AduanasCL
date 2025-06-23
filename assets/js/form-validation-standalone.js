// assets/js/form-validation-standalone.js - Versión sin importaciones ES6

// Función de validación de RUT chileno
function validateRUT(rut) {
  // Limpiar el RUT de puntos y guiones
  const cleanRut = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();

  // Verificar formato básico
  if (!/^[0-9]{7,8}[0-9K]$/.test(cleanRut)) {
    return {
      isValid: false,
      message: "Formato de RUT inválido. Debe ser: 12345678-9 o 12345678-K",
    };
  }

  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);

  // Verificar que el número sea válido
  if (parseInt(rutNumber) <= 0) {
    return {
      isValid: false,
      message: "Número de RUT inválido",
    };
  }

  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;

  for (let i = rutNumber.length - 1; i >= 0; i--) {
    suma += parseInt(rutNumber[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvCalculado =
    resto === 0 ? "0" : resto === 1 ? "K" : (11 - resto).toString();

  // Verificar dígito verificador
  if (dv !== dvCalculado) {
    return {
      isValid: false,
      message: "Dígito verificador incorrecto",
    };
  }

  return {
    isValid: true,
    message: "RUT válido",
  };
}

// Función para formatear RUT mientras se escribe
function formatRUT(input) {
  let value = input.value.replace(/\./g, "").replace(/-/g, "").toUpperCase();

  // Limitar a 9 caracteres (8 números + 1 dígito verificador)
  if (value.length > 9) {
    value = value.slice(0, 9);
  }

  // Solo permitir números y K
  value = value.replace(/[^0-9K]/g, "");

  // Formatear con guión
  if (value.length > 1) {
    value = value.slice(0, -1) + "-" + value.slice(-1);
  }

  input.value = value;
}

// Funciones de utilidad para manejo de errores en formularios
function displayFieldError(field, message) {
  // Buscar el elemento de error apropiado
  let errorElement =
    field.parentNode.querySelector(".error-message") ||
    field.parentNode.querySelector(".validation-message");

  // Si no existe, crear uno
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.setAttribute("aria-live", "polite");
    field.parentNode.appendChild(errorElement);
  }

  // Si es un span de validation-message, convertirlo a error-message para consistencia
  if (errorElement.classList.contains("validation-message")) {
    const newErrorElement = document.createElement("div");
    newErrorElement.className = "error-message";
    newErrorElement.setAttribute("aria-live", "polite");
    newErrorElement.textContent = message;
    newErrorElement.style.display = "flex";
    errorElement.parentNode.replaceChild(newErrorElement, errorElement);
    errorElement = newErrorElement;
  } else {
    // Mostrar el mensaje de error con el formato correcto
    errorElement.textContent = message;
    errorElement.style.display = "flex";
  }

  field.classList.add("error");
}

function clearFieldError(field) {
  const errorElement =
    field.parentNode.querySelector(".error-message") ||
    field.parentNode.querySelector(".validation-message");
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
    field.classList.remove("error");
  }
}

function markFieldAsValid(field) {
  clearFieldError(field);
  field.classList.remove("error");
  field.classList.add("valid");
}

// --- Trámite Form Specific Validations ---
const validateRequiredTramite = (field, fieldName) => {
  if (!field.value.trim()) {
    displayFieldError(field, `${fieldName} es obligatorio.`);
    return false;
  }
  return true;
};

const validateEmailFormatTramite = (field) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(field.value.trim())) {
    displayFieldError(field, "Formato de email inválido.");
    return false;
  }
  return true;
};

const validateRUTTramiteInternal = (field) => {
  const validation = validateRUT(field.value);
  if (!validation.isValid) {
    displayFieldError(field, validation.message);
    return false;
  }
  return true;
};

const validateCheckboxCheckedTramite = (field, fieldName) => {
  if (!field.checked) {
    displayFieldError(field, `Debe aceptar ${fieldName}.`);
    return false;
  }
  return true;
};

// Función principal de validación para trámites
function validateTramiteField(field) {
  // Si el campo está vacío y no ha sido tocado, no mostrar errores
  if (
    field.value.trim() === "" &&
    !window.validationSystem?.touchedFields?.has(field)
  ) {
    clearFieldError(field);
    field.classList.remove("error", "valid");
    return true;
  }

  clearFieldError(field);
  let isValid = true;
  const fieldName =
    field
      .closest(".form-group")
      ?.querySelector("label")
      ?.textContent.replace(": *", "")
      .replace(":", "") || field.name;

  // Si es requerido y está vacío, es inválido
  if (field.required && !field.value.trim()) {
    displayFieldError(field, `${fieldName} es obligatorio.`);
    isValid = false;
  }

  if (isValid && field.type === "email" && field.value.trim() !== "") {
    if (!validateEmailFormatTramite(field)) isValid = false;
  }

  // Validación de RUT para cualquier campo que contenga "rut" en su ID o nombre
  if (
    isValid &&
    field.value.trim() !== "" &&
    (field.id.toLowerCase().includes("rut") ||
      field.name.toLowerCase().includes("rut"))
  ) {
    if (!validateRUTTramiteInternal(field)) isValid = false;
  }

  if (isValid && field.type === "checkbox" && field.required) {
    if (!validateCheckboxCheckedTramite(field, fieldName)) isValid = false;
  }

  // Si después de todas las validaciones el campo está vacío, no debe ser válido ni inválido
  if (field.value.trim() === "") {
    field.classList.remove("valid", "error");
    return true; // No continuar, pero no es un "error" si no es requerido
  }

  if (isValid) {
    markFieldAsValid(field);
  } else {
    field.classList.remove("valid");
    field.classList.add("error");
  }

  return isValid;
}

// --- Contact Form Specific Validations ---
const validateRequiredContact = (field, fieldName) => {
  if (!field.value.trim()) {
    displayFieldError(field, `${fieldName} es obligatorio.`);
    return false;
  }
  return true;
};

const validateEmailFormatContact = (field) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(field.value.trim())) {
    displayFieldError(field, "Formato de email inválido.");
    return false;
  }
  return true;
};

const validateMinLengthContact = (field, minLength, fieldName) => {
  if (field.value.trim().length < minLength) {
    displayFieldError(
      field,
      `${fieldName} debe tener al menos ${minLength} caracteres.`
    );
    return false;
  }
  return true;
};

// Función principal de validación para contacto
function validateContactField(field) {
  // Si el campo está vacío y no ha sido tocado por el sistema de validación, no mostrar errores
  if (
    field.value.trim() === "" &&
    !window.validationSystem?.touchedFields?.has(field)
  ) {
    clearFieldError(field);
    // Limpiar completamente todas las clases de validación
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
    // Asegurar que el campo tenga el estilo por defecto
    field.style.borderColor = "";
    field.style.borderWidth = "";
    return true;
  }

  clearFieldError(field);
  field.classList.remove("form-field-success"); // Ensure success is also cleared
  let isValid = true;
  const fieldName =
    field
      .closest(".form-group")
      ?.querySelector("label")
      ?.textContent.replace(": *", "")
      .replace(":", "") || field.name;

  if (field.required && !validateRequiredContact(field, fieldName))
    isValid = false;

  if (isValid && field.type === "email" && field.value.trim() !== "") {
    if (!validateEmailFormatContact(field)) isValid = false;
  }

  // Validación de RUT para cualquier campo que contenga "rut" en su ID o nombre
  if (
    isValid &&
    field.value.trim() !== "" &&
    (field.id.toLowerCase().includes("rut") ||
      field.name.toLowerCase().includes("rut"))
  ) {
    if (!validateRUTTramiteInternal(field)) isValid = false;
  }

  if (isValid && field.id === "mensaje-contacto" && field.value.trim() !== "") {
    const minLength = parseInt(field.getAttribute("minlength"), 10);
    if (!validateMinLengthContact(field, minLength, fieldName)) isValid = false;
  }

  if (
    (isValid &&
      field.value.trim() !== "" &&
      field.type !== "checkbox" &&
      field.type !== "select-one") ||
    (field.type === "checkbox" && field.checked) ||
    (field.type === "select-one" && field.value !== "")
  ) {
    markFieldAsValid(field);
  }
  return isValid;
}

// --- Seguimiento Form Specific Validations ---
const validateTrackingNumberFormat = (field) => {
  const value = field.value.trim();
  const regex = /^TR-\d+$/; // Formato estándar: TR-{timestamp}

  if (!regex.test(value)) {
    displayFieldError(
      field,
      "Formato incorrecto. El formato esperado es TR- seguido de números (ej: TR-1678886400000)."
    );
    return false;
  }
  return true;
};

// Se agrega una función global para la validación de seguimiento, ya que este archivo es standalone
function validateSeguimientoField(field) {
  if (
    field.value.trim() === "" &&
    !window.validationSystem?.touchedFields?.has(field)
  ) {
    clearFieldError(field);
    field.classList.remove("error", "valid");
    return true;
  }

  clearFieldError(field);
  let isValid = true;

  if (field.required && !field.value.trim()) {
    displayFieldError(field, "El número de trámite es obligatorio.");
    isValid = false;
  }

  if (isValid && field.value.trim()) {
    if (!validateTrackingNumberFormat(field)) {
      isValid = false;
    }
  }

  if (isValid && field.value.trim()) {
    markFieldAsValid(field);
  }

  return isValid;
}

// Exponer funciones globalmente
window.validateTramiteField = validateTramiteField;
window.validateContactField = validateContactField;
window.displayFieldError = displayFieldError;
window.clearFieldError = clearFieldError;
window.markFieldAsValid = markFieldAsValid;
window.validateRUT = validateRUT;
window.formatRUT = formatRUT;

// Función para inicializar el formateo de RUT en todos los campos
function initializeRUTFormatting() {
  // Buscar todos los campos que contengan "rut" en su ID o nombre
  const rutFields = document.querySelectorAll(
    'input[id*="rut"], input[name*="rut"]'
  );

  console.log("Campos de RUT encontrados:", rutFields.length);

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

  // Verificar que los estilos CSS estén cargados
  setTimeout(() => {
    const testElement = document.createElement("div");
    testElement.className = "error-message";
    testElement.textContent = "Test";
    testElement.style.position = "absolute";
    testElement.style.left = "-9999px";
    document.body.appendChild(testElement);

    const computedStyle = window.getComputedStyle(testElement);
    console.log("Color del error-message:", computedStyle.color);
    console.log("Display del error-message:", computedStyle.display);

    document.body.removeChild(testElement);
  }, 100);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeRUTFormatting);
} else {
  initializeRUTFormatting();
}
