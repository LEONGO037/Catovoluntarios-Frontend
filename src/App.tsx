import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { LandingPage } from './features/portal-publico/components/LandingPage';
import { LoginPage } from './features/auth/components/LoginPage';
import { ResetPasswordPage } from './features/auth/components/ResetPasswordPage';
import { DashboardPastoral } from './features/dashboard/components/DashboardPastoral';
import { AppShell } from './components/layout/AppShell';
import { TeammateModulePlaceholder } from './components/layout/TeammateModulePlaceholder';
import { PortalCargaDocumental } from './features/documentos/components/PortalCargaDocumental';
import { BandejaValidacionDocumental } from './features/documentos/components/BandejaValidacionDocumental';
import { ControlInduccion } from './features/documentos/components/ControlInduccion';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* M01: Responsabilidad Leonardo Delgado */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <AppShell>
                <DashboardPastoral />
              </AppShell>
            }
          />

          {/* M02: Admisión y Postulación — Alan Flores */}
          <Route
            path="/postulacion"
            element={
              <TeammateModulePlaceholder
                screenId="P-04 & P-05"
                title="Formulario de Postulación Web y Wizard en 4 Pasos"
                responsible="Alan Franz Flores Campos"
                sprint="Sprint 2 (Semana 2)"
                description="Asistente de postulación pública con autocalculo de edad a partir de fecha de nacimiento, filtro anti-sobrecarga académica (bloqueo si materias > 6) y autorización de padres para menores de edad."
                requirements={[
                  'RF-01: Formulario web de postulación semestral',
                  'RF-03: Filtro anti-sobrecarga (bloqueo si cursa más de 6 materias)',
                  'RF-08: Validación y confirmación de autorización de padres si edad < 18',
                  'Generación de código alfanumérico único de postulación (POST-2026-XXXX)',
                ]}
              />
            }
          />
          <Route
            path="/postulantes"
            element={
              <TeammateModulePlaceholder
                screenId="P-06"
                title="Bandeja Administrativa de Postulantes"
                responsible="Alan Franz Flores Campos"
                sprint="Sprint 2 (Semana 2)"
                description="Bandeja de gestión de postulantes con principio de menor privilegio: Administrador Pastoral con lectura/edición y Catolíderes con permiso exclusivo de Solo Lectura (Read-Only)."
                requirements={[
                  'RF-02: Control de acceso RBAC estricto',
                  'Filtros por carrera, zona, edad y estado de admisión',
                  'Enlace directo a WhatsApp de cada postulante (https://wa.me/...)',
                  'Catolíderes solo pueden consultar para preparar entrevistas',
                ]}
              />
            }
          />
          <Route
            path="/catolideres"
            element={
              <TeammateModulePlaceholder
                screenId="P-06B"
                title="Selección y Asignación Semestral de Catolíderes"
                responsible="Alan Franz Flores Campos"
                sprint="Sprint 2 (Semana 2)"
                description="Módulo exclusivo para Administradora Pastoral para reiniciar roles de liderazgo del período anterior a Catovoluntario estándar y asignar manualmente nuevos Catolíderes titulares y aprendices."
                requirements={[
                  'Botón de reseteo masivo de roles de Catolíderes del semestre anterior',
                  'Buscador de voluntarios históricos con nivel Pro o Super Pro',
                  'Asignación por proyecto receptor y modalidad de liderazgo',
                ]}
              />
            }
          />

          {/* M03: Entrevistas y Psicología — Marvin Mollo */}
          <Route
            path="/entrevistas"
            element={
              <TeammateModulePlaceholder
                screenId="P-07"
                title="Agendamiento de Entrevistas Presenciales"
                responsible="Marvin Larry Mollo Ramirez"
                sprint="Sprint 2 (Semana 2)"
                description="Calendario de turnos de entrevista con visualización del ciclo en 4 etapas y marcado rápido de estados: Asistió, Faltó o Reprogramar."
                requirements={[
                  'RF-04: Calendario de franjas horarias configurables',
                  'Marcado rápido de asistencia [✓ Asistió], [✗ Faltó], [↺ Reprogramar]',
                  'Vista de selección para postulantes y vista de agenda para líderes',
                ]}
              />
            }
          />
          <Route
            path="/ficha-entrevista"
            element={
              <TeammateModulePlaceholder
                screenId="P-08"
                title="Ficha Digital de Entrevista Pastoral"
                responsible="Marvin Larry Mollo Ramirez"
                sprint="Sprint 2 (Semana 2)"
                description="Guía digital de entrevista con escala de afinidad religiosa (1 al 10), sección obligatoria de observaciones y recomendación de proyecto receptor."
                requirements={[
                  'RF-05: Digitalización de guía de entrevista Pastoral UCB',
                  'Escala numérica de apertura religiosa institucional (1 al 10)',
                  'Campo obligatorio de proyecto receptor sugerido para el postulante',
                ]}
              />
            }
          />
          <Route
            path="/psicologia"
            element={
              <TeammateModulePlaceholder
                screenId="P-09"
                title="Módulo Confidencial de Evaluación Psicológica E-SRE"
                responsible="Marvin Larry Mollo Ramirez"
                sprint="Sprint 2 (Semana 2)"
                description="Registro confidencial exclusivo para psicólogos y Pastoral con subida de informe PDF y selección obligatoria de Población Sugerida."
                requirements={[
                  'RF-06: Restricción estricta de privacidad por RBAC',
                  'Campo obligatorio: Población Sugerida para guiar la etapa de ubicación',
                  'Subida y almacenamiento de informe psicotécnico PDF',
                ]}
              />
            }
          />

          {/* M04: Habilitación Documental y Seguro — Christian Coronel */}
          <Route
            path="/documentos"
            element={
              <AppShell>
                <PortalCargaDocumental />
              </AppShell>
            }
          />
          <Route
            path="/validacion-documental"
            element={
              <AppShell>
                <BandejaValidacionDocumental />
              </AppShell>
            }
          />
          <Route
            path="/induccion"
            element={
              <AppShell>
                <ControlInduccion />
              </AppShell>
            }
          />

          {/* M05: Proyectos y Ubicación — Kael Lopez */}
          <Route
            path="/proyectos"
            element={
              <TeammateModulePlaceholder
                screenId="P-13"
                title="Catálogo de Proyectos Receptores y Convenios"
                responsible="Kael Alessandro Lopez Castillo"
                sprint="Sprint 1 y 3 (Semanas 1 y 3)"
                description="Ficha oficial de centros conveniados con población atendida, actividades semestrales específicas y tarifa fija de reposición de pasajes por día."
                requirements={[
                  'RF-10: Nomenclatura oficial: Proyecto Receptor en toda la UI',
                  'Campos obligatorios: Población atendida y actividades del semestre',
                  'Tarifa fija de pasajes por día definida por Pastoral (10, 12, 15, 20 Bs)',
                ]}
              />
            }
          />
          <Route
            path="/ubicacion"
            element={
              <TeammateModulePlaceholder
                screenId="P-14"
                title="Asignación Inteligente y Ubicación Balanceada"
                responsible="Kael Alessandro Lopez Castillo"
                sprint="Sprint 3 (Semana 3)"
                description="Tablero en tiempo real con pestañas por centro, celular visible con enlace a WhatsApp y balance demográfico por carreras, edades y antiguos/nuevos."
                requirements={[
                  'RF-12: Emparejamiento cruzado con población sugerida por el psicólogo',
                  'Pestañas por centro con porcentaje de balance demográfico en vivo',
                  'Celular visible con enlace directo a WhatsApp en cada fila',
                ]}
              />
            }
          />
          <Route
            path="/reasignaciones"
            element={
              <TeammateModulePlaceholder
                screenId="P-15"
                title="Gestión de Reasignaciones y Traslados del Primer Mes"
                responsible="Kael Alessandro Lopez Castillo"
                sprint="Sprint 3 (Semana 3)"
                description="Módulo de movilidad justificada de voluntarios durante las 4 primeras semanas con panel de notificaciones automáticas para líderes y voluntarios."
                requirements={[
                  'RF-13: Reubicación justificada por cruce de materias o distancia',
                  'Generación de alertas automáticas para líderes de origen y destino',
                ]}
              />
            }
          />

          {/* M06: Asistencia, Pasajes y Voluntario — Juan José Cordeiro */}
          <Route
            path="/asistencias"
            element={
              <TeammateModulePlaceholder
                screenId="P-16"
                title="Registro Mensual de Asistencia y Conciliación"
                responsible="Juan José Cordeiro Iñiguez"
                sprint="Sprint 3 (Semana 3)"
                description="Registro diario de jornadas por parte del voluntario, flujo de aprobación semanal por el Catolíder y conciliación con el reporte físico del supervisor del centro."
                requirements={[
                  'RF-14: Registro de entrada, salida y tareas por el voluntario',
                  'Aprobación preliminar por Catolíder y conciliación mensual con firmas físicas',
                  'Botón de impresión directa con formato oficial institucional',
                ]}
              />
            }
          />
          <Route
            path="/pasajes"
            element={
              <TeammateModulePlaceholder
                screenId="P-17"
                title="Generador Contable y Liquidación de Pasajes"
                responsible="Juan José Cordeiro Iñiguez"
                sprint="Sprint 3 (Semana 3)"
                description="Cálculo contable exacto: Días Presenciales Asistidos × Tarifa Fija del Centro. Generación de planilla macro por proyecto y planilla individual con 'Recibí Conforme'."
                requirements={[
                  'RF-16 & RF-17: Fórmula fija sin montos arbitrarios de centavos',
                  'Exportación de planilla macro por proyecto para retiro de caja',
                  'Hojas individuales de Recibí Conforme para firma física del estudiante',
                ]}
              />
            }
          />
          <Route
            path="/portal-voluntario"
            element={
              <TeammateModulePlaceholder
                screenId="P-18"
                title="Portal Operativo del Catovoluntario"
                responsible="Juan José Cordeiro Iñiguez"
                sprint="Sprint 3 (Semana 3)"
                description="Portal de autoservicio con gamificación, stickers oficiales por categoría (Junior, Pro, Super Pro), barra circular de avance de horas y registro de Actividades Emergentes."
                requirements={[
                  'Insignias dinámicas de nivel autocalculadas por horas acumuladas',
                  'Pestaña de Actividades Emergentes habilitadas por Pastoral (sin pasajes)',
                  'Mensajes de gratificación y emojis amigables',
                ]}
              />
            }
          />

          {/* M07: Semáforos, Base Madre y Certificados — Leandro Colque */}
          <Route
            path="/semaforos"
            element={
              <TeammateModulePlaceholder
                screenId="P-19"
                title="Reporte Mensual y Semáforo Cualitativo de Desempeño"
                responsible="Leandro Baldur Colque Palacios"
                sprint="Sprint 4 (Semana 4)"
                description="Matriz mensual del Catolíder para calificar a sus voluntarios con selector de semáforo (Verde, Amarillo, Rojo, Morado) y justificación obligatoria en texto."
                requirements={[
                  'RF-18: Calificación cromática mensual por voluntario',
                  'Justificación escrita obligatoria para sustentar el color asignado',
                  'Checkbox de notificación de abandono inmediato a Pastoral',
                ]}
              />
            }
          />
          <Route
            path="/base-madre"
            element={
              <TeammateModulePlaceholder
                screenId="P-20"
                title="Base Madre Histórica y Módulo de Premiaciones"
                responsible="Leandro Baldur Colque Palacios"
                sprint="Sprint 4 (Semana 4)"
                description="Tabla unificada multi-semestre con columna histórica de premios individuales, podio de premiados a partir de semáforos morados y exportación a Excel."
                requirements={[
                  'RF-20: Base histórica multi-período con filtros globales',
                  'Columna de premios con modal de desglose de becas e incentivos',
                  'Podio y galería de premiados del semestre',
                ]}
              />
            }
          />
          <Route
            path="/certificados"
            element={
              <TeammateModulePlaceholder
                screenId="P-21"
                title="Feedback Semestral de Proyectos y Generador de Certificados"
                responsible="Leandro Baldur Colque Palacios"
                sprint="Sprint 4 (Semana 4)"
                description="Formulario para centros con Punto 4 libre de sugerencias y generador de datos oficiales de voluntarios para copiar y pegar en certificados."
                requirements={[
                  'RF-23: Bloque 4 libre para comentarios y testimonios del centro',
                  'Generador de datos oficiales de conclusión de voluntariado',
                  'Botón para copiar datos formateados directo al portapapeles',
                ]}
              />
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
