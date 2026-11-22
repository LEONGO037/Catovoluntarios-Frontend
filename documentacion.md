# Documentación Técnica Frontend - Módulo 07: Evaluación de Desempeño, Base Madre y Reconocimiento / Cierre

**Responsable:** Leandro Baldur Colque Palacios (`leandrobaldur`)  
**Proyecto:** Sistema de Gestión de Voluntariado Católico (Catovoluntarios) - Pastoral Universitaria UCB  
**Repositorio:** `Catovoluntarios-Frontend`  
**Rama:** `leandro`  
**Versión:** 1.0.0  

---

## 1. Resumen de la Implementación Frontend

Para el Módulo 07 se construyeron e integraron las tres interfaces completas de usuario (P-19, P-20 y P-21) siguiendo la identidad visual institucional de Pastoral Universitaria UCB, utilizando **React 18, TypeScript, Tailwind CSS, Lucide React e integración de rutas con AppShell**.

### Pantallas Implementadas:
1. **P-19: Reporte Mensual y Semáforo Cualitativo de Desempeño (`/semaforos`)**
2. **P-20: Base Madre Histórica Multi-Semestre & Ranking/Podio de Destacados (`/base-madre`)**
3. **P-21: Feedback Semestral de Proyectos Receptores y Plantilla de Certificados (`/certificados`)**

---

## 2. Estructura de Componentes y Módulos

```
src/features/semaforos/
├── components/
│   ├── P19SemaforoReporte/
│   │   └── P19SemaforoReporte.tsx
│   ├── P20BaseMadre/
│   │   └── P20BaseMadre.tsx
│   └── P21FeedbackCertificados/
│       └── P21FeedbackCertificados.tsx
├── services/
│   ├── semaforos.mock.ts
│   └── semaforos.service.ts
└── types/
    └── semaforo.types.ts
```

---

## 3. Detalle Funcional de Pantallas

### 3.1 P-19: Reporte Mensual y Semáforo Cualitativo de Desempeño (RF-18 & RF-19)
- **Ruta:** `/semaforos`
- **Componente:** `P19SemaforoReporte.tsx`
- **Capacidades:**
  - **Selector de Proyecto y Mes:** Selector de periodo y centro receptor para filtrar la nómina de voluntarios.
  - **Matriz de Semáforos Interactiva:** Tabla responsiva con columnas para Voluntario, Horas del Mes, Semáforo, Justificación Obligatoria y Alerta de Abandono.
  - **Cuatro Colores Semafóricos con Badges:**
    - 🟢 **Verde:** Cumplimiento óptimo y asistencia completa.
    - 🟡 **Amarillo:** Llegadas tarde o inconsistencias menores.
    - 🔴 **Rojo:** Inasistencias reiteradas o faltas graves.
    - 🟣 **Morado:** Liderazgo excepcional y entrega pastoral destacada.
  - **Justificación Obligatoria:** Campo de texto interactivo con contador de caracteres; bloquea el envío si algún semáforo no posee justificación cualitativa explícita (regla de Pastoral).
  - **Checkbox de Alerta de Abandono:** Notificación directa para el equipo de coordinación central cuando un voluntario acumula ausencias críticas.
  - **Barra de Resumen de KPIs:** Muestra en tiempo real la distribución de semáforos verdes, amarillos, rojos y morados del proyecto.

### 3.2 P-20: Base Madre Histórica Multi-Semestre y Ranking de Destacados (RF-20, RF-21 & RF-22)
- **Ruta:** `/base-madre`
- **Componente:** `P20BaseMadre.tsx`
- **Pestaña 1 - Base Madre Histórica:**
  - **KPIs Superiores:** Total de voluntarios registrados, suma de horas históricas, voluntarios distinguidos `SUPER_PRO` y total de multas activas.
  - **Filtros Avanzados:** Búsqueda por texto (nombre, carnet de identidad, carrera) y filtrado por nivel del voluntario (`JUNIOR`, `PRO`, `SUPER_PRO`).
  - **Recálculo de Niveles Dinámico (RF-21):** Botón que revalida las horas acumuladas de todos los voluntarios y asigna el nivel automáticamente:
    - `JUNIOR`: 0 - 39 horas
    - `PRO`: 40 - 59 horas
    - `SUPER_PRO`: 60+ horas
  - **Exportación CSV:** Descarga con un solo clic de la matriz completa con codificación UTF-8 para análisis administrativo.
  - **Modal de Historial de Premios:** Visualización del palmarés de cada voluntario (premios, semestres, categorías y descripciones).
- **Pestaña 2 - Podio & Ranking de Destacados (RF-22):**
  - **Tarjeta Explicativa del Algoritmo:** Muestra la fórmula matemática ponderada oficial:
    $$\text{Score} = (\text{Horas Semestre} \times 0.4) + (\text{Semáforos Morados} \times 15) + (\text{Eval Institución} \times 5) + (\text{Bonus SuperPro}: 10)$$
  - **Podio Visual de Honor:** Tarjetas destacadas con laureles dorados, plateados y de bronce para el 1er, 2do y 3er puesto.
  - **Tabla Completa de Posiciones:** Desglose del desglose de puntaje por horas, morados acumulados y bonificaciones.
  - **Modal de Asignación de Reconocimientos:** Permite al equipo de Pastoral otorgar formalmente distinciones institucionales a cualquier voluntario del ranking.

### 3.3 P-21: Feedback Semestral de Proyectos Receptores y Certificados (RF-23)
- **Ruta:** `/certificados`
- **Componente:** `P21FeedbackCertificados.tsx`
- **Pestaña 1 - Feedback Institucional de Centros:**
  - **Formulario Estructurado por Bloques:**
    - *Bloque 1:* Cumplimiento de compromisos, puntualidad y asistencia (escala de 1 a 5 estrellas).
    - *Bloque 2:* Integración comunitaria, trato humano y valores pastorales (escala de 1 a 5 estrellas).
    - *Bloque 3:* Coordinación y comunicación con la Pastoral Universitaria (escala de 1 a 5 estrellas).
    - *Bloque 4 (Campo Libre Obligatorio):* Observaciones, sugerencias de mejora y evaluación cualitativa en texto libre (sustituye informes físicos tradicionales según Pastoral).
  - **Promedio Automático:** Cálculo visual inmediato del puntaje de satisfacción general de la institución.
- **Pestaña 2 - Plantilla y Generador de Certificados de Conclusión:**
  - **Selector de Voluntario:** Permite buscar y seleccionar a cualquier voluntario apto con horas concluidas.
  - **Vista Previa de la Plantilla:** Muestra el formato oficial predefinido listo para impresión o emisión.
  - **Herramientas de Productividad:**
    - Botón **Copiar Plantilla:** Copia el texto formateado al portapapeles con confirmación visual interactiva.
    - Botón **Descargar .txt:** Descarga el archivo de texto estructurado para almacenamiento o procesamiento por lotes en diplomas oficiales.

---

## 4. Servicios y Capa de Datos (`semaforos.service.ts`)

El servicio frontend cuenta con integración bidireccional:
- Realiza llamadas HTTP a la API NestJS (`/api/semaforos`, `/api/base-madre`, `/api/proyectos`, `/api/certificados`).
- Implementa **modo resiliente con fallback transparente a mock data** (`semaforos.mock.ts`), permitiendo realizar pruebas funcionales completas y demostraciones aún si el backend estuviera en mantenimiento o sin base de datos activa.
- Incluye utilidad de exportación a archivo CSV con cabeceras correctas.

---

## 5. Control de Calidad y Pruebas

Se ejecutaron las herramientas de compilación estricta y linter del proyecto:
1. **Linter (`oxlint`):**
   ```bash
   npm run lint
   # Resultado: 0 warnings, 0 errors en 45 archivos analizados.
   ```
2. **Compilador TypeScript & Bundler Vite:**
   ```bash
   npm run build
   # Resultado: tsc -b && vite build completado exitosamente sin errores de tipos.
   ```
