import {
  ChevronRight,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-cato-canvas flex flex-col">
      {/* Topbar de Demostración del Design System */}
      <header className="h-16 bg-white border-b border-cato-border px-6 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cato-navy flex items-center justify-center text-cato-gold font-black text-lg shadow-sm">
            C
          </div>
          <div>
            <span className="font-bold text-cato-navy text-lg tracking-tight">CATOVOLUNTARIOS</span>
            <span className="text-xs text-cato-muted ml-2 font-medium">Pastoral UCB La Paz</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="badge-role-admin">Administración Pastoral</span>
          <div className="h-8 w-px bg-cato-border mx-1"></div>
          <span className="text-sm font-semibold text-cato-slate">Gestión 2/2026</span>
        </div>
      </header>

      {/* Hero / Overview */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="bg-gradient-to-r from-cato-navy to-cato-slate rounded-2xl p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cato-gold text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" /> Frontend React + TypeScript + Tailwind CSS Configurado
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Sistema Web de Gestión Integral del Programa Catovoluntarios
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Base de código modular y escalable para las 21 pantallas del sistema. Paleta cromática oficial, componentes y reglas de negocio de Pastoral UCB integradas.
            </p>
          </div>
          <a
            href="https://github.com/LEONGO037/Catovoluntarios-Frontend"
            target="_blank"
            rel="noreferrer"
            className="btn-cta text-sm whitespace-nowrap"
          >
            Repositorio GitHub <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Muestra de Paleta de Colores y Roles */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-cato-navy flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-cato-steel" />
              Guía de Estilo y Código Cromático por Rol
            </h2>
            <span className="text-xs text-cato-muted font-medium">Definido en tailwind.config.js</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="cato-card p-4 space-y-2 border-t-4 border-t-role-voluntario-primary">
              <span className="badge-role-voluntario">Catovoluntario</span>
              <p className="text-xs text-cato-muted">Amarillo (#EAB308) para voluntarios activos en campo.</p>
            </div>
            <div className="cato-card p-4 space-y-2 border-t-4 border-t-role-catolider-primary">
              <span className="badge-role-catolider">Catolíder</span>
              <p className="text-xs text-cato-muted">Rojo (#EF4444) para coordinadores de proyecto receptor.</p>
            </div>
            <div className="cato-card p-4 space-y-2 border-t-4 border-t-role-postulante-primary">
              <span className="badge-role-postulante">Postulante</span>
              <p className="text-xs text-cato-muted">Azul (#2563EB) para candidatos en proceso de admisión.</p>
            </div>
            <div className="cato-card p-4 space-y-2 border-t-4 border-t-role-interesado-primary">
              <span className="badge-role-interesado">Interesado</span>
              <p className="text-xs text-cato-muted">Celeste (#0EA5E9) para visitantes sin postulación.</p>
            </div>
            <div className="cato-card p-4 space-y-2 border-t-4 border-t-role-admin-primary">
              <span className="badge-role-admin">Administración</span>
              <p className="text-xs text-cato-muted">Verde (#10B981) para Pastoral UCB y supervisores.</p>
            </div>
          </div>
        </section>

        {/* Semáforos Operativos */}
        <section className="cato-card space-y-4">
          <h3 className="text-base font-bold text-cato-slate">
            Semáforo de Desempeño Operativo Mensual
          </h3>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="badge-semaforo-green">🟢 Verde: Normal / Aprobado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-semaforo-amber">🟡 Amarillo: Observado / Atrasos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-semaforo-red">🔴 Rojo: Abandono / En Riesgo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-semaforo-purple">🟣 Morado: Excelente / Nominado</span>
            </div>
          </div>
        </section>

        {/* Resumen de Módulos */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-cato-navy">Módulos en Construcción (P-01 a P-21)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="cato-card hover:border-cato-steel transition-all space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-cato-navy flex items-center justify-center font-bold">
                M01
              </div>
              <h3 className="font-semibold text-cato-navy">Portal Público, Auth & App Shell</h3>
              <p className="text-xs text-cato-muted leading-relaxed">
                Landing de convocatoria con video SECRAD, login multi-rol y Sidebar persistente de 260px.
              </p>
              <div className="text-xs font-semibold text-cato-slate">P-01, P-02, P-03 — Leonardo Delgado</div>
            </div>

            <div className="cato-card hover:border-cato-steel transition-all space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                M02
              </div>
              <h3 className="font-semibold text-cato-navy">Admisión & Wizard Anti-Sobrecarga</h3>
              <p className="text-xs text-cato-muted leading-relaxed">
                Formulario en 4 pasos con validación estricta (&le; 6 materias), consulta de Catolíderes y bandeja.
              </p>
              <div className="text-xs font-semibold text-cato-slate">P-04, P-05, P-06, P-06B — Alan Flores</div>
            </div>

            <div className="cato-card hover:border-cato-steel transition-all space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                M03
              </div>
              <h3 className="font-semibold text-cato-navy">Entrevistas & Psicología E-SRE</h3>
              <p className="text-xs text-cato-muted leading-relaxed">
                Agendamiento semanal, ficha de entrevista con recomendaciones y dictamen psicológico con población sugerida.
              </p>
              <div className="text-xs font-semibold text-cato-slate">P-07, P-08, P-09 — Marvin Mollo</div>
            </div>

            <div className="cato-card hover:border-cato-steel transition-all space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                M04
              </div>
              <h3 className="font-semibold text-cato-navy">Habilitación Documental & Pólizas</h3>
              <p className="text-xs text-cato-muted leading-relaxed">
                Carga de póliza APC-7083, modelo descargable de carta para menores y validación con CI visible.
              </p>
              <div className="text-xs font-semibold text-cato-slate">P-10, P-11, P-12 — Christian Coronel</div>
            </div>

            <div className="cato-card hover:border-cato-steel transition-all space-y-3">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                M05
              </div>
              <h3 className="font-semibold text-cato-navy">Proyectos Receptores & Ubicación</h3>
              <p className="text-xs text-cato-muted leading-relaxed">
                Catálogo de centros con pasaje fijo, emparejamiento con WhatsApp visible y reasignaciones notificadas.
              </p>
              <div className="text-xs font-semibold text-cato-slate">P-13, P-14, P-15 — Kael Lopez</div>
            </div>

            <div className="cato-card hover:border-cato-steel transition-all space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                M06
              </div>
              <h3 className="font-semibold text-cato-navy">Asistencia, Pasajes & Voluntario</h3>
              <p className="text-xs text-cato-muted leading-relaxed">
                Registro de jornada con aprobación de líder, cálculo de pasajes fijos y portal con actividades emergentes.
              </p>
              <div className="text-xs font-semibold text-cato-slate">P-16, P-17, P-18 — Juan José Cordeiro</div>
            </div>

            <div className="cato-card hover:border-cato-steel transition-all space-y-3">
              <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center font-bold">
                M07
              </div>
              <h3 className="font-semibold text-cato-navy">Semáforo, Base Madre & Certificados</h3>
              <p className="text-xs text-cato-muted leading-relaxed">
                Semáforo mensual justificado, historial de premios en Base Madre y plantilla descargable de certificados.
              </p>
              <div className="text-xs font-semibold text-cato-slate">P-19, P-20, P-21 — Leandro Colque</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-cato-border py-4 px-6 text-center text-xs text-cato-muted">
        Programa Catovoluntarios — Pastoral Universitaria UCB San Pablo La Paz &copy; 2026. Documentación disponible en la carpeta <code className="bg-cato-canvas px-1.5 py-0.5 rounded text-cato-navy font-semibold">docs/</code>.
      </footer>
    </div>
  );
}
