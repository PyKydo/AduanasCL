# Prototipo Funcional de Gestión de Trámites Aduaneros

## Descripción General

Este proyecto es un **prototipo funcional** de una plataforma web orientada a la gestión y seguimiento de trámites aduaneros en Chile. Surge como respuesta a la congestión crítica en pasos fronterizos terrestres, especialmente en Los Libertadores, donde el aumento del flujo de personas ha superado la capacidad de la infraestructura actual. El sistema busca facilitar y agilizar los procesos aduaneros, reduciendo tiempos de espera y mejorando la experiencia de los usuarios mediante la automatización y digitalización de trámites clave.

## Fundamentación y Alcance

El desarrollo de este prototipo responde a la necesidad de modernizar los procesos aduaneros, abordando problemas como largas esperas por documentación incompleta, desconocimiento de trámites online y sobrecarga de los sistemas actuales. Se priorizó la automatización de la gestión de menores y vehículos, la integración simulada con sistemas externos (SAG, PDI, Migraciones) y la generación de reportes automáticos, permitiendo validar la viabilidad de una solución integral y escalable para el SNA.

## Requisitos Implementados

El prototipo cubre los principales procesos críticos identificados:

- Automatización de documentación y validación para menores de edad, incluyendo autorizaciones notariales y casos especiales.
- Gestión de vehículos motorizados, con validación de documentos, procesos de salida temporal y atención a vehículos diplomáticos.
- Simulación de integración de datos entre sistemas aduaneros, permitiendo obtener información en tiempo real y generar informes estadísticos exportables.
- Procesamiento de declaraciones juradas, productos regulados y representación legal para menores.
- Automatización de revisiones y controles, orientada a reducir los tiempos de espera en frontera.
- Control de acceso por roles, garantizando que solo usuarios habilitados accedan a funcionalidades específicas.

## Requisitos No Funcionales

El sistema fue diseñado considerando:

- **Seguridad:** Simulación de control de acceso y confidencialidad de la información.
- **Performance:** Respuesta eficiente y soporte para múltiples usuarios concurrentes en el entorno de pruebas.
- **Usabilidad:** Interfaz intuitiva, sistema de ayuda accesible y respeto por la identidad visual institucional.
- **Interoperabilidad:** Estructura preparada para integración futura con sistemas externos (SAG, PDI, Migraciones).
- **Disponibilidad y Escalabilidad:** Arquitectura web adaptable, pensada para operar 24/7 y escalar ante aumentos de flujo.

## Técnicas y Herramientas Utilizadas

Se emplearon herramientas de prototipado web y desarrollo front-end, priorizando tecnologías estándar (HTML, CSS, JS) y una estructura modular para facilitar la mantenibilidad y futuras integraciones. El control de versiones se realizó mediante Git, documentando cada cambio relevante en el historial de versiones. La validación de requisitos y funcionalidades se apoyó en un plan de pruebas basado en la normativa ISO/IEC 25000, con casos de prueba y evidencias documentadas para cada módulo.

## Modelo de Calidad Utilizado

Para este prototipo se considera el modelo de calidad **ISO/IEC 25010**, estándar internacional para la evaluación de la calidad de software. Este modelo define características como adecuación funcional, usabilidad, mantenibilidad y portabilidad, que permiten evaluar tanto prototipos como productos finales.

**Razones para utilizar ISO/IEC 25010 en este proyecto:**

- Permite evaluar la funcionalidad básica y la experiencia de usuario, aspectos centrales en el prototipo.
- Considera la usabilidad, accesibilidad y estructura modular del sistema.
- Es aplicable a sistemas en desarrollo o sin integración real, como este prototipo.
- Facilita la identificación de áreas de mejora para futuras versiones.

## Características Principales

- **Gestión de Trámites:** Permite a los usuarios iniciar nuevos trámites y hacer seguimiento de los mismos.
- **Paneles y Dashboards:** Acceso a paneles específicos según el rol, como el Dashboard de Menores o el Workflow Visual de Automatización.
- **Roles Dinámicos:** El menú lateral y las funcionalidades visibles cambian dinámicamente según el tipo de usuario autenticado.
- **Compatibilidad Visual:** Incluye soporte para modo oscuro y estilos responsivos, manteniendo la coherencia visual con el sitio institucional.
- **Prototipo Básico:** No incluye integración real con bases de datos ni sistemas externos; los datos de acceso y roles son simulados.

## Roles Disponibles

1. **Usuario (Viajero):** Acceso solo a trámites básicos, puede realizar declaraciones y consultar el estado de sus trámites.
2. **Funcionario de Aduanas:** Acceso al Dashboard de Gestión de Menores, gestión de solicitudes y reportes.
3. **Administrador:** Acceso al Workflow Visual de Automatización, monitoreo de procesos y configuración avanzada.

## Pruebas y Validación

Se diseñó un plan de pruebas alineado a la normativa ISO/IEC 25000, cubriendo los principales flujos de usuario y validando la correcta visualización y funcionamiento de cada módulo según el rol. Se documentaron los resultados y se generaron evidencias para cada caso de prueba, asegurando la trazabilidad de los requisitos implementados.

## Control de Cambios

El desarrollo se gestionó mediante control de versiones, registrando cada avance y mejora en el historial de versiones incluido en este documento. Esto permite mantener la trazabilidad y justificar las decisiones tomadas durante el ciclo de vida del prototipo.

## Estructura del Proyecto

- **assets/**: Recursos estáticos (CSS, JS, íconos).
- **modulos/**: Módulos funcionales de la plataforma (automatización, integración, menores, vehículos).
- **index.html**: Página principal.
- **contacto.html, normativas.html, seguimiento.html, tramites.html, template.html**: Páginas adicionales de la plataforma.

## Notas de Desarrollo

- El sistema es **compatible con modo oscuro**.
- Los estilos son **responsivos** y adaptables a distintos dispositivos.
- Los botones del menú lateral se **eliminan y recrean dinámicamente** para evitar duplicados.
- Este prototipo **no almacena datos reales** ni realiza validaciones contra sistemas externos.

## Consideraciones

Este prototipo es ideal para:

- Demostraciones a usuarios finales o stakeholders.
- Pruebas de experiencia de usuario (UX).
- Validación de flujos de acceso y navegación según roles.

**No debe considerarse un producto final ni utilizarse en ambientes productivos.**

## Historial de Versiones

| Fecha      | Versión | Implementación/Descripción                                                   | Categoría                                  |
| ---------- | ------- | ---------------------------------------------------------------------------- | ------------------------------------------ |
| 2025-06-16 | 0.1     | Inicio del prototipo: estructura de carpetas                                 | HTML base y primeros estilos globales      |
| 2025-06-16 | 0.2     | Implementación de la página de inicio (index.html) con menú principal y hero | Funcionalidad principal                    |
| 2025-06-17 | 0.3     | Creación de formulario de contacto con validaciones básicas                  | Nueva función                              |
| 2025-06-17 | 0.4     | Agregado de página de trámites con formulario y validación de RUT            | Funcionalidad principal                    |
| 2025-06-17 | 0.5     | Implementación de almacenamiento local de trámites (localStorage)            | Persistencia                               |
| 2025-06-18 | 0.6     | Desarrollo de módulo de menores: formulario completo                         | Validaciones y simulación de procesamiento |
| 2025-06-18 | 0.7     | Agregado de dashboard de menores con estadísticas y filtros                  | Nueva función                              |
| 2025-06-18 | 0.8     | Implementación de seguimiento de trámites con búsqueda por número            | Funcionalidad principal                    |
| 2025-06-19 | 0.9     | Desarrollo de módulo de vehículos: formulario                                | Validaciones y permisos temporales         |
| 2025-06-19 | 1.0     | Validación avanzada de patentes y RUT en vehículos                           | Optimización                               |
| 2025-06-19 | 1.1     | Integración de almacenamiento centralizado de trámites (tramitesSubmissions) | Optimización                               |
| 2025-06-20 | 1.2     | Desarrollo de módulo de integración SAG: formulario                          | Validaciones y simulación de API           |
| 2025-06-20 | 1.3     | Implementación de consulta de estado SAG y logs de integración               | Nueva función                              |
| 2025-06-20 | 1.4     | Agregado de workflow visual interactivo y panel de automatización            | Nueva función                              |
| 2025-06-21 | 1.5     | Mejoras de accesibilidad: ARIA labels                                        | Navegación por teclado                     |
| 2025-06-21 | 1.6     | Implementación de modo oscuro/claro con persistencia                         | Optimización                               |
| 2025-06-21 | 1.7     | Refactorización de JS en módulos y helpers                                   | Optimización                               |
| 2025-06-21 | 1.8     | Mejoras de diseño responsivo y mobile-first                                  | Optimización                               |
| 2025-06-21 | 1.9     | Agregado de botones de prueba automática en formularios                      | Nueva función                              |
| 2025-06-22 | 2.0     | Eliminación de listados visuales de trámites y limpieza de interfaz          | Optimización                               |
| 2025-06-22 | 2.1     | Mejoras en la experiencia de usuario y mensajes de éxito/error               | Optimización                               |
| 2025-06-22 | 2.2     | Actualización de documentación y README                                      | Documentación                              |
