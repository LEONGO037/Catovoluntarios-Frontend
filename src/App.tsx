import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { LandingPage } from './features/portal-publico/components/LandingPage';
import { LoginPage } from './features/auth/components/LoginPage';
import { ResetPasswordPage } from './features/auth/components/ResetPasswordPage';
import { DashboardPastoral } from './features/dashboard/components/DashboardPastoral';
import { AppShell } from './components/layout/AppShell';
import { TeammateModulePlaceholder } from './components/layout/TeammateModulePlaceholder';

// M02: Admisión y Postulación — Alan Flores
import { PostulacionWizard } from './features/admision/components/PostulacionWizard';
import { BandejaPostulantes } from './features/admision/components/BandejaPostulantes';
import { SeleccionCatolideres } from './features/admision/components/SeleccionCatolideres';

// M04: Habilitación Documental y Seguro — Christian Coronel
import { PortalCargaDocumental } from './features/documentos/components/PortalCargaDocumental';
import { BandejaValidacionDocumental } from './features/documentos/components/BandejaValidacionDocumental';
import { ControlInduccion } from './features/documentos/components/ControlInduccion';

// M05: Proyectos y Ubicación — Kael Lopez
import { P13ReceptorCatalog } from './features/proyectos/components/P13ReceptorCatalog/P13ReceptorCatalog';
import { P14MatchingBoard } from './features/proyectos/components/P14MatchingBoard/P14MatchingBoard';
import { P15TransferManager } from './features/proyectos/components/P15TransferManager/P15TransferManager';

// M07: Semáforos, Base Madre y Feedback — Leandro Colque
import { P19SemaforoReporte } from './features/semaforos/components/P19SemaforoReporte/P19SemaforoReporte';
import { P20BaseMadre } from './features/semaforos/components/P20BaseMadre/P20BaseMadre';
import { P21FeedbackCertificados } from './features/semaforos/components/P21FeedbackCertificados/P21FeedbackCertificados';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* M01: Portal Público, Auth & Dashboard — Leonardo Delgado */}
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
          <Route path="/postulacion" element={<PostulacionWizard />} />
          <Route
            path="/postulantes"
            element={
              <AppShell>
                <BandejaPostulantes />
              </AppShell>
            }
          />
          <Route
            path="/catolideres"
            element={
              <AppShell>
                <SeleccionCatolideres />
              </AppShell>
            }
          />

          {/* M03: Entrevistas y Psicología — Marvin Larry Mollo Ramirez (Pendiente) */}
          <Route
            path="/entrevistas"
            element={
              <TeammateModulePlaceholder
                screenId="MÓDULO 03"
                title="Agendamiento y Ficha Digital de Entrevista Presencial"
                responsible="Marvin Larry Mollo Ramirez"
                sprint="Sprint 2 (Semana 2)"
                description="Digitalización de la entrevista con rúbrica obligatoria (Apto / No Apto / Observado) y sugerencia obligatoria de proyecto receptor."
                requirements={[
                  'RF-04: Agendamiento de entrevistas presenciales con slots horarios',
                  'RF-05: Ficha digital con rúbrica estructurada de preguntas',
                  'Campo obligatorio de proyecto receptor sugerido para el postulante',
                ]}
              />
            }
          />
          <Route
            path="/psicologia"
            element={
              <TeammateModulePlaceholder
                screenId="MÓDULO 03"
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
              <AppShell>
                <P13ReceptorCatalog />
              </AppShell>
            }
          />
          <Route
            path="/ubicacion"
            element={
              <AppShell>
                <P14MatchingBoard />
              </AppShell>
            }
          />
          <Route
            path="/traslados"
            element={
              <AppShell>
                <P15TransferManager />
              </AppShell>
            }
          />
          <Route
            path="/reasignaciones"
            element={
              <AppShell>
                <P15TransferManager />
              </AppShell>
            }
          />

          {/* M06: Asistencia, Pasajes y Portal Voluntario — Juan José Cordeiro (Pendiente) */}
          <Route
            path="/asistencia"
            element={
              <TeammateModulePlaceholder
                screenId="MÓDULO 06"
                title="Registro Mensual de Asistencia y Planilla de Pasajes"
                responsible="Juan José Cordeiro"
                sprint="Sprint 4 (Semana 4)"
                description="Control de asistencia en campo con días efectivos y cálculo automático de pasajes según tarifa pactada con la institución receptora."
                requirements={[
                  'RF-14: Registro de asistencia semanal de 4 horas mínimas',
                  'RF-16: Cálculo automático de reposición de pasajes por día asistido',
                  'Pestaña de conciliación mensual previa a la liquidación',
                ]}
              />
            }
          />
          <Route
            path="/asistencias"
            element={
              <TeammateModulePlaceholder
                screenId="MÓDULO 06"
                title="Registro Mensual de Asistencia y Planilla de Pasajes"
                responsible="Juan José Cordeiro"
                sprint="Sprint 4 (Semana 4)"
                description="Control de asistencia en campo con días efectivos y cálculo automático de pasajes según tarifa pactada con la institución receptora."
                requirements={[
                  'RF-14: Registro de asistencia semanal de 4 horas mínimas',
                  'RF-16: Cálculo automático de reposición de pasajes por día asistido',
                  'Pestaña de conciliación mensual previa a la liquidación',
                ]}
              />
            }
          />
          <Route
            path="/pasajes"
            element={
              <TeammateModulePlaceholder
                screenId="MÓDULO 06"
                title="Generador de Planillas de Reposición de Pasajes"
                responsible="Juan José Cordeiro"
                sprint="Sprint 4 (Semana 4)"
                description="Exportación de planilla contable mensual lista para firma de beneficiarios y descargo administrativo Pastoral."
                requirements={[
                  'RF-17: Generación de planilla oficial con desglose de monto en Bs',
                  'Exportación en formato PDF y Excel con firmas reglamentarias',
                  'Historial de liquidaciones por centro y semestre',
                ]}
              />
            }
          />
          <Route
            path="/portal-voluntario"
            element={
              <TeammateModulePlaceholder
                screenId="MÓDULO 06"
                title="Portal Operativo del Catovoluntario"
                responsible="Juan José Cordeiro"
                sprint="Sprint 4 (Semana 4)"
                description="Vista personalizada para el voluntario con sus datos de proyecto asignado, horarios comprometidos y registro de asistencias."
                requirements={[
                  'RF-15: Visualización de horas acumuladas y estado de seguro',
                  'Datos de contacto de su Catolíder y supervisor de centro',
                  'Historial de asistencias registradas',
                ]}
              />
            }
          />

          {/* M07: Semáforos, Base Madre y Feedback — Leandro Colque */}
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
            path="/feedback-certificados"
            element={
              <AppShell>
                <P21FeedbackCertificados />
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
