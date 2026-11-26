# Documentación Técnica Frontend - Módulo 07: Evaluación de Desempeño, Base Madre, Podio y Certificación

**Responsable:** Leandro Baldur Colque Palacios (`leandrobaldur`)  
**Proyecto:** Sistema de Gestión de Voluntariado Católico (Catovoluntarios) - Pastoral Universitaria UCB  
**Repositorio:** `Catovoluntarios-Frontend`  
**Rama:** `leandro`  
**Versión:** 2.0.0 (Actualización Plan de Cierre y Producción)  

---

## 1. Resumen de Cierre de Pantallas y Cero Mocks

En cumplimiento de las directrices obligatorias del plan de cierre, todas las vistas del Módulo 07 han sido conectadas a los endpoints reales de PostgreSQL a través de `apiClient`:

### 1.1 Rediseño Total de Pantalla de Certificados (`P21FeedbackCertificados.tsx` — Exclusivo Admin)
- **Barra de Selección Superior:**
  - Selector de Gestión / Semestre dinámico (integrado con `useActiveSemester()`).
  - Selector de Proyecto Receptor (cargado en vivo desde la base de datos).
  - Buscador en tiempo real de Catovoluntarios por nombre, CI o carrera.
- **Pestaña 1 - Certificado Oficial Pastoral UCB:**
  - **Panel de Selección:** Lista de Catovoluntarios acreditados con horas auditadas y nivel.
  - **Diploma Oficial UCB:** Vista previa de alta resolución con ribetes dorados, membrete oficial de la UCB Regional La Paz, departamento de Pastoral Universitaria, mención de destacado/premio y firmas de autoridades.
  - **Acciones:**
    - Botón **"Imprimir / Guardar en PDF"** con layout optimizado para diplomas.
    - Botón **"Descargar TXT"** con formato estructurado.
    - Botón **"Copiar Texto"** con confirmación reactiva.
- **Pestaña 2 - Certificados de Fundación:**
  - Muestra todos los certificados PDF que las instituciones externas (`ENCARGADO_RECEPTOR`) han subido en el semestre.
  - Enlaces directos para abrir o descargar el PDF de cada fundación.
- **Pestaña 3 - Feedback y Cierre Institucional:**
  - Cuestionario semestral de los centros con calificaciones cuantitativas y el **Bloque 4 libre obligatorio** que reemplaza informes físicos.

### 1.2 Conexión de Subida de Certificados PDF para Encargado Receptor (`ReceptorCertificadosPage.tsx`)
- Eliminación total de datos mockeados.
- Consulta de los voluntarios asignados al centro y de los certificados subidos en la gestión activa.
- Carga de archivos PDF/imagen mediante `FormData` hacia `/api/certificados/fundacion/upload`.
- Persistencia real en la tabla `certificados_fundacion` y notificación inmediata al `ADMIN_PASTORAL`.
- Opciones de visualización externa y eliminación de archivos.

### 1.3 Conexión Integral del Podio de Excelencia (`PodioExcelenciaPage.tsx`)
- Eliminación total de datos mockeados.
- Consumo del algoritmo RF-22 (`/api/base-madre/ranking`) y de distinciones (`premios_historicos`).
- Podio visual Top 3 (Oro, Plata, Bronce) y cuadro general de honor.
- Modal de premiación para `ADMIN_PASTORAL` y `CATOLIDER` con persistencia en BD y notificación al Catovoluntario premiado.
- Banner personalizado de honor para el rol `VOLUNTARIO` informándole de su posición y medallas.

### 1.4 Semáforos (`P-19`) y Base Madre (`P-20`) con Gestión Activa
- Vinculados al selector global de semestres (`useActiveSemester()`).
- Disparo de notificación a Pastoral ante semáforos Rojos o alertas de abandono.
- Base Madre histórica con recálculo dinámico de nivel RF-21 y exportación CSV.

---

## 2. Control de Calidad y Compilación

1. **Compilación TypeScript & Vite:**
   ```bash
   npm run build
   # tsc -b && vite build completado exitosamente con 0 errores.
   ```
2. **Linter (`oxlint`):**
   ```bash
   npm run lint
   # 0 errores en todos los módulos de M07.
   ```
