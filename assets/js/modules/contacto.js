// assets/js/modules/contacto.js

class ContactoForm {
  constructor() {
    this.form = document.getElementById("contact-form");
    this.feedback = document.getElementById("form-feedback-contact");
    this.inputs = {
      nombre: this.form.querySelector("#nombre-contacto"),
      email: this.form.querySelector("#email-contacto"),
      tipo: this.form.querySelector("#tipo-consulta"),
      mensaje: this.form.querySelector("#mensaje-contacto"),
      copia: this.form.querySelector("#copia-email-contacto"),
    };
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.form.addEventListener("input", (e) => this.clearError(e.target));
  }

  validar() {
    let valido = true;
    // Nombre
    if (!this.inputs.nombre.value.trim()) {
      this.setError(this.inputs.nombre, "El nombre es obligatorio.");
      valido = false;
    }
    // Email
    if (!this.inputs.email.value.trim()) {
      this.setError(this.inputs.email, "El email es obligatorio.");
      valido = false;
    } else if (!this.validarEmail(this.inputs.email.value)) {
      this.setError(this.inputs.email, "Ingrese un email válido.");
      valido = false;
    }
    // Tipo de consulta
    if (!this.inputs.tipo.value) {
      this.setError(this.inputs.tipo, "Seleccione el tipo de consulta.");
      valido = false;
    }
    // Mensaje
    if (!this.inputs.mensaje.value.trim()) {
      this.setError(this.inputs.mensaje, "El mensaje es obligatorio.");
      valido = false;
    } else if (this.inputs.mensaje.value.trim().length < 20) {
      this.setError(
        this.inputs.mensaje,
        "El mensaje debe tener al menos 20 caracteres."
      );
      valido = false;
    }
    return valido;
  }

  setError(input, mensaje) {
    const errorDiv = input
      .closest(".form-group")
      .querySelector(".error-message");
    errorDiv.textContent = mensaje;
    input.classList.add("input-error");
  }

  clearError(input) {
    if (!input.closest) return;
    const errorDiv = input
      .closest(".form-group")
      .querySelector(".error-message");
    errorDiv.textContent = "";
    input.classList.remove("input-error");
  }

  validarEmail(email) {
    // Simple regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  mostrarFeedback(mensaje, tipo = "success") {
    this.feedback.innerHTML = `<div class="form-feedback ${tipo}"><span class="material-symbols-outlined">${
      tipo === "success" ? "check_circle" : "error"
    }</span> ${mensaje}</div>`;
    this.feedback.style.display = "block";
    setTimeout(() => {
      this.feedback.style.display = "none";
      this.feedback.innerHTML = "";
    }, 3500);
  }

  limpiarFormulario() {
    this.form.reset();
    Object.values(this.inputs).forEach((input) => this.clearError(input));
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.feedback.style.display = "none";
    let valido = this.validar();
    if (!valido) return;

    // Simular envío
    const submitButton = this.form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<span class="material-symbols-outlined">hourglass_empty</span> Enviando...';

    this.mostrarFeedback("Enviando mensaje...", "info");

    // Simular latencia de red
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mensaje de éxito más completo con botón de cerrar
    const mensajeExito = `
      <div class="success-message">
        <div class="success-header">
          <span class="material-symbols-outlined">check_circle</span>
          <h4>¡Mensaje Enviado Exitosamente!</h4>
          <button class="close-success-btn" onclick="this.closest('.success-message').remove(); this.closest('#form-feedback-contact').style.display='none';">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="success-details">
          <p><strong>Su consulta ha sido recibida y será procesada.</strong></p>
          <ul>
            <li>• Recibirá una confirmación por email en los próximos minutos</li>
            <li>• Nuestro equipo responderá en un plazo máximo de 24-48 horas</li>
            <li>• Para consultas urgentes, puede contactarnos al 600 570 70 40</li>
          </ul>
          <p><em>Gracias por contactar con el Portal de Gestión Aduanera.</em></p>
        </div>
      </div>
    `;

    this.feedback.innerHTML = mensajeExito;
    this.feedback.style.display = "block";

    // Rehabilitar botón
    submitButton.disabled = false;
    submitButton.innerHTML =
      '<span data-translate-key="contact_form_submit_button">Enviar Mensaje</span>';

    // Limpiar formulario inmediatamente
    this.limpiarFormulario();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("contact-form")) {
    new ContactoForm();
  }
});
