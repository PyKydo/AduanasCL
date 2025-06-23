// Módulo de Gestión de Menores
class ModuloMenores {
  constructor() {
    this.form = document.getElementById("formMenor");
    this.processButtons = document.querySelectorAll(".process-btn");
    this.resultsPanel = document.getElementById("resultsPanel");
    this.resultsContent = document.getElementById("resultsContent");
    this.closeResults = document.getElementById("closeResults");

    this.currentProcess = "entrada";
    this.solicitudes = JSON.parse(
      localStorage.getItem("solicitudesMenores") || "[]"
    );

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupFileUploads();
    this.setupValidations();
  }

  setupEventListeners() {
    // Botones de proceso
    this.processButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.processButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentProcess = btn.dataset.process;
        this.updateFormForProcess();
      });
    });

    // Formulario
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.procesarSolicitud();
    });

    // Botones de acción
    document.getElementById("btnLimpiar").addEventListener("click", () => {
      this.limpiarFormulario();
    });

    document
      .getElementById("btnGuardarBorrador")
      .addEventListener("click", () => {
        this.guardarBorrador();
      });

    // Cerrar panel de resultados
    this.closeResults.addEventListener("click", () => {
      this.resultsPanel.style.display = "none";
    });
  }

  setupFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');

    fileInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        this.handleFileUpload(e.target);
      });
    });
  }

  setupValidations() {
    // Validación de RUT
    document.getElementById("rutMenor").addEventListener("blur", (e) => {
      this.validarRUT(e.target.value, "rutMenorError");
    });

    document.getElementById("rutAcompanante").addEventListener("blur", (e) => {
      this.validarRUT(e.target.value, "rutAcompananteError");
    });

    // Validación de fecha de nacimiento
    document
      .getElementById("fechaNacimiento")
      .addEventListener("change", (e) => {
        this.validarFechaNacimiento(e.target.value);
      });

    // Validación de fecha de viaje
    document.getElementById("fechaViaje").addEventListener("change", (e) => {
      this.validarFechaViaje(e.target.value);
    });
  }

  updateFormForProcess() {
    const formTitle = document.querySelector(".page-header h2");
    const formDescription = document.querySelector(".page-header p");

    switch (this.currentProcess) {
      case "entrada":
        formTitle.textContent = "Entrada de Menor de Edad";
        formDescription.textContent =
          "Procese la entrada de un menor de edad con validación automática de documentación";
        break;
      case "salida":
        formTitle.textContent = "Salida de Menor de Edad";
        formDescription.textContent =
          "Procese la salida de un menor de edad con validación automática de documentación";
        break;
      case "autorizacion":
        formTitle.textContent = "Nueva Autorización de Menor";
        formDescription.textContent =
          "Registre una nueva autorización para viajes de menores de edad";
        break;
    }
  }

  validarRUT(rut, errorElementId) {
    const errorElement = document.getElementById(errorElementId);

    if (!rut) {
      this.mostrarError(errorElement, "El RUT es obligatorio");
      return false;
    }

    // Validar formato básico
    const rutLimpio = rut.replace(/[.-]/g, "");
    if (rutLimpio.length < 7 || rutLimpio.length > 8) {
      this.mostrarError(errorElement, "El RUT debe tener 7 u 8 dígitos");
      return false;
    }

    // Validar dígito verificador
    const dv = rutLimpio.slice(-1);
    const numero = rutLimpio.slice(0, -1);

    let suma = 0;
    let multiplicador = 2;

    for (let i = numero.length - 1; i >= 0; i--) {
      suma += parseInt(numero[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvCalculado = 11 - (suma % 11);
    const dvEsperado =
      dvCalculado === 11
        ? "0"
        : dvCalculado === 10
        ? "K"
        : dvCalculado.toString();

    if (dv.toUpperCase() !== dvEsperado) {
      this.mostrarError(errorElement, "El dígito verificador no es válido");
      return false;
    }

    this.mostrarExito(errorElement, "RUT válido");
    return true;
  }

  validarFechaNacimiento(fecha) {
    const errorElement = document.getElementById("fechaNacimientoError");
    const fechaNac = new Date(fecha);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();

    if (edad >= 18) {
      this.mostrarError(errorElement, "La persona debe ser menor de 18 años");
      return false;
    }

    if (edad < 0) {
      this.mostrarError(
        errorElement,
        "La fecha de nacimiento no puede ser futura"
      );
      return false;
    }

    this.mostrarExito(errorElement, `Edad: ${edad} años`);
    return true;
  }

  validarFechaViaje(fecha) {
    const errorElement = document.getElementById("fechaViajeError");
    const fechaViaje = new Date(fecha);
    const hoy = new Date();

    if (fechaViaje < hoy) {
      this.mostrarError(errorElement, "La fecha del viaje no puede ser pasada");
      return false;
    }

    this.mostrarExito(errorElement, "Fecha válida");
    return true;
  }

  mostrarError(element, mensaje) {
    element.textContent = mensaje;
    element.className = "validation-message";
  }

  mostrarExito(element, mensaje) {
    element.textContent = mensaje;
    element.className = "validation-message valid";
  }

  handleFileUpload(input) {
    const file = input.files[0];
    const preview = input.parentElement.querySelector(".file-upload-preview");

    if (file) {
      preview.innerHTML = `
                <span class="material-symbols-outlined">description</span>
                <span>${file.name}</span>
                <small>${(file.size / 1024).toFixed(1)} KB</small>
            `;
      preview.style.color = "var(--success-color)";
    }
  }

  async procesarSolicitud() {
    const submitButton = this.form.querySelector('button[type="submit"]');
    if (submitButton.disabled) return;

    const formData = new FormData(this.form);
    const datos = Object.fromEntries(formData.entries());

    // Validaciones adicionales
    if (!this.validarFormularioCompleto(datos)) {
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML =
      '<span class="material-symbols-outlined">hourglass_empty</span> Procesando...';

    // Simular procesamiento
    this.mostrarCargando();

    try {
      const resultado = await this.simularProcesamiento(datos);
      this.mostrarResultado(resultado);
      this.guardarSolicitud(datos, resultado);
      this.mostrarMensajeExitoFormulario();

      // Limpiar formulario después de 3 segundos, similar a SAG
      setTimeout(() => {
        this.form.reset();
        this.setupFileUploads(); // Reiniciar previews de archivos
        submitButton.disabled = false;
        submitButton.innerHTML =
          '<span class="material-symbols-outlined">send</span> Procesar Solicitud';
      }, 3000);
    } catch (error) {
      this.mostrarError(null, error.message);
      this.resultsPanel.style.display = "block";
      submitButton.disabled = false;
      submitButton.innerHTML =
        '<span class="material-symbols-outlined">send</span> Procesar Solicitud';
    }
  }

  validarFormularioCompleto(datos) {
    const camposRequeridos = [
      "rutMenor",
      "nombresMenor",
      "apellidosMenor",
      "fechaNacimiento",
      "nacionalidad",
      "tipoDocumento",
      "numeroDocumento",
      "rutAcompanante",
      "nombresAcompanante",
      "apellidosAcompanante",
      "relacionAcompanante",
      "tipoAutorizacion",
      "fechaViaje",
    ];

    for (const campo of camposRequeridos) {
      if (
        !datos[campo] ||
        (typeof datos[campo] === "string" && datos[campo].trim() === "")
      ) {
        this.mostrarMensajeVisual(`El campo ${campo} es obligatorio`, "error");
        return false;
      }
    }

    return true;
  }

  mostrarMensajeVisual(mensaje, tipo = "success") {
    const contenedor = document.getElementById("mensajeExitoMenores");
    const mensajeTexto = document.getElementById("mensajeTextoMenores");

    if (contenedor && mensajeTexto) {
      // Actualizar el texto del mensaje
      mensajeTexto.textContent = mensaje;

      // Cambiar el estilo según el tipo de mensaje
      const alertDiv = contenedor.querySelector(".alert");
      if (alertDiv) {
        if (tipo === "error") {
          alertDiv.style.background =
            "linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)";
          alertDiv.style.borderColor = "#f5c6cb";
          alertDiv.style.color = "#721c24";
          const icon = alertDiv.querySelector(".material-symbols-outlined");
          if (icon) {
            icon.textContent = "error";
            icon.style.color = "#dc3545";
          }
          const bar = alertDiv.querySelector(
            'div[style*="background: linear-gradient"]'
          );
          if (bar) {
            bar.style.background = "linear-gradient(90deg, #dc3545, #e74c3c)";
          }
        } else {
          alertDiv.style.background =
            "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)";
          alertDiv.style.borderColor = "#c3e6cb";
          alertDiv.style.color = "#155724";
          const icon = alertDiv.querySelector(".material-symbols-outlined");
          if (icon) {
            icon.textContent = "check_circle";
            icon.style.color = "#28a745";
          }
          const bar = alertDiv.querySelector(
            'div[style*="background: linear-gradient"]'
          );
          if (bar) {
            bar.style.background = "linear-gradient(90deg, #28a745, #20c997)";
          }
        }
      }

      // Mostrar el contenedor con animación
      contenedor.style.display = "block";
      contenedor.style.opacity = "0";
      contenedor.style.transform = "translateY(-10px)";

      // Animación de entrada
      setTimeout(() => {
        contenedor.style.transition = "all 0.3s ease";
        contenedor.style.opacity = "1";
        contenedor.style.transform = "translateY(0)";
      }, 10);

      // Ocultar después de 4 segundos con animación de salida
      setTimeout(() => {
        contenedor.style.opacity = "0";
        contenedor.style.transform = "translateY(-10px)";
        setTimeout(() => {
          contenedor.style.display = "none";
          contenedor.style.transition = "none";
        }, 300);
      }, 4000);
    }
  }

  async simularProcesamiento(datos) {
    // Simular latencia de red
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simular validaciones del sistema
    const validaciones = {
      edad: this.calcularEdad(datos.fechaNacimiento),
      documentoValido: Math.random() > 0.1, // 90% de éxito
      autorizacionValida: Math.random() > 0.05, // 95% de éxito
      antecedentes: Math.random() > 0.95, // 5% con antecedentes
    };

    if (!validaciones.documentoValido) {
      throw new Error("Documento de autorización inválido o ilegible");
    }

    if (!validaciones.autorizacionValida) {
      throw new Error("Autorización no válida para el tipo de viaje");
    }

    if (validaciones.antecedentes) {
      throw new Error(
        "Se encontraron antecedentes que requieren revisión manual"
      );
    }

    // Generar número de solicitud con formato estándar
    const timestamp = Date.now();
    const numeroSolicitud = `TR-${timestamp}`;

    return {
      estado: "aprobado",
      numeroSolicitud: numeroSolicitud,
      fechaProcesamiento: new Date().toLocaleString("es-CL"),
      validaciones: validaciones,
      observaciones: "Solicitud procesada exitosamente",
      codigoQR: this.generarCodigoQR(numeroSolicitud),
    };
  }

  calcularEdad(fechaNacimiento) {
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    return hoy.getFullYear() - fechaNac.getFullYear();
  }

  generarCodigoQR(texto) {
    // Simulación de generación de QR
    return `data:image/svg+xml;base64,${btoa(
      `<svg>QR Code for ${texto}</svg>`
    )}`;
  }

  mostrarCargando() {
    this.resultsContent.innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <p>Procesando solicitud...</p>
            </div>
        `;
    this.resultsPanel.style.display = "block";
  }

  mostrarResultado(resultado) {
    this.resultsContent.innerHTML = `
            <div class="validation-status success">
                <span class="material-symbols-outlined">check_circle</span>
                <div>
                    <strong>Solicitud Procesada Exitosamente</strong>
                    <p>Número de solicitud: ${resultado.numeroSolicitud}</p>
                </div>
            </div>
            
            <div class="result-details">
                <h4>Detalles del Procesamiento</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Estado:</strong>
                        <span class="status-approved">${resultado.estado.toUpperCase()}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Fecha:</strong>
                        <span>${resultado.fechaProcesamiento}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Tipo de Proceso:</strong>
                        <span>${this.currentProcess.toUpperCase()}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Observaciones:</strong>
                        <span>${resultado.observaciones}</span>
                    </div>
                </div>
            </div>
            
            <div class="qr-section">
                <h4>Código QR para Verificación</h4>
                <div class="qr-container">
                    <img src="${
                      resultado.codigoQR
                    }" alt="Código QR" style="width: 150px; height: 150px; border: 1px solid #ddd;">
                    <p>Escaneé este código para verificar la autorización</p>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn-secondary" onclick="window.print()">
                    <span class="material-symbols-outlined">print</span>
                    Imprimir Autorización
                </button>
                <button class="btn-primary" onclick="moduloMenores.nuevaSolicitud()">
                    <span class="material-symbols-outlined">add</span>
                    Nueva Solicitud
                </button>
            </div>
        `;
  }

  mostrarError(resultado, mensaje) {
    this.resultsContent.innerHTML = `
            <div class="validation-status error">
                <span class="material-symbols-outlined">error</span>
                <div>
                    <strong>Error en el Procesamiento</strong>
                    <p>${mensaje}</p>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn-secondary" onclick="moduloMenores.resultsPanel.style.display='none'">
                    <span class="material-symbols-outlined">close</span>
                    Cerrar
                </button>
                <button class="btn-primary" onclick="moduloMenores.revisarFormulario()">
                    <span class="material-symbols-outlined">edit</span>
                    Revisar Formulario
                </button>
            </div>
        `;
  }

  guardarSolicitud(datos, resultado) {
    const solicitud = {
      datos: datos,
      resultado: resultado,
      fecha: new Date().toISOString(),
      proceso: this.currentProcess,
    };

    this.solicitudes.push(solicitud);
    localStorage.setItem(
      "solicitudesMenores",
      JSON.stringify(this.solicitudes)
    );

    // Guardar en el storage centralizado para seguimiento con formato estándar
    if (typeof saveTramiteSubmission === "function") {
      saveTramiteSubmission({
        numeroTramite: resultado.numeroSolicitud,
        tipoTramite: "menor",
        estado: resultado.estado || "procesado",
        fecha: solicitud.fecha,
        datos: datos,
        observaciones: resultado.observaciones || "",
        proceso: this.currentProcess,
      });
    }
  }

  limpiarFormulario() {
    this.form.reset();
    document.querySelectorAll(".validation-message").forEach((el) => {
      el.textContent = "";
      el.className = "validation-message";
    });
    document.querySelectorAll(".file-upload-preview").forEach((el) => {
      el.innerHTML = `
                <span class="material-symbols-outlined">upload_file</span>
                <span>Haga clic para seleccionar archivo</span>
            `;
      el.style.color = "var(--text-secondary)";
    });
  }

  guardarBorrador() {
    const formData = new FormData(this.form);
    const datos = Object.fromEntries(formData.entries());

    localStorage.setItem(
      "borradorMenores",
      JSON.stringify({
        datos: datos,
        fecha: new Date().toISOString(),
      })
    );

    this.mostrarMensajeVisual("Borrador guardado exitosamente");
  }

  nuevaSolicitud() {
    this.limpiarFormulario();
    this.resultsPanel.style.display = "none";
  }

  revisarFormulario() {
    this.resultsPanel.style.display = "none";
    this.form.scrollIntoView({ behavior: "smooth" });
  }

  mostrarMensajeExitoFormulario() {
    const contenedor = document.getElementById("mensajeExitoMenores");
    const mensajeTexto = document.getElementById("mensajeTextoMenores");

    if (contenedor && mensajeTexto) {
      // Actualizar el texto del mensaje
      mensajeTexto.textContent = "Formulario enviado con éxito";

      // Mostrar el contenedor con animación
      contenedor.style.display = "block";
      contenedor.style.opacity = "0";
      contenedor.style.transform = "translateY(-10px)";

      // Animación de entrada
      setTimeout(() => {
        contenedor.style.transition = "all 0.3s ease";
        contenedor.style.opacity = "1";
        contenedor.style.transform = "translateY(0)";
      }, 10);

      // Ocultar después de 4 segundos con animación de salida
      setTimeout(() => {
        contenedor.style.opacity = "0";
        contenedor.style.transform = "translateY(-10px)";
        setTimeout(() => {
          contenedor.style.display = "none";
          contenedor.style.transition = "none";
        }, 300);
      }, 4000);
    }
  }
}

// Inicializar módulo cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  window.moduloMenores = new ModuloMenores();
});

// Estilos adicionales para el módulo
const styles = `
    .loading-container {
        text-align: center;
        padding: 40px;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--border-color);
        border-top: 4px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .result-details {
        margin: 20px 0;
    }
    
    .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 15px;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background: var(--background-color);
        border-radius: 6px;
    }
    
    .status-approved {
        color: var(--success-color);
        font-weight: 600;
    }
    
    .qr-section {
        text-align: center;
        margin: 20px 0;
        padding: 20px;
        background: var(--background-color);
        border-radius: 8px;
    }
    
    .action-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 20px;
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
