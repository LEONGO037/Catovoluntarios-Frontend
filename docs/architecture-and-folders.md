# ARQUITECTURA Y ESTRUCTURA DE CARPETAS — FRONTEND CATOVOLUNTARIOS
**Sistema Web de Gestión Integral del Programa Catovoluntarios (Pastoral UCB)**  
*Tecnologías: React 19 + TypeScript + Vite + Tailwind CSS*

---

## 1. PRINCIPIOS DE DISEÑO Y ARQUITECTURA
El proyecto frontend está estructurado bajo una **Arquitectura Basada en Características (Feature-Driven Architecture)** combinada con **Componentes Modulares Reutilizables**. Esta arquitectura garantiza:
1. **Escalabilidad:** Cada dominio funcional del sistema (Admisión, Ubicación, Asistencia, Pasajes, Semáforo) está desacoplado en su propia carpeta en `src/features/`.
2. **Reutilización:** Los componentes transversales del sistema (Sidebar, Topbar, Modales, Badges de Semáforo, Badges de Roles, Botones) residen en `src/components/`.
3. **Mantenibilidad:** Separación estricta entre capa de presentación (UI), capa de lógica de negocio (Custom Hooks) y capa de integración con API (Services).

---

## 2. ESTRUCTURA COMPLETA DE CARPETAS

```
Catovoluntarios-Frontend/
├── .env.example                     # Variables de entorno modelo
├── .env                             # Variables de entorno locales
├── AGENTS.md                        # Directrices obligatorias para agentes IA
├── CLAUDE.md                        # Espejo de directrices para agentes
├── index.html                       # Entry point HTML con tipografía Inter
├── package.json                     # Dependencias y scripts
├── postcss.config.js                # Configuración de PostCSS
├── tailwind.config.js               # Paleta cromática oficial y extensiones
├── tsconfig.json                    # Configuración estricta de TypeScript
├── tsconfig.app.json                # Configuración de compilación para app
│
├── docs/                            # Documentación técnica del proyecto
│   ├── architecture-and-folders.md  # Este archivo
│   ├── git-workflow.md              # Protocolo obligatorio de Git (Fetch previo)
│   └── requirements.md              # Requerimientos funcionales y pantallas (P-01 a P-21)
│
└── src/
    ├── assets/                      # Logotipos oficiales, stickers e imágenes
    │   ├── icons/                   # Iconografía SVG complementaria
    │   ├── images/                  # Fotos de convocatorias y actividades
    │   └── logos/                   # Logotipo Catos alta resolución 2025
    │
    ├── components/                  # Componentes reutilizables transversales
    │   ├── feedback/                # Alertas, Badges de semáforo y roles
    │   │   ├── RoleBadge.tsx        # Badge por rol (Amarillo, Rojo, Azul, etc.)
    │   │   ├── SemaforoBadge.tsx    # Badge de desempeño (Verde, Amarillo, Rojo, Morado)
    │   │   └── AlertBanner.tsx      # Banners de notificación y bloqueo
    │   │
    │   ├── layout/                  # Layout maestro (App Shell)
    │   │   ├── AppShell.tsx         # Contenedor maestro con Sidebar + Topbar
    │   │   ├── Sidebar.tsx          # Sidebar persistente (260px) en #004077
    │   │   ├── Topbar.tsx           # Barra superior con buscador y perfil
    │   │   └── PublicNavbar.tsx     # Barra de navegación para Landing y Wizard
    │   │
    │   └── ui/                      # Controles primitivos de interfaz
    │       ├── Button.tsx           # Botones (primary, cta dorado, outline, danger)
    │       ├── Input.tsx            # Inputs de texto accesibles
    │       ├── Select.tsx           # Dropdowns y selects estilizados
    │       ├── Modal.tsx            # Diálogos y ventanas emergentes
    │       ├── Stepper.tsx          # Asistente de pasos (Wizard)
    │       └── Table.tsx            # Tablas de datos limpias con hover
    │
    ├── features/                    # Módulos organizados por dominio funcional
    │   ├── admision/                # Wizard de Postulación (P-04, P-05) y Bandeja (P-06)
    │   │   ├── components/          # Pasos 1 a 4 del formulario, filtros
    │   │   ├── hooks/               # usePostulacion, useMateriasValidation
    │   │   └── types/               # Tipos de postulación y aspirantes
    │   │
    │   ├── auth/                    # Login, Recuperación y Perfil (P-02)
    │   │   ├── components/          # LoginForm, PasswordRecovery
    │   │   ├── context/             # AuthContext y sesión de usuario
    │   │   └── hooks/               # useAuth, useRoleGuard
    │   │
    │   ├── dashboard/               # Dashboard Ejecutivo Pastoral (P-03)
    │   │   ├── components/          # KpiCards, QuotaStorageBar, SemaforoWidget
    │   │   └── hooks/               # useDashboardMetrics
    │   │
    │   ├── documentacion/           # Carga de Póliza, Menores e Inducción (P-10, P-11, P-12)
    │   │   ├── components/          # DocumentUploadCard, SplitScreenValidator
    │   │   └── hooks/               # useDocumentUpload, useInsuranceValidation
    │   │
    │   ├── entrevistas/             # Agendamiento y Ficha E-SRE (P-07, P-08, P-09)
    │   │   ├── components/          # CalendarScheduler, InterviewForm, EsreForm
    │   │   └── hooks/               # useInterviewSchedule
    │   │
    │   ├── operaciones/             # Asistencia, Pasajes y Portal Voluntario (P-16, P-17, P-18)
    │   │   ├── components/          # AttendanceTable, PasajesGenerator, VoluntarioPortal
    │   │   └── hooks/               # useAttendance, usePasajesCalculator
    │   │
    │   ├── portal-publico/          # Landing de Convocatoria (P-01)
    │   │   ├── components/          # HeroSection, VideoSecradModal, ProjectCards
    │   │   └── hooks/               # useConvocatoriaVigente
    │   │
    │   └── proyectos/               # Proyectos Receptores y Ubicación (P-13, P-14, P-15)
    │       ├── components/          # ReceptorCatalog, MatchingBoard, TransferModal
    │       └── hooks/               # useMatching, useReceptorProjects
    │
    ├── hooks/                       # Custom hooks globales
    │   ├── useDebounce.ts           # Debounce para buscadores
    │   └── useMediaQuery.ts         # Detección responsive (móvil vs escritorio)
    │
    ├── services/                    # Capa de integración API REST
    │   ├── api.client.ts            # Cliente Axios / Fetch con interceptor JWT
    │   ├── auth.service.ts          # Endpoints de autenticación
    │   ├── postulaciones.service.ts # Endpoints de admisión
    │   └── proyectos.service.ts     # Endpoints de proyectos y asignaciones
    │
    ├── types/                       # Definiciones TypeScript globales
    │   ├── auth.types.ts            # Roles, usuario autenticado, tokens
    │   ├── common.types.ts          # Paginación, respuestas estándar
    │   └── dominio.types.ts         # Entidades maestras del sistema
    │
    ├── constants/                   # Constantes de negocio
    │   ├── carreras.ts              # Catálogo de las 26 carreras UCB La Paz
    │   ├── zonas.ts                 # Zonas y macrodistritos de La Paz/El Alto
    │   └── roles.ts                 # Constantes de roles y permisos RBAC
    │
    ├── utils/                       # Funciones utilitarias puras
    │   ├── formatters.ts            # Formateo de fechas, moneda (Bs) y CI
    │   ├── validators.ts            # Validaciones de formularios y edad
    │   └── cn.ts                    # Helper clsx + twMerge para clases Tailwind
    │
    ├── App.tsx                      # Router principal y proveedores
    ├── main.tsx                     # Entry point de React con ReactDOM
    └── index.css                    # Directivas Tailwind y estilos base
```

---

## 3. REGLAS OBLIGATORIAS PARA AGENTES Y DESARROLLADORES
1. **Cero Estilos Inline Arbitrarios:** Utilizar exclusivamente las clases de utilidad de Tailwind CSS configuradas en `tailwind.config.js`. Si se requiere un color institucional, usar `bg-cato-navy`, `text-cato-gold`, etc.
2. **Tipado Estricto en TypeScript:** Queda prohibido el uso del tipo `any`. Todos los props de componentes, estados y respuestas de API deben contar con interfaces o types explícitos en `src/types/` o dentro del módulo de la feature.
3. **Ubicación de Componentes:**
   * Si un componente solo se usa dentro de una pantalla específica (ej. `Step1Identificacion.tsx`), debe vivir en `src/features/admision/components/`.
   * Si un componente se usa en 2 o más dominios distintos (ej. `RoleBadge.tsx`), debe vivir en `src/components/feedback/`.
