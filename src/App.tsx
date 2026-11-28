import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { LandingPage } from './features/portal-publico/components/LandingPage';
import { LoginPage } from './features/auth/components/LoginPage';
import { ResetPasswordPage } from './features/auth/components/ResetPasswordPage';
import { DashboardPastoral } from './features/dashboard/components/DashboardPastoral';
import { AppShell } from './components/layout/AppShell';

// M03: Entrevistas y Psicología — Marvin Larry Mollo Ramirez
import { RutaPorRol } from './features/entrevistas/components/RutaPorRol';
import { P07AgendaEntrevistas } from './features/entrevistas/components/P07AgendaEntrevistas/P07AgendaEntrevistas';
import { ListaFichasEntrevista } from './features/entrevistas/components/P08FichaEntrevista/ListaFichasEntrevista';
import { P08FichaEntrevista } from './features/entrevistas/components/P08FichaEntrevista/P08FichaEntrevista';
import { ListaPostulantesEvaluables } from './features/entrevistas/components/P09EvaluacionEsre/ListaPostulantesEvaluables';
import { P09EvaluacionEsre } from './features/entrevistas/components/P09EvaluacionEsre/P09EvaluacionEsre';

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

// M06: Asistencia, Pasajes y Portal Voluntario
import { PortalVoluntarioPage } from './features/asistencia/components/PortalVoluntarioPage';
import { MisPasajesPage } from './features/asistencia/components/MisPasajesPage';
import { AsistenciaProyectosPage } from './features/asistencia/components/AsistenciaProyectosPage';
import { PlanillasPasajesAdminPage } from './features/asistencia/components/PlanillasPasajesAdminPage';

// M07: Semáforos, Base Madre y Feedback — Leandro Colque
import { P19SemaforoReporte } from './features/semaforos/components/P19SemaforoReporte/P19SemaforoReporte';
import { P20BaseMadre } from './features/semaforos/components/P20BaseMadre/P20BaseMadre';
import { P21FeedbackCertificados } from './features/semaforos/components/P21FeedbackCertificados/P21FeedbackCertificados';

// Nuevas Vistas Segmentadas: Podio de Excelencia y Encargado Proyecto Receptor
import { PodioExcelenciaPage } from './features/podio/components/PodioExcelenciaPage';
import { ReceptorAsistenciaPage } from './features/receptor/components/ReceptorAsistenciaPage';
import { ReceptorCertificadosPage } from './features/receptor/components/ReceptorCertificadosPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Portal Público y Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/postulacion" element={<PostulacionWizard />} />

          {/* ADMIN_PASTORAL: Dashboard Ejecutivo */}
          <Route
            path="/dashboard"
            element={
              <RutaPorRol roles={['ADMIN_PASTORAL']}>
                <AppShell>
                  <DashboardPastoral />
                </AppShell>
              </RutaPorRol>
            }
          />

          {/* ADMIN_PASTORAL y CATOLIDER: Bandeja de Postulantes */}
          <Route
            path="/postulantes"
            element={
              <RutaPorRol roles={['ADMIN_PASTORAL', 'CATOLIDER']}>
                <AppShell>
                  <BandejaPostulantes />
                </AppShell>
              </RutaPorRol>
            }
          />

          {/* ADMIN_PASTORAL: Selección de Catolíderes */}
          <Route
            path="/catolideres"
            element={
              <RutaPorRol roles={['ADMIN_PASTORAL']}>
                <AppShell>
                  <SeleccionCatolideres />
                </AppShell>
              </RutaPorRol>
            }
          />

          {/* CATOLIDER: Agendar y Realizar Entrevistas / Citas Psicológicas */}
          <Route
            path="/entrevistas"
            element={
              <RutaPorRol roles={['CATOLIDER']}>
                <P07AgendaEntrevistas />
              </RutaPorRol>
            }
          />
          <Route
            path="/ficha-entrevista"
            element={
              <RutaPorRol roles={['CATOLIDER']}>
                <AppShell>
                  <ListaFichasEntrevista />
                </AppShell>
              </RutaPorRol>
            }
          />
          <Route
            path="/ficha-entrevista/:entrevistaId"
            element={
              <RutaPorRol roles={['CATOLIDER']}>
                <AppShell>
                  <P08FichaEntrevista />
                </AppShell>
              </RutaPorRol>
            }
          />
          <Route
            path="/psicologia"
            element={
              <RutaPorRol roles={['CATOLIDER']}>
                <AppShell>
                  <ListaPostulantesEvaluables />
                </AppShell>
              </RutaPorRol>
            }
          />
          <Route
            path="/psicologia/:postulacionId"
            element={
              <RutaPorRol roles={['CATOLIDER']}>
                <AppShell>
                  <P09EvaluacionEsre />
                </AppShell>
              </RutaPorRol>
            }
          />

          {/* VOLUNTARIO: Carga de Documentos */}
          <Route
            path="/documentos"
            element={
              <RutaPorRol roles={['VOLUNTARIO']}>
                <AppShell>
                  <PortalCargaDocumental />
                </AppShell>
              </RutaPorRol>
            }
          />

          {/* ADMIN_PASTORAL: Validar Documentos */}
          <Route
            path="/validacion-documental"
            element={
              <RutaPorRol roles={['ADMIN_PASTORAL']}>
                <AppShell>
                  <BandejaValidacionDocumental />
                </AppShell>
              </RutaPorRol>
            }
          />

          {/* ADMIN_PASTORAL y CATOLIDER: Control de Inducción */}
          <Route
            path="/induccion"
            element={
              <RutaPorRol roles={['ADMIN_PASTORAL', 'CATOLIDER']}>
                <AppShell>
                  <ControlInduccion />
                </AppShell>
              </RutaPorRol>
            }
          />

          {/* ADMIN_PASTORAL y CATOLIDER (consulta): Proyectos; ADMIN_PASTORAL: Ubicación y Reasignaciones */}
          <Route
            path="/proyectos"
            element={
              <RutaPorRol roles={['ADMIN_PASTORAL', 'CATOLIDER']}>
                <AppShell>
                  <P13ReceptorCatalog />
                </AppShell>
              </RutaPorRol>
            }
          />
          <Route
            path="/ubicacion"
            element={
              <RutaPorRol roles={['ADMIN_PASTORAL']}>
                <AppShell>
                  <P14MatchingBoard />
                </AppShell>
              </RutaPorRol>
            }
          />
          <Route
            path="/reasignaciones"
            element={
              <RutaPorRol roles={['ADMIN_PASTORAL']}>
                <AppShell>
                  <P15TransferManager />
                </AppShell>
              </RutaPorRol>
            }
          />

          {/* VOLUNTARIO: Portal de Voluntariados, Registro de Horas y Mi Planilla de Pasajes */}
          <Route
            path="/portal-voluntario"
            element={
              <RutaPorRol roles={['VOLUNTARIO']}>
                <AppShell>
                  <PortalVoluntarioPage />
                </AppShell>
              </RutaPorRol>
            }
          />
          <Route
            path="/mis-pasajes"
            element={
              <RutaPorRol roles={['VOLUNTARIO']}>
                <AppShell>
                  <MisPasajesPage />
                </AppShell>
              </RutaPorRol>
            }
          />

          {/* CATOLIDER: Asistencia de sus proyectos y Semáforo */}
          <Route
            path="/asistencias"
            element={
              <RutaPorRol roles={['CATOLIDER']}>
                <AppShell>
                  <AsistenciaProyectosPage />
                </AppShell>
              </RutaPorRol>
            }
          />
          <Route
            path="/semaforos"
            element={
              <RutaPorRol roles={['CATOLIDER']}>
                <AppShell>
                  <P19SemaforoReporte />
                </AppShell>
              </RutaPorRol>
            }
          />

          {/* ADMIN_PASTORAL: Planillas de Pasajes, Base Madre y Certificados */}
          <Route
            path="/pasajes"
            element={
              <RutaPorRol roles={['ADMIN_PASTORAL']}>
                <AppShell>
                  <PlanillasPasajesAdminPage />
                </AppShell>
              </RutaPorRol>
            }
          />
          <Route
            path="/base-madre"
            element={
              <RutaPorRol roles={['ADMIN_PASTORAL']}>
                <AppShell>
                  <P20BaseMadre />
                </AppShell>
              </RutaPorRol>
            }
          />
          <Route
            path="/certificados"
            element={
              <RutaPorRol roles={['ADMIN_PASTORAL']}>
                <AppShell>
                  <P21FeedbackCertificados />
                </AppShell>
              </RutaPorRol>
            }
          />

          {/* ADMIN_PASTORAL, CATOLIDER y VOLUNTARIO: Nueva Pantalla de Podio y Premiación */}
          <Route
            path="/podio"
            element={
              <RutaPorRol roles={['ADMIN_PASTORAL', 'CATOLIDER', 'VOLUNTARIO']}>
                <AppShell>
                  <PodioExcelenciaPage />
                </AppShell>
              </RutaPorRol>
            }
          />

          {/* ENCARGADO_RECEPTOR: Solo ver asistencia y subir certificados en formato de su fundación */}
          <Route
            path="/receptor-asistencia"
            element={
              <RutaPorRol roles={['ENCARGADO_RECEPTOR']}>
                <AppShell>
                  <ReceptorAsistenciaPage />
                </AppShell>
              </RutaPorRol>
            }
          />
          <Route
            path="/receptor-certificados"
            element={
              <RutaPorRol roles={['ENCARGADO_RECEPTOR']}>
                <AppShell>
                  <ReceptorCertificadosPage />
                </AppShell>
              </RutaPorRol>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
