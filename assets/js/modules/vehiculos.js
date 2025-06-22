// Módulo de Gestión de Vehículos
class ModuloVehiculos {
  constructor() {
    this.form = document.getElementById("formVehiculo");
    this.processButtons = document.querySelectorAll(".process-btn");
    this.resultsPanel = document.getElementById("resultsPanel");
    this.resultsContent = document.getElementById("resultsContent");
    this.closeResults = document.getElementById("closeResults");

    this.currentProcess = "entrada";
    this.vehiculos = JSON.parse(localStorage.getItem("vehiculos") || "[]");

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupFileUploads();
    this.setupValidations();
    this.updateFormForProcess();
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

    // Cambios en tipo de vehículo
    document.getElementById("tipoVehiculo").addEventListener("change", (e) => {
      this.handleTipoVehiculoChange(e.target.value);
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
    // Validación de patente
    document.getElementById("patente").addEventListener("blur", (e) => {
      this.validarPatente(e.target.value);
    });

    // Validación de RUT propietario
    document.getElementById("rutPropietario").addEventListener("blur", (e) => {
      this.validarRUT(e.target.value, "rutPropietarioError");
    });

    // Validación de email
    document
      .getElementById("emailPropietario")
      .addEventListener("blur", (e) => {
        this.validarEmail(e.target.value);
      });

    // Validación de fecha de viaje
    document.getElementById("fechaViaje").addEventListener("change", (e) => {
      this.validarFechaViaje(e.target.value);
    });
  }

  updateFormForProcess() {
    const formTitle = document.querySelector(".page-header h2");
    const formDescription = document.querySelector(".page-header p");
    const infoEspecifica = document.getElementById("infoEspecifica");
    const contenidoEspecifico = document.getElementById("contenidoEspecifico");

    switch (this.currentProcess) {
      case "entrada":
        formTitle.textContent = "Entrada de Vehículo";
        formDescription.textContent =
          "Procese la entrada de un vehículo con validación automática de documentación";
        this.mostrarInfoEntrada(contenidoEspecifico);
        infoEspecifica.style.display = "block";
        break;
      case "salida":
        formTitle.textContent = "Salida de Vehículo";
        formDescription.textContent =
          "Procese la salida de un vehículo con validación automática de documentación";
        this.mostrarInfoSalida(contenidoEspecifico);
        infoEspecifica.style.display = "block";
        break;
      case "permiso-temporal":
        formTitle.textContent = "Permiso Temporal de Vehículo";
        formDescription.textContent =
          "Solicite un permiso temporal para circulación de vehículos";
        this.mostrarInfoPermisoTemporal(contenidoEspecifico);
        infoEspecifica.style.display = "block";
        break;
      case "diplomatico":
        formTitle.textContent = "Vehículo Diplomático";
        formDescription.textContent =
          "Procese vehículos diplomáticos con placas especiales";
        this.mostrarInfoDiplomatico(contenidoEspecifico);
        infoEspecifica.style.display = "block";
        break;
    }
  }

  mostrarInfoEntrada(contenedor) {
    contenedor.innerHTML = `
            <div class="form-group">
                <label for="puntoEntrada">Punto de Entrada *</label>
                <select id="puntoEntrada" name="puntoEntrada" required>
                    <option value="">Seleccione...</option>
                    <option value="aeropuerto">Aeropuerto</option>
                    <option value="puerto">Puerto</option>
                    <option value="paso_fronterizo">Paso Fronterizo</option>
                </select>
            </div>
            <div class="form-group">
                <label for="conductorRut">RUT del Conductor</label>
                <input type="text" id="conductorRut" name="conductorRut" placeholder="12345678-9">
            </div>
            <div class="form-group">
                <label for="conductorNombre">Nombre del Conductor</label>
                <input type="text" id="conductorNombre" name="conductorNombre">
            </div>
        `;
  }

  mostrarInfoSalida(contenedor) {
    contenedor.innerHTML = `
            <div class="form-group">
                <label for="puntoSalida">Punto de Salida *</label>
                <select id="puntoSalida" name="puntoSalida" required>
                    <option value="">Seleccione...</option>
                    <option value="aeropuerto">Aeropuerto</option>
                    <option value="puerto">Puerto</option>
                    <option value="paso_fronterizo">Paso Fronterizo</option>
                </select>
            </div>
            <div class="form-group">
                <label for="motivoSalida">Motivo de Salida *</label>
                <select id="motivoSalida" name="motivoSalida" required>
                    <option value="">Seleccione...</option>
                    <option value="retorno">Retorno al país de origen</option>
                    <option value="transito">Tránsito a otro país</option>
                    <option value="venta">Venta del vehículo</option>
                    <option value="otro">Otro</option>
                </select>
            </div>
        `;
  }

  mostrarInfoPermisoTemporal(contenedor) {
    contenedor.innerHTML = `
            <div class="form-group">
                <label for="tipoPermiso">Tipo de Permiso *</label>
                <select id="tipoPermiso" name="tipoPermiso" required>
                    <option value="">Seleccione...</option>
                    <option value="180_dias">180 días corridos</option>
                    <option value="acuerdo_chile_argentina">Acuerdo Chile-Argentina</option>
                    <option value="diplomatico_90_dias">Diplomático (90 días)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="fechaInicioPermiso">Fecha de Inicio *</label>
                <input type="date" id="fechaInicioPermiso" name="fechaInicioPermiso" required>
            </div>
            <div class="form-group">
                <label for="motivoPermiso">Motivo del Permiso *</label>
                <textarea id="motivoPermiso" name="motivoPermiso" rows="3" required></textarea>
            </div>
        `;
  }

  mostrarInfoDiplomatico(contenedor) {
    contenedor.innerHTML = `
            <div class="form-group">
                <label for="placaDiplomatica">Placa Diplomática *</label>
                <input type="text" id="placaDiplomatica" name="placaDiplomatica" placeholder="CD-1234" required>
            </div>
            <div class="form-group">
                <label for="misionDiplomatica">Misión Diplomática *</label>
                <input type="text" id="misionDiplomatica" name="misionDiplomatica" required>
            </div>
            <div class="form-group">
                <label for="credencialDiplomatica">Credencial Diplomática *</label>
                <div class="file-upload-container">
                    <input type="file" id="credencialDiplomatica" name="credencialDiplomatica" accept=".pdf,.jpg,.png,.jpeg" required>
                    <div class="file-upload-preview" id="filePreviewCredencial">
                        <span class="material-symbols-outlined">upload_file</span>
                        <span>Haga clic para seleccionar archivo</span>
                    </div>
                </div>
            </div>
        `;
  }

  handleTipoVehiculoChange(tipo) {
    const camposDiplomaticos = document.querySelectorAll('[id*="diplomatica"]');
    const camposDiplomaticosContainers = document
      .querySelectorAll('[id*="diplomatica"]')
      .forEach((el) => {
        const container = el.closest(".form-group");
        if (container) {
          container.style.display = tipo === "diplomatico" ? "block" : "none";
        }
      });
  }

  validarPatente(patente) {
    const errorElement = document.getElementById("patenteError");

    if (!patente) {
      this.mostrarError(errorElement, "La patente es obligatoria");
      return false;
    }

    // Validar formato de patente chilena o extranjera
    const patrones = {
      chilena: /^[A-Z]{4}\d{2}$/,
      chilenaNueva: /^[A-Z]{4}\d{3}$/,
      extranjera: /^[A-Z0-9]{4,8}$/,
      diplomatica: /^CD-\d{4}$/,
    };

    const esValida = Object.values(patrones).some((patron) =>
      patron.test(patente)
    );

    if (!esValida) {
      this.mostrarError(errorElement, "Formato de patente inválido");
      return false;
    }

    this.mostrarExito(errorElement, "Patente válida");
    return true;
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

  validarEmail(email) {
    const errorElement = document.getElementById("emailPropietarioError");

    if (!email) {
      this.mostrarExito(errorElement, ""); // Email es opcional
      return true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.mostrarError(errorElement, "Formato de email inválido");
      return false;
    }

    this.mostrarExito(errorElement, "Email válido");
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
    const formData = new FormData(this.form);
    const datos = Object.fromEntries(formData.entries());

    // Validaciones adicionales
    if (!this.validarFormularioCompleto(datos)) {
      return;
    }

    // Simular procesamiento
    this.mostrarCargando();

    try {
      const resultado = await this.simularProcesamiento(datos);
      this.mostrarResultado(resultado);
      this.guardarSolicitud(datos, resultado); // Actualizado a guardarSolicitud
    } catch (error) {
      this.mostrarError(resultado, error.message);
    }
  }

  validarFormularioCompleto(datos) {
    const camposRequeridos = [
      "patente",
      "marca",
      "modelo",
      "ano",
      "color",
      "tipoVehiculo",
      "paisOrigen",
      "rutPropietario",
      "nombresPropietario",
      "apellidosPropietario",
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

  async simularProcesamiento(datos) {
    // Simular latencia de red
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simular validaciones del sistema
    const validaciones = {
      patenteValida: Math.random() > 0.05, // 95% de éxito
      documentosCompletos: Math.random() > 0.1, // 90% de éxito
      antecedentes: Math.random() > 0.95, // 5% con antecedentes
      restricciones: Math.random() > 0.98, // 2% con restricciones
    };

    if (!validaciones.patenteValida) {
      throw new Error("Patente no válida o con restricciones");
    }

    if (!validaciones.documentosCompletos) {
      throw new Error("Documentación incompleta o ilegible");
    }

    if (validaciones.antecedentes) {
      throw new Error(
        "Se encontraron antecedentes que requieren revisión manual"
      );
    }

    if (validaciones.restricciones) {
      throw new Error("El vehículo tiene restricciones de circulación");
    }

    // Generar número de solicitud
    const numeroSolicitud = "VEH-" + Date.now().toString().slice(-6);

    // Calcular fecha de vencimiento según tipo de proceso
    let fechaVencimiento = null;
    if (this.currentProcess === "permiso-temporal") {
      const tipoPermiso = datos.tipoPermiso;
      const fechaInicio = new Date(datos.fechaInicioPermiso);

      switch (tipoPermiso) {
        case "180_dias":
          fechaVencimiento = new Date(
            fechaInicio.getTime() + 180 * 24 * 60 * 60 * 1000
          );
          break;
        case "diplomatico_90_dias":
          fechaVencimiento = new Date(
            fechaInicio.getTime() + 90 * 24 * 60 * 60 * 1000
          );
          break;
        case "acuerdo_chile_argentina":
          fechaVencimiento = new Date(
            fechaInicio.getTime() + 365 * 24 * 60 * 60 * 1000
          );
          break;
      }
    }

    return {
      estado: "aprobado",
      numeroSolicitud: numeroSolicitud,
      fechaProcesamiento: new Date().toLocaleString("es-CL"),
      validaciones: validaciones,
      observaciones: "Solicitud procesada exitosamente",
      fechaVencimiento: fechaVencimiento
        ? fechaVencimiento.toLocaleDateString("es-CL")
        : null,
      codigoQR: this.generarCodigoQR(numeroSolicitud),
    };
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
                <p>Procesando solicitud vehicular...</p>
            </div>
        `;
    this.resultsPanel.style.display = "block";
  }

  mostrarResultado(resultado) {
    // El campo fechaVencimiento es específico de vehículos y no está en el template estándar.
    // Se podría agregar aquí si es necesario, o manejarlo de otra forma si el template es estricto.
    // Por ahora, lo omitiré para adherirme al template proporcionado.
    /*
        let fechaVencimientoHTML = "";
        if (resultado.fechaVencimiento) {
            fechaVencimientoHTML = `
            <div class="detail-item">
                <strong>Fecha de Vencimiento:</strong>
                <span>${resultado.fechaVencimiento}</span>
            </div>
            `;
        }
        */

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
                    {/* Aquí podría ir fechaVencimientoHTML si se decide incluirlo */}
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
                <button class="btn-primary" onclick="moduloVehiculos.nuevaSolicitud()">
                    <span class="material-symbols-outlined">add</span>
                    Nueva Solicitud
                </button>
            </div>
        `;
  }

  mostrarError(resultado, mensaje) {
    // El parámetro resultado no se usa en la plantilla original, pero puede ser útil si el mensaje depende de ello.
    // Lo mantendré por si acaso, pero el mensaje vendrá de 'mensaje'.
    this.resultsContent.innerHTML = `
            <div class="validation-status error">
                <span class="material-symbols-outlined">error</span>
                <div>
                    <strong>Error en el Procesamiento</strong>
                    <p>${mensaje}</p>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn-secondary" onclick="moduloVehiculos.resultsPanel.style.display='none'">
                    <span class="material-symbols-outlined">close</span>
                    Cerrar
                </button>
                <button class="btn-primary" onclick="moduloVehiculos.revisarFormulario()">
                    <span class="material-symbols-outlined">edit</span>
                    Revisar Formulario
                </button>
            </div>
        `;
  }

  guardarSolicitud(datos, resultado) {
    // Renombrada de guardarVehiculo a guardarSolicitud
    const solicitud = {
      // Cambiado de vehiculo a solicitud
      id: Date.now(),
      datos: datos,
      resultado: resultado,
      fecha: new Date().toISOString(),
      proceso: this.currentProcess,
    };

    this.vehiculos.push(solicitud); // Sigue usando this.vehiculos como array interno
    localStorage.setItem(
      "solicitudesVehiculos",
      JSON.stringify(this.vehiculos)
    ); // Clave de localStorage actualizada

    // Guardar en el storage centralizado para seguimiento
    if (typeof saveTramiteSubmission === "function") {
      saveTramiteSubmission({
        numeroTramite:
          resultado.numeroSolicitud ||
          (solicitud.id ? "VEH-" + solicitud.id.toString().slice(-6) : ""),
        tipoTramite: "vehiculo",
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
    this.updateFormForProcess();
  }

  guardarBorrador() {
    const formData = new FormData(this.form);
    const datos = Object.fromEntries(formData.entries());

    localStorage.setItem(
      "borradorVehiculos",
      JSON.stringify({
        datos: datos,
        fecha: new Date().toISOString(),
        proceso: this.currentProcess,
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

  mostrarMensajeVisual(mensaje, tipo = "success") {
    // No hacer nada: se elimina la tarjeta visual de mensaje general.
  }
}

// Inicializar módulo cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  window.moduloVehiculos = new ModuloVehiculos();
});
