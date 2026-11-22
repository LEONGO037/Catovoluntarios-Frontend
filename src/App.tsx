import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { LandingPage } from './features/portal-publico/components/LandingPage';
import { LoginPage } from './features/auth/components/LoginPage';
import { ResetPasswordPage } from './features/auth/components/ResetPasswordPage';
import { DashboardPastoral } from './features/dashboard/components/DashboardPastoral';
import { P19SemaforoReporte } from './features/semaforos/components/P19SemaforoReporte/P19SemaforoReporte';
import { P20BaseMadre } from './features/semaforos/components/P20BaseMadre/P20BaseMadre';
import { P21FeedbackCertificados } from './features/semaforos/components/P21FeedbackCertificados/P21FeedbackCertificados';
import { AppShell } from './components/layout/AppShell';
import { TeammateModulePlaceholder } from './components/layout/TeammateModulePlaceholder';

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
              <TeammateModulePlaceholder
                screenId="P-10"
                title="Portal de Carga Documental del Catovoluntario"
                responsible="Christian Kevin Coronel Condori"
                sprint="Sprint 2 (Semana 2)"
                description="Portal para voluntarios admitidos: carga de Póliza de Accidentes UCB (APC-7083), CI y descarga del modelo oficial de carta de autorización de padres para menores."
                requirements={[
                  'RF-07: Póliza contra Accidentes Personales UCB vigente',
                  'RF-08: Sección dinámica para menores de 18 años con descarga de modelo oficial',
                  'Regla de Oro: Bloqueo de horas en campo si la póliza no está validada',
                ]}
              />
            }
          />
          <Route
            path="/validacion-documental"
            element={
              <TeammateModulePlaceholder
                screenId="P-11"
                title="Bandeja Split-Screen de Validación de Pólizas"
                responsible="Christian Kevin Coronel Condori"
                sprint="Sprint 2 (Semana 2)"
                description="Panel interactivo de auditoría con visor de PDF integrado en el panel izquierdo y cédula de identidad destacada en el panel derecho."
                requirements={[
                  'Visor integrado de documentos y pólizas estudiantiles',
                  'Cédula de Identidad (CI) destacada en ficha derecha',
                  'Botones de aprobación y observación con notificación automática',
                ]}
              />
            }
          />
          <Route
            path="/induccion"
            element={
              <TeammateModulePlaceholder
                screenId="P-12"
                title="Control de Asistencia a Inducción Institucional"
                responsible="Christian Kevin Coronel Condori"
                sprint="Sprint 2 (Semana 2)"
                description="Registro de participantes con badges cromáticos oficiales por rol y cambio automático de estado a 'HABILITADO PARA CAMPO' tras cumplir póliza e inducción."
                requirements={[
                  'RF-09: Taller de inducción institucional previo a campo',
                  'Candado crítico: poliza_validada + induccion_completada = habilitado_campo',
                  'Uso de código cromático por rol oficial',
                ]}
              />
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

          {/* M07: Semáforos, Base Madre y Certificados — Leandro Baldur Colque Palacios */}
          <Route
            path="/semaforos"
            element={
              <AppShell>
                <P19SemaforoReporte />
              </AppShell>
            }
          />
          <Route
            path="/base-madre"
            element={
              <AppShell>
                <P20BaseMadre />
              </AppShell>
            }
          />
          <Route
            path="/certificados"
            element={
              <AppShell>
                <P21FeedbackCertificados />
              </AppShell>
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
