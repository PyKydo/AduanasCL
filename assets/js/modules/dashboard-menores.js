// Dashboard de Gestión de Menores
class DashboardMenores {
  constructor() {
    this.solicitudes = [];
    this.solicitudesFiltradas = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.filters = {
      search: "",
      estado: "",
      proceso: "",
      fecha: "",
    };

    this.init();
  }

  init() {
    this.cargarSolicitudes();
    this.setupEventListeners();
    this.actualizarEstadisticas();
    this.renderizarTabla();
    this.inicializarGraficos();
  }

  setupEventListeners() {
    // Búsqueda
    document.getElementById("searchInput").addEventListener("input", (e) => {
      this.filters.search = e.target.value;
      this.aplicarFiltros();
    });

    // Filtros
    document.getElementById("filterEstado").addEventListener("change", (e) => {
      this.filters.estado = e.target.value;
      this.aplicarFiltros();
    });

    document.getElementById("filterProceso").addEventListener("change", (e) => {
      this.filters.proceso = e.target.value;
      this.aplicarFiltros();
    });

    document.getElementById("filterFecha").addEventListener("change", (e) => {
      this.filters.fecha = e.target.value;
      this.aplicarFiltros();
    });

    // Paginación
    document.getElementById("btnPrev").addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderizarTabla();
      }
    });

    document.getElementById("btnNext").addEventListener("click", () => {
      const totalPages = Math.ceil(
        this.solicitudesFiltradas.length / this.itemsPerPage
      );
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.renderizarTabla();
      }
    });

    // Exportar
    document.getElementById("btnExportar").addEventListener("click", () => {
      this.exportarDatos();
    });

    // Modal
    document.getElementById("closeModal").addEventListener("click", () => {
      document.getElementById("detallesModal").style.display = "none";
    });
  }

  cargarSolicitudes() {
    this.solicitudes = JSON.parse(
      localStorage.getItem("solicitudesMenores") || "[]"
    );

    // Si no hay datos, generar algunos de ejemplo
    if (this.solicitudes.length === 0) {
      this.generarDatosEjemplo();
    }

    this.solicitudesFiltradas = [...this.solicitudes];
  }

  generarDatosEjemplo() {
    const datosEjemplo = [
      {
        id: 1,
        datos: {
          rutMenor: "12345678-9",
          nombresMenor: "Juan Carlos",
          apellidosMenor: "González Silva",
          fechaNacimiento: "2010-05-15",
          nacionalidad: "chilena",
          tipoAutorizacion: "notarial",
        },
        resultado: {
          estado: "aprobado",
          numeroSolicitud: "TR-1705123456789",
          fechaProcesamiento: "2024-01-15 10:30:00",
        },
        fecha: "2024-01-15T10:30:00.000Z",
        proceso: "entrada",
      },
      {
        id: 2,
        datos: {
          rutMenor: "98765432-1",
          nombresMenor: "María Fernanda",
          apellidosMenor: "Rodríguez López",
          fechaNacimiento: "2008-12-03",
          nacionalidad: "chilena",
          tipoAutorizacion: "padre_no_acompanante",
        },
        resultado: {
          estado: "pendiente",
          numeroSolicitud: "TR-1705123456790",
          fechaProcesamiento: "2024-01-16 14:20:00",
        },
        fecha: "2024-01-16T14:20:00.000Z",
        proceso: "salida",
      },
      {
        id: 3,
        datos: {
          rutMenor: "45678912-3",
          nombresMenor: "Diego Alejandro",
          apellidosMenor: "Martínez Pérez",
          fechaNacimiento: "2009-08-22",
          nacionalidad: "argentina",
          tipoAutorizacion: "adopcion",
        },
        resultado: {
          estado: "rechazado",
          numeroSolicitud: "TR-1705123456791",
          fechaProcesamiento: "2024-01-17 09:15:00",
        },
        fecha: "2024-01-17T09:15:00.000Z",
        proceso: "autorizacion",
      },
    ];

    this.solicitudes = datosEjemplo;
    localStorage.setItem("solicitudesMenores", JSON.stringify(datosEjemplo));
  }

  aplicarFiltros() {
    this.solicitudesFiltradas = this.solicitudes.filter((solicitud) => {
      // Filtro de búsqueda
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        const searchFields = [
          solicitud.datos.rutMenor,
          solicitud.datos.nombresMenor,
          solicitud.datos.apellidosMenor,
          solicitud.resultado.numeroSolicitud,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchFields.includes(searchTerm)) {
          return false;
        }
      }

      // Filtro de estado
      if (
        this.filters.estado &&
        solicitud.resultado.estado !== this.filters.estado
      ) {
        return false;
      }

      // Filtro de proceso
      if (this.filters.proceso && solicitud.proceso !== this.filters.proceso) {
        return false;
      }

      // Filtro de fecha
      if (this.filters.fecha) {
        const solicitudFecha = new Date(solicitud.fecha)
          .toISOString()
          .split("T")[0];
        if (solicitudFecha !== this.filters.fecha) {
          return false;
        }
      }

      return true;
    });

    this.currentPage = 1;
    this.actualizarEstadisticas();
    this.renderizarTabla();
  }

  actualizarEstadisticas() {
    const total = this.solicitudes.length;
    const aprobadas = this.solicitudes.filter(
      (s) => s.resultado.estado === "aprobado"
    ).length;
    const pendientes = this.solicitudes.filter(
      (s) => s.resultado.estado === "pendiente"
    ).length;
    const rechazadas = this.solicitudes.filter(
      (s) => s.resultado.estado === "rechazado"
    ).length;

    document.getElementById("totalSolicitudes").textContent = total;
    document.getElementById("solicitudesAprobadas").textContent = aprobadas;
    document.getElementById("solicitudesPendientes").textContent = pendientes;
    document.getElementById("solicitudesRechazadas").textContent = rechazadas;
  }

  renderizarTabla() {
    const tbody = document.getElementById("solicitudesTableBody");
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const solicitudesPagina = this.solicitudesFiltradas.slice(
      startIndex,
      endIndex
    );

    tbody.innerHTML = "";

    if (solicitudesPagina.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">
                        <div class="no-data-content">
                            <span class="material-symbols-outlined">search_off</span>
                            <p>No se encontraron solicitudes que coincidan con los filtros</p>
                        </div>
                    </td>
                </tr>
            `;
    } else {
      solicitudesPagina.forEach((solicitud) => {
        const row = this.crearFilaSolicitud(solicitud);
        tbody.appendChild(row);
      });
    }

    this.actualizarPaginacion();
  }

  crearFilaSolicitud(solicitud) {
    const row = document.createElement("tr");
    const fecha = new Date(solicitud.fecha).toLocaleDateString("es-CL");
    const nombreCompleto = `${solicitud.datos.nombresMenor} ${solicitud.datos.apellidosMenor}`;

    row.innerHTML = `
            <td>
                <span class="numero-solicitud">${
                  solicitud.resultado.numeroSolicitud
                }</span>
            </td>
            <td>${solicitud.datos.rutMenor}</td>
            <td>${nombreCompleto}</td>
            <td>
                <span class="badge badge-${solicitud.proceso}">
                    ${this.capitalizarPrimeraLetra(solicitud.proceso)}
                </span>
            </td>
            <td>${fecha}</td>
            <td>
                <span class="status-badge status-${solicitud.resultado.estado}">
                    ${this.capitalizarPrimeraLetra(solicitud.resultado.estado)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action" onclick="dashboardMenores.verDetalles(${
                      solicitud.id
                    })" title="Ver detalles">
                        <span class="material-symbols-outlined">visibility</span>
                    </button>
                    <button class="btn-action" onclick="dashboardMenores.editarSolicitud(${
                      solicitud.id
                    })" title="Editar">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-action" onclick="dashboardMenores.eliminarSolicitud(${
                      solicitud.id
                    })" title="Eliminar">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </td>
        `;

    return row;
  }

  actualizarPaginacion() {
    const totalItems = this.solicitudesFiltradas.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);

    document.getElementById(
      "paginationInfo"
    ).textContent = `Mostrando ${startItem} a ${endItem} de ${totalItems} resultados`;

    document.getElementById("currentPage").textContent = this.currentPage;
    document.getElementById("totalPages").textContent = totalPages;

    document.getElementById("btnPrev").disabled = this.currentPage <= 1;
    document.getElementById("btnNext").disabled =
      this.currentPage >= totalPages;
  }

  verDetalles(id) {
    const solicitud = this.solicitudes.find((s) => s.id === id);
    if (!solicitud) return;

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = this.generarHTMLDetalles(solicitud);

    document.getElementById("detallesModal").style.display = "flex";
  }

  generarHTMLDetalles(solicitud) {
    const fecha = new Date(solicitud.fecha).toLocaleString("es-CL");
    const nombreCompleto = `${solicitud.datos.nombresMenor} ${solicitud.datos.apellidosMenor}`;
    const nombreAcompanante = `${solicitud.datos.nombresAcompanante || "N/A"} ${
      solicitud.datos.apellidosAcompanante || ""
    }`;

    return `
            <div class="detalles-solicitud">
                <div class="detalle-header">
                    <h4>Solicitud ${solicitud.resultado.numeroSolicitud}</h4>
                    <span class="status-badge status-${
                      solicitud.resultado.estado
                    }">
                        ${this.capitalizarPrimeraLetra(
                          solicitud.resultado.estado
                        )}
                    </span>
                </div>

                <div class="detalle-section">
                    <h5>Datos del Menor</h5>
                    <div class="detalle-grid">
                        <div class="detalle-item">
                            <strong>RUT:</strong> ${solicitud.datos.rutMenor}
                        </div>
                        <div class="detalle-item">
                            <strong>Nombre:</strong> ${nombreCompleto}
                        </div>
                        <div class="detalle-item">
                            <strong>Fecha de Nacimiento:</strong> ${
                              solicitud.datos.fechaNacimiento
                            }
                        </div>
                        <div class="detalle-item">
                            <strong>Nacionalidad:</strong> ${this.capitalizarPrimeraLetra(
                              solicitud.datos.nacionalidad
                            )}
                        </div>
                    </div>
                </div>

                <div class="detalle-section">
                    <h5>Datos del Acompañante</h5>
                    <div class="detalle-grid">
                        <div class="detalle-item">
                            <strong>RUT:</strong> ${
                              solicitud.datos.rutAcompanante || "N/A"
                            }
                        </div>
                        <div class="detalle-item">
                            <strong>Nombre:</strong> ${nombreAcompanante}
                        </div>
                        <div class="detalle-item">
                            <strong>Relación:</strong> ${this.capitalizarPrimeraLetra(
                              solicitud.datos.relacionAcompanante || "N/A"
                            )}
                        </div>
                    </div>
                </div>

                <div class="detalle-section">
                    <h5>Información del Proceso</h5>
                    <div class="detalle-grid">
                        <div class="detalle-item">
                            <strong>Tipo de Proceso:</strong> ${this.capitalizarPrimeraLetra(
                              solicitud.proceso
                            )}
                        </div>
                        <div class="detalle-item">
                            <strong>Tipo de Autorización:</strong> ${this.capitalizarPrimeraLetra(
                              solicitud.datos.tipoAutorizacion
                            )}
                        </div>
                        <div class="detalle-item">
                            <strong>Fecha de Solicitud:</strong> ${fecha}
                        </div>
                        <div class="detalle-item">
                            <strong>Fecha de Procesamiento:</strong> ${
                              solicitud.resultado.fechaProcesamiento
                            }
                        </div>
                    </div>
                </div>

                <div class="detalle-actions">
                    <button class="btn-secondary" onclick="dashboardMenores.imprimirSolicitud(${
                      solicitud.id
                    })">
                        <span class="material-symbols-outlined">print</span>
                        Imprimir
                    </button>
                    <button class="btn-primary" onclick="dashboardMenores.duplicarSolicitud(${
                      solicitud.id
                    })">
                        <span class="material-symbols-outlined">content_copy</span>
                        Duplicar
                    </button>
                </div>
            </div>
        `;
  }

  editarSolicitud(id) {
    // Redirigir al formulario con los datos precargados
    localStorage.setItem("editarSolicitud", id);
    window.location.href = "modulo-menores.html";
  }

  eliminarSolicitud(id) {
    if (confirm("¿Está seguro de que desea eliminar esta solicitud?")) {
      this.solicitudes = this.solicitudes.filter((s) => s.id !== id);
      localStorage.setItem(
        "solicitudesMenores",
        JSON.stringify(this.solicitudes)
      );
      this.cargarSolicitudes();
      this.aplicarFiltros();
    }
  }

  imprimirSolicitud(id) {
    const solicitud = this.solicitudes.find((s) => s.id === id);
    if (!solicitud) return;

    const ventanaImpresion = window.open("", "_blank");
    ventanaImpresion.document.write(`
            <html>
                <head>
                    <title>Autorización - ${
                      solicitud.resultado.numeroSolicitud
                    }</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
                        .content { margin: 20px 0; }
                        .footer { margin-top: 40px; text-align: center; }
                        .status-approved { color: green; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Sistema de Aduanas</h1>
                        <h2>Autorización de Menor de Edad</h2>
                        <p>Número: ${solicitud.resultado.numeroSolicitud}</p>
                    </div>
                    <div class="content">
                        <h3>Datos del Menor</h3>
                        <p><strong>RUT:</strong> ${solicitud.datos.rutMenor}</p>
                        <p><strong>Nombre:</strong> ${
                          solicitud.datos.nombresMenor
                        } ${solicitud.datos.apellidosMenor}</p>
                        <p><strong>Estado:</strong> <span class="status-approved">${solicitud.resultado.estado.toUpperCase()}</span></p>
                    </div>
                    <div class="footer">
                        <p>Documento generado el ${new Date().toLocaleString(
                          "es-CL"
                        )}</p>
                    </div>
                </body>
            </html>
        `);
    ventanaImpresion.document.close();
    ventanaImpresion.print();
  }

  duplicarSolicitud(id) {
    const solicitud = this.solicitudes.find((s) => s.id === id);
    if (!solicitud) return;

    const timestamp = Date.now();
    const nuevaSolicitud = {
      ...solicitud,
      id: Date.now(),
      resultado: {
        ...solicitud.resultado,
        numeroSolicitud: `TR-${timestamp}`,
        estado: "pendiente",
        fechaProcesamiento: new Date().toLocaleString("es-CL"),
      },
      fecha: new Date().toISOString(),
    };

    this.solicitudes.push(nuevaSolicitud);
    localStorage.setItem(
      "solicitudesMenores",
      JSON.stringify(this.solicitudes)
    );
    this.cargarSolicitudes();
    this.aplicarFiltros();

    alert("Solicitud duplicada exitosamente");
  }

  exportarDatos() {
    const datos = this.solicitudesFiltradas.map((s) => ({
      numero: s.resultado.numeroSolicitud,
      rut: s.datos.rutMenor,
      nombre: `${s.datos.nombresMenor} ${s.datos.apellidosMenor}`,
      tipo: s.proceso,
      fecha: new Date(s.fecha).toLocaleDateString("es-CL"),
      estado: s.resultado.estado,
    }));

    const csv = this.convertirACSV(datos);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `solicitudes_menores_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  convertirACSV(datos) {
    const headers = ["Número", "RUT", "Nombre", "Tipo", "Fecha", "Estado"];
    const rows = datos.map((d) => [
      d.numero,
      d.rut,
      d.nombre,
      d.tipo,
      d.fecha,
      d.estado,
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  }

  inicializarGraficos() {
    // Simulación de gráficos (en un proyecto real se usaría Chart.js)
    this.actualizarGraficoMensual();
    this.actualizarGraficoProcesos();
  }

  actualizarGraficoMensual() {
    const canvas = document.getElementById("chartMensual");
    const ctx = canvas.getContext("2d");

    // Simulación de gráfico de barras
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(50, 150, 40, 50);
    ctx.fillRect(100, 120, 40, 80);
    ctx.fillRect(150, 100, 40, 100);
    ctx.fillRect(200, 80, 40, 120);
  }

  actualizarGraficoProcesos() {
    const canvas = document.getElementById("chartProcesos");
    const ctx = canvas.getContext("2d");

    // Simulación de gráfico circular
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2196F3";
    ctx.beginPath();
    ctx.arc(200, 100, 60, 0, Math.PI * 2 * 0.4);
    ctx.lineTo(200, 100);
    ctx.fill();
  }

  capitalizarPrimeraLetra(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Inicializar dashboard cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  window.dashboardMenores = new DashboardMenores();
});

// Estilos adicionales para el dashboard
const dashboardStyles = `
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    
    .stat-card {
        background: var(--surface-color);
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-color);
        color: white;
    }
    
    .stat-icon.approved { background: var(--success-color); }
    .stat-icon.pending { background: var(--warning-color); }
    .stat-icon.rejected { background: var(--error-color); }
    
    .stat-content h3 {
        font-size: 2rem;
        margin: 0;
        color: var(--text-primary);
    }
    
    .stat-content p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .filters-section {
        background: var(--surface-color);
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .search-box {
        position: relative;
        margin-bottom: 15px;
    }
    
    .search-box input {
        width: 100%;
        padding: 12px 16px 12px 45px;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 1rem;
    }
    
    .search-box .material-symbols-outlined {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
    }
    
    .filter-options {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }
    
    .filter-options select,
    .filter-options input {
        padding: 8px 12px;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: var(--background-color);
        color: var(--text-primary);
    }
    
    .table-container {
        background: var(--surface-color);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 30px;
    }
    
    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .table-actions {
        display: flex;
        gap: 10px;
    }
    
    .table-wrapper {
        overflow-x: auto;
    }
    
    .data-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .data-table th,
    .data-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
    }
    
    .data-table th {
        background: var(--background-color);
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .status-aprobado { background: rgba(var(--success-rgb), 0.1); color: var(--success-color); }
    .status-pendiente { background: rgba(var(--warning-rgb), 0.1); color: var(--warning-color); }
    .status-rechazado { background: rgba(var(--error-rgb), 0.1); color: var(--error-color); }
    
    .badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .badge-entrada { background: rgba(var(--primary-rgb), 0.1); color: var(--primary-color); }
    .badge-salida { background: rgba(var(--secondary-rgb), 0.1); color: var(--secondary-color); }
    .badge-autorizacion { background: rgba(var(--warning-rgb), 0.1); color: var(--warning-color); }
    
    .action-buttons {
        display: flex;
        gap: 5px;
    }
    
    .btn-action {
        background: none;
        border: none;
        padding: 5px;
        border-radius: 4px;
        cursor: pointer;
        color: var(--text-secondary);
        transition: all 0.3s ease;
    }
    
    .btn-action:hover {
        background: var(--background-color);
        color: var(--text-primary);
    }
    
    .table-pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-top: 1px solid var(--border-color);
    }
    
    .pagination-controls {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .btn-pagination {
        background: none;
        border: 1px solid var(--border-color);
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        color: var(--text-primary);
    }
    
    .btn-pagination:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .charts-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 20px;
        margin-top: 30px;
    }
    
    .chart-container {
        background: var(--surface-color);
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        align-items: center;
        justify-content: center;
    }
    
    .modal-content {
        background: var(--surface-color);
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .modal-close {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 5px;
        border-radius: 4px;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .detalle-section {
        margin-bottom: 20px;
    }
    
    .detalle-section h5 {
        margin-bottom: 10px;
        color: var(--text-primary);
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 5px;
    }
    
    .detalle-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
    }
    
    .detalle-item {
        padding: 8px;
        background: var(--background-color);
        border-radius: 4px;
    }
    
    .detalle-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
    }
    
    .no-data {
        text-align: center;
        padding: 40px;
    }
    
    .no-data-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        color: var(--text-secondary);
    }
    
    .no-data-content .material-symbols-outlined {
        font-size: 3rem;
    }
`;

// Agregar estilos al documento
const dashboardStyleSheet = document.createElement("style");
dashboardStyleSheet.textContent = dashboardStyles;
document.head.appendChild(dashboardStyleSheet);
