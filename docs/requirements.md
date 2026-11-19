# ESPECIFICACIONES TÉCNICAS Y REQUERIMIENTOS FRONTEND
**Programa Catovoluntarios (Pastoral UCB La Paz)**  
*Alcance: Voluntariado Regular (21 Pantallas Estratégicas + Módulo de Catolíderes)*

---

## 1. INVENTARIO DE PANTALLAS Y REQUERIMIENTOS POR MÓDULO

### M01: Portal Público, Auth y App Shell Maestro (Responsable: Leonardo Delgado)
* **P-01 Landing de Convocatoria:**
  * Navbar público (`#004077`) sin Sidebar.
  * Hero banner interactivo, botón CTA `Postúlate` en `#FFCC00`.
  * Botón modal `Quiero Saber Más` con video oficial SECRAD embebido.
  * Botón `Ya Soy Catovoluntario` con redirección directa a login.
  * Lenguaje visual jovial con fotos reales de voluntariado.
* **P-02 Inicio de Sesión y Recuperación:**
  * Layout Split-Screen con ilustración/foto humana y formulario centrado.
  * Validación de correo institucional/personal y contraseña.
  * Identificador visual de rol por color (Verde: Admin, Rojo: Catolíder, Amarillo: Voluntario, Azul: Postulante).
  * Flujo de recuperación de contraseña con token seguro temporal.
* **P-03 App Shell y Dashboard Ejecutivo de Pastoral:**
  * Sidebar izquierdo persistente de `260 px` en `#004077`, colapsable a `72 px`.
  * Selector de semestre activo en la cabecera del Sidebar.
  * Topbar superior (`64 px`) con buscador global y perfil.
  * 4 Tarjetas KPI: Postulantes, Voluntarios Activos, Pólizas Validadas, Horas del Mes.
  * Componente visual de ocupación de cupos por proyecto estilo barra de almacenamiento Google.
  * Widget de semáforo operativo mensual (`Verde`, `Amarillo`, `Rojo`, `Morado`).

### M02: Admisión y Postulación Web (Responsable: Alan Flores)
* **P-04 Formulario Postulación (Pasos 1 y 2):**
  * Asistente Wizard (Stepper de 4 pasos).
  * Paso 1: Rol UCB, Nombre, CI + complemento + expedido, Fecha de nacimiento, **Edad autocalculada**, Celular (8 dígitos), Correo, Carrera (26 opciones), Zona de residencia.
  * Paso 2: Filtro Anti-Sobrecarga (RF-03): Cantidad de materias (`0` a `10`). **Regla dura:** Si `materias > 6`, emitir alerta bloqueante impidiendo continuar. Campo para materias consideradas muy pesadas. Actividades extracurriculares (`0`, `1`, `2+`).
* **P-05 Formulario Postulación (Pasos 3 y 4):**
  * Paso 3: Experiencia de voluntariado, habilidades, 3 palabras de personalidad, alergias/condiciones médicas, poblaciones de interés (multi-check).
  * Paso 4: Para menores de 18 años, pregunta obligatoria: *"¿Tus padres autorizan que realices voluntariado? (Sí/No)"*. Checks de compromiso pastoral.
  * Confirmación: Generación de código único de postulación (ej. `POST-2026-0842`) y botón destacado verde para unirse al Grupo de WhatsApp de Postulantes.
* **P-06 Bandeja de Postulantes:**
  * Acceso para Administrador Pastoral (Lectura/Escritura) y Catolíderes activos (**Solo Lectura / Consulta**).
  * Filtros ágiles por carrera, zona, edad y estado.
* **P-06B Selección Semestral de Catolíderes (NUEVA):**
  * Botón de reseteo semestral de roles de liderazgo a Catovoluntario estándar.
  * Asignación manual de liderazgo a voluntarios antiguos (`Nivel Pro` o `Super Pro`).

### M03: Entrevistas y Psicología E-SRE (Responsable: Marvin Mollo)
* **P-07 Agendamiento de Entrevistas:**
  * Ciclo de 4 pasos visibles: *1. Convocatoria, 2. Postulación/Selección, 3. Ubicación, 4. Desarrollo*.
  * Calendario semanal de franjas horarias con marcado rápido: `Asistió`, `Faltó`, `Reprogramar`.
* **P-08 Ficha Digital de Entrevista:**
  * Guía semiestructurada con preguntas y palabras clave de referencia para el líder.
  * Escala de apertura religiosa (`1` a `10`).
  * Sección de Observaciones y Recomendaciones del entrevistador.
  * Selector de `Proyecto Receptor Sugerido`.
* **P-09 Módulo Psicológico Confidencial E-SRE:**
  * Restricción estricta de acceso (solo Psicólogo y Pastoral).
  * Registro de puntaje E-SRE y subida de PDF del informe clínico.
  * **Campo Clave Obligatorio:** `Población sugerida` (orienta la posterior etapa de ubicación).

### M04: Habilitación Documental y Seguro (Responsable: Christian Coronel)
* **P-10 Portal de Carga Documental:**
  * Uso exclusivo del Catovoluntario admitido.
  * Subida de Póliza de Accidentes Personales UCB (`APC-7083`), Compromiso y CI.
  * Sección dinámica para menores de 18 años con botón para **descargar modelo oficial de carta de autorización de padres**.
  * **Regla Crítica:** Puede estar asignado a un proyecto, pero **no puede iniciar horas en campo sin póliza validada**.
* **P-11 Validación Documental Split-Screen:**
  * Visor de PDF/imagen en panel izquierdo y datos del voluntario en panel derecho con **Carnet de Identidad (CI) destacado**.
* **P-12 Control de Inducción y Roles:**
  * Asistencia al taller de inducción institucional previa a campo.
  * Badges con colores oficiales de cada rol.

### M05: Proyectos Receptores y Ubicación (Responsable: Kael Lopez)
* **P-13 Catálogo de Proyectos Receptores:**
  * Ficha con: Nombre del proyecto, supervisor, dirección, convenio vigente.
  * Campos obligatorios: **Población a la que atiende**, **Actividades específicas del semestre** y **Tarifa fija de pasajes por día**.
* **P-14 Asignación Inteligente (Ubicación en Tiempo Real):**
  * Pestañas por proyecto receptor con: Nombre, **Celular siempre visible (link a WhatsApp)**, Carrera, Condición (Nuevo/Antiguo), Edad y Horario.
  * Balance demográfico por centro (equilibrio entre carreras, edades y antiguos).
  * Filtro cruzado con la población sugerida por el psicólogo.
* **P-15 Gestión de Reasignaciones:**
  * Traslados justificados durante el primer mes con panel de notificaciones automáticas.

### M06: Asistencia, Pasajes y Voluntario (Responsable: Juan José Cordeiro)
* **P-16 Registro de Asistencia:**
  * El Catovoluntario registra su jornada; el Catolíder aprueba; a fin de mes Pastoral concilia con la planilla del supervisor del centro.
  * Botón de impresión directa de la planilla de asistencia oficial.
* **P-17 Generador Contable de Pasajes:**
  * Cálculo exacto: $\text{Días Asistidos} \times \text{Tarifa Fija del Proyecto Receptor}$. Sin montos con centavos arbitrarios.
  * Exportación de Planilla Macro del proyecto y Planilla Individual con recuadro de *"Recibí Conforme"*.
* **P-18 Portal del Catovoluntario:**
  * Resumen de proyecto, supervisor, horas y póliza.
  * Sección de **Actividades Emergentes** (horas extraordinarias habilitadas por Pastoral, sin pasajes por defecto).
  * Mensajes de gratificación con emojis y categorización automática (*Junior*, *Pro*, *Super Pro*).

### M07: Semáforos, Base Madre y Certificados (Responsable: Leandro Colque)
* **P-19 Reporte Mensual y Semáforo:**
  * Matriz mensual por voluntario con selector de color (`Verde`, `Amarillo`, `Rojo`, `Morado`) y **justificación obligatoria en texto**.
* **P-20 Base Madre Histórica y Premiados:**
  * Registro multi-semestre con **columna de historial de premios individuales** (cantidad y detalle).
  * Podio y ranking semestral de nominados.
* **P-21 Feedback Semestral y Certificados:**
  * Sección 4 abierta para que el Proyecto Receptor ingrese sugerencias libres.
  * Generador de datos de certificados en formato descargable para copiar y pegar sin redactar desde cero.
