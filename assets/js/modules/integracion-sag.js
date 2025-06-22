// Módulo de Integración SAG
class IntegracionSAG {
  constructor() {
    this.form = document.getElementById("formSAG");
    this.processButtons = document.querySelectorAll(".process-btn");
    this.resultsPanel = document.getElementById("resultsPanel");
    this.resultsContent = document.getElementById("resultsContent");
    this.closeResults = document.getElementById("closeResults");
    this.queryPanel = document.getElementById("queryPanel");
    this.queryContent = document.getElementById("queryContent");
    this.closeQuery = document.getElementById("closeQuery");

    this.currentProcess = "productos-animales";
    this.declaraciones = JSON.parse(
      localStorage.getItem("declaracionesSAG") || "[]"
    );
    this.lastSync = new Date();

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupFileUploads();
    this.setupValidations();
    this.updateFormForProcess();
    this.updateLastSync();
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
      if (this.currentProcess === "consultar") {
        this.consultarEstado();
      } else {
        this.procesarDeclaracion();
      }
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

    // Cerrar paneles
    this.closeResults.addEventListener("click", () => {
      this.resultsPanel.style.display = "none";
    });

    this.closeQuery.addEventListener("click", () => {
      this.queryPanel.style.display = "none";
    });

    // Cambios en tipo de producto
    document.getElementById("tipoProducto").addEventListener("change", (e) => {
      this.handleTipoProductoChange(e.target.value);
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
    document.getElementById("rutDeclarante").addEventListener("blur", (e) => {
      this.validarRUT(e.target.value, "rutDeclaranteError");
    });

    // Validación de email
    document.getElementById("emailDeclarante").addEventListener("blur", (e) => {
      this.validarEmail(e.target.value);
    });

    // Validación de fecha de movimiento
    document
      .getElementById("fechaMovimiento")
      .addEventListener("change", (e) => {
        this.validarFechaMovimiento(e.target.value);
      });
  }

  updateFormForProcess() {
    const formTitle = document.querySelector(".page-header h2");
    const formDescription = document.querySelector(".page-header p");
    const infoProducto = document.getElementById("infoProducto");
    const infoMascotas = document.getElementById("infoMascotas");

    switch (this.currentProcess) {
      case "productos-animales":
        formTitle.textContent = "Declaración de Productos Animales - SAG";
        formDescription.textContent =
          "Gestionar declaraciones juradas de productos de origen animal";
        infoProducto.style.display = "block";
        infoMascotas.style.display = "none";
        break;
      case "productos-vegetales":
        formTitle.textContent = "Declaración de Productos Vegetales - SAG";
        formDescription.textContent =
          "Gestionar declaraciones juradas de productos de origen vegetal";
        infoProducto.style.display = "block";
        infoMascotas.style.display = "none";
        break;
      case "mascotas":
        formTitle.textContent = "Declaración de Mascotas - SAG";
        formDescription.textContent =
          "Gestionar declaraciones de mascotas para importación/exportación";
        infoProducto.style.display = "none";
        infoMascotas.style.display = "block";
        break;
      case "consultar":
        formTitle.textContent = "Consulta de Estado - SAG";
        formDescription.textContent =
          "Consultar el estado de declaraciones SAG procesadas";
        infoProducto.style.display = "none";
        infoMascotas.style.display = "none";
        break;
    }
  }

  handleTipoProductoChange(tipo) {
    const unidadMedida = document.getElementById("unidadMedida");
    const opciones = unidadMedida.querySelectorAll("option");

    // Mostrar/ocultar opciones según el tipo de producto
    opciones.forEach((opcion) => {
      if (opcion.value === "") return; // Mantener la opción "Seleccione..."

      switch (tipo) {
        case "carne":
        case "lacteos":
        case "huevos":
          opcion.style.display = ["kg", "g", "unidades", "docenas"].includes(
            opcion.value
          )
            ? ""
            : "none";
          break;
        case "miel":
          opcion.style.display = ["kg", "g", "l", "ml"].includes(opcion.value)
            ? ""
            : "none";
          break;
        case "frutas":
        case "verduras":
          opcion.style.display = ["kg", "g", "unidades", "cajas"].includes(
            opcion.value
          )
            ? ""
            : "none";
          break;
        case "granos":
        case "semillas":
          opcion.style.display = ["kg", "g"].includes(opcion.value)
            ? ""
            : "none";
          break;
        case "flores":
          opcion.style.display = ["unidades", "docenas", "cajas"].includes(
            opcion.value
          )
            ? ""
            : "none";
          break;
        default:
          opcion.style.display = "";
      }
    });
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
    const errorElement = document.getElementById("emailDeclaranteError");

    if (!email) {
      this.mostrarError(errorElement, "El email es obligatorio");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.mostrarError(errorElement, "Formato de email inválido");
      return false;
    }

    this.mostrarExito(errorElement, "Email válido");
    return true;
  }

  validarFechaMovimiento(fecha) {
    const errorElement = document.getElementById("fechaMovimientoError");
    const fechaMovimiento = new Date(fecha);
    const hoy = new Date();

    if (fechaMovimiento < hoy) {
      this.mostrarError(
        errorElement,
        "La fecha del movimiento no puede ser pasada"
      );
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

  async procesarDeclaracion() {
    const formData = new FormData(this.form);
    const datos = Object.fromEntries(formData.entries());

    // Validaciones adicionales
    if (!this.validarFormularioCompleto(datos)) {
      return;
    }

    // Simular procesamiento
    this.mostrarCargando();

    try {
      const resultado = await this.simularProcesamientoSAG(datos);
      this.mostrarResultado(resultado);
      this.guardarSolicitud(datos, resultado); // Actualizado a guardarSolicitud
    } catch (error) {
      this.mostrarError(resultado, error.message);
    }
  }

  async consultarEstado() {
    const formData = new FormData(this.form);
    const datos = Object.fromEntries(formData.entries());

    if (!datos.rutDeclarante) {
      alert("Debe ingresar el RUT del declarante para consultar");
      return;
    }

    this.mostrarCargandoConsulta();

    try {
      const resultado = await this.simularConsultaSAG(datos);
      this.mostrarResultadoConsulta(resultado);
    } catch (error) {
      this.mostrarErrorConsulta(error.message);
    }
  }

  validarFormularioCompleto(datos) {
    const camposRequeridos = [
      "rutDeclarante",
      "nombresDeclarante",
      "apellidosDeclarante",
      "emailDeclarante",
      "tipoMovimiento",
      "fechaMovimiento",
    ];

    // Agregar campos específicos según el tipo de proceso
    if (this.currentProcess === "mascotas") {
      camposRequeridos.push("especieMascota");
    } else {
      camposRequeridos.push(
        "tipoProducto",
        "cantidad",
        "unidadMedida",
        "paisOrigen"
      );
    }

    for (const campo of camposRequeridos) {
      // Refuerzo: tratar como vacío si el valor es undefined, null o solo espacios
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

  async simularProcesamientoSAG(datos) {
    // Simular latencia de red
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simular validaciones del SAG
    const validaciones = {
      certificadoValido: Math.random() > 0.05, // 95% de éxito
      productoAutorizado: Math.random() > 0.1, // 90% de éxito
      requisitosSanitarios: Math.random() > 0.05, // 95% de éxito
      restricciones: Math.random() > 0.98, // 2% con restricciones
    };

    if (!validaciones.certificadoValido) {
      throw new Error("Certificado sanitario inválido o vencido");
    }

    if (!validaciones.productoAutorizado) {
      throw new Error("Producto no autorizado para importación/exportación");
    }

    if (!validaciones.requisitosSanitarios) {
      throw new Error("No cumple con los requisitos sanitarios requeridos");
    }

    if (validaciones.restricciones) {
      throw new Error(
        "El producto tiene restricciones especiales que requieren revisión manual"
      );
    }

    // Generar número de declaración
    const numeroDeclaracion = "SAG-" + Date.now().toString().slice(-6);

    return {
      estado: "aprobado",
      numeroDeclaracion: numeroDeclaracion,
      numeroSolicitud: numeroDeclaracion,
      fechaProcesamiento: new Date().toLocaleString("es-CL"),
      validaciones: validaciones,
      observaciones: "Declaración procesada exitosamente por el SAG",
      codigoQR: this.generarCodigoQR(numeroDeclaracion),
      fechaVencimiento: this.calcularFechaVencimiento(datos.tipoProducto),
    };
  }

  async simularConsultaSAG(datos) {
    // Simular latencia de red
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Buscar declaraciones existentes
    const declaracionesUsuario = this.declaraciones.filter(
      (d) => d.datos.rutDeclarante === datos.rutDeclarante
    );

    if (declaracionesUsuario.length === 0) {
      throw new Error("No se encontraron declaraciones para el RUT ingresado");
    }

    return {
      totalDeclaraciones: declaracionesUsuario.length,
      declaraciones: declaracionesUsuario.map((d) => ({
        numero: d.resultado.numeroDeclaracion,
        fecha: d.fecha,
        estado: d.resultado.estado,
        tipo: d.datos.tipoProducto || d.datos.especieMascota,
        observaciones: d.resultado.observaciones,
      })),
    };
  }

  calcularFechaVencimiento(tipoProducto) {
    const hoy = new Date();
    let diasVencimiento = 30; // Por defecto 30 días

    // Ajustar según tipo de producto
    switch (tipoProducto) {
      case "carne":
      case "lacteos":
      case "huevos":
        diasVencimiento = 7;
        break;
      case "miel":
        diasVencimiento = 90;
        break;
      case "frutas":
      case "verduras":
        diasVencimiento = 15;
        break;
      case "granos":
      case "semillas":
        diasVencimiento = 180;
        break;
      case "flores":
        diasVencimiento = 5;
        break;
    }

    const fechaVencimiento = new Date(
      hoy.getTime() + diasVencimiento * 24 * 60 * 60 * 1000
    );
    return fechaVencimiento.toLocaleDateString("es-CL");
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
                <p>Procesando declaración SAG...</p>
                <small>Conectando con el Servicio Agrícola y Ganadero</small>
            </div>
        `;
    this.resultsPanel.style.display = "block";
  }

  mostrarCargandoConsulta() {
    this.queryContent.innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <p>Consultando estado en SAG...</p>
                <small>Buscando declaraciones registradas</small>
            </div>
        `;
    this.queryPanel.style.display = "block";
  }

  mostrarResultado(resultado) {
    // El campo fechaVencimiento es específico de SAG y no está en el template estándar.
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
                    <p>Número de solicitud: ${
                      resultado.numeroSolicitud || resultado.numeroDeclaracion
                    }</p>
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
                <button class="btn-primary" onclick="integracionSAG.nuevaDeclaracion()">
                    <span class="material-symbols-outlined">add</span>
                    Nueva Declaración
                </button>
            </div>
        `;
  }

  mostrarResultadoConsulta(resultado) {
    let declaracionesHTML = "";
    resultado.declaraciones.forEach((decl) => {
      const fecha = new Date(decl.fecha).toLocaleDateString("es-CL");
      declaracionesHTML += `
                <div class="declaracion-item">
                    <div class="declaracion-header">
                        <strong>${decl.numero}</strong>
                        <span class="status-badge status-${
                          decl.estado
                        }">${decl.estado.toUpperCase()}</span>
                    </div>
                    <div class="declaracion-details">
                        <p><strong>Fecha:</strong> ${fecha}</p>
                        <p><strong>Tipo:</strong> ${decl.tipo}</p>
                        <p><strong>Observaciones:</strong> ${
                          decl.observaciones
                        }</p>
                    </div>
                </div>
            `;
    });

    this.queryContent.innerHTML = `
            <div class="validation-status success">
                <span class="material-symbols-outlined">search</span>
                <div>
                    <strong>Consulta Realizada Exitosamente</strong>
                    <p>Total de declaraciones encontradas: ${resultado.totalDeclaraciones}</p>
                </div>
            </div>
            
            <div class="declaraciones-list">
                <h4>Declaraciones Registradas</h4>
                ${declaracionesHTML}
            </div>
            
            <div class="action-buttons">
                <button class="btn-secondary" onclick="integracionSAG.queryPanel.style.display='none'">
                    <span class="material-symbols-outlined">close</span>
                    Cerrar
                </button>
                <button class="btn-primary" onclick="integracionSAG.nuevaDeclaracion()">
                    <span class="material-symbols-outlined">add</span>
                    Nueva Declaración
                </button>
            </div>
        `;
  }

  mostrarError(resultado, mensaje) {
    // El parámetro resultado no se usa en la plantilla original.
    this.resultsContent.innerHTML = `
            <div class="validation-status error">
                <span class="material-symbols-outlined">error</span>
                <div>
                    <strong>Error en el Procesamiento</strong>
                    <p>${mensaje}</p>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn-secondary" onclick="integracionSAG.resultsPanel.style.display='none'">
                    <span class="material-symbols-outlined">close</span>
                    Cerrar
                </button>
                <button class="btn-primary" onclick="integracionSAG.revisarFormulario()">
                    <span class="material-symbols-outlined">edit</span>
                    Revisar Formulario
                </button>
            </div>
        `;
  }

  mostrarErrorConsulta(mensaje) {
    this.queryContent.innerHTML = `
            <div class="validation-status error">
                <span class="material-symbols-outlined">error</span>
                <div>
                    <strong>Error en la Consulta</strong>
                    <p>${mensaje}</p>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn-secondary" onclick="integracionSAG.queryPanel.style.display='none'">
                    <span class="material-symbols-outlined">close</span>
                    Cerrar
                </button>
            </div>
        `;
  }

  guardarSolicitud(datos, resultado) {
    // Renombrada de guardarDeclaracion a guardarSolicitud
    const solicitud = {
      // Cambiado de declaracion a solicitud
      id: Date.now(),
      datos: datos,
      resultado: resultado,
      fecha: new Date().toISOString(),
      proceso: this.currentProcess,
    };

    this.declaraciones.push(solicitud); // Sigue usando this.declaraciones como array interno
    localStorage.setItem("solicitudesSAG", JSON.stringify(this.declaraciones)); // Clave de localStorage actualizada

    // Guardar en el storage centralizado para seguimiento
    if (typeof saveTramiteSubmission === "function") {
      saveTramiteSubmission({
        numeroTramite:
          resultado.numeroSolicitud ||
          (solicitud.id ? "SAG-" + solicitud.id.toString().slice(-6) : ""),
        tipoTramite: "sag",
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
      "borradorSAG",
      JSON.stringify({
        datos: datos,
        fecha: new Date().toISOString(),
        proceso: this.currentProcess,
      })
    );

    this.mostrarMensajeVisual("Borrador guardado exitosamente");
  }

  nuevaDeclaracion() {
    this.limpiarFormulario();
    this.resultsPanel.style.display = "none";
    this.queryPanel.style.display = "none";
  }

  revisarFormulario() {
    this.resultsPanel.style.display = "none";
    this.form.scrollIntoView({ behavior: "smooth" });
  }

  updateLastSync() {
    const lastSyncElement = document.getElementById("lastSync");
    if (lastSyncElement) {
      const ahora = new Date();
      const diferencia = Math.floor((ahora - this.lastSync) / 1000 / 60);
      lastSyncElement.textContent = `Hace ${diferencia} minutos`;
    }
  }

  mostrarMensajeVisual(mensaje, tipo = "success") {
    // No hacer nada: se elimina la tarjeta visual de mensaje general.
  }
}

// Inicializar módulo cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  window.integracionSAG = new IntegracionSAG();
});

// Estilos adicionales para la integración SAG
const sagStyles = `
    .connection-status {
        background: var(--surface-color);
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .status-indicator {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .status-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }
    
    .status-dot.connected {
        background: var(--success-color);
    }
    
    .status-dot.disconnected {
        background: var(--error-color);
    }
    
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
    
    .connection-info {
        text-align: right;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .service-status {
        color: var(--success-color);
        font-weight: 600;
    }
    
    .query-panel {
        background: var(--surface-color);
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-top: 30px;
        overflow: hidden;
    }
    
    .query-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 30px;
        background: var(--primary-color);
        color: white;
    }
    
    .query-header h3 {
        margin: 0;
        font-size: 1.2rem;
    }
    
    .close-query {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        transition: background 0.3s ease;
    }
    
    .close-query:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .query-content {
        padding: 30px;
    }
    
    .declaraciones-list {
        margin-top: 20px;
    }
    
    .declaracion-item {
        background: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
    }
    
    .declaracion-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .declaracion-details p {
        margin: 5px 0;
        font-size: 0.9rem;
    }
`;

// Agregar estilos al documento
const sagStyleSheet = document.createElement("style");
sagStyleSheet.textContent = sagStyles;
document.head.appendChild(sagStyleSheet);
