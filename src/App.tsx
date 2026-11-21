import { useState } from 'react';
import {
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  ClipboardList,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { PostulacionWizard } from './features/admision/components/PostulacionWizard';
import { BandejaPostulantes } from './features/admision/components/BandejaPostulantes';
import { SeleccionCatolideres } from './features/admision/components/SeleccionCatolideres';

export default function App() {
  const [vistaActiva, setVistaActiva] = useState<'general' | 'wizard' | 'bandeja' | 'catolideres'>('general');

  return (
    <div className="min-h-screen bg-cato-canvas flex flex-col">
      {/* Topbar del Sistema */}
      <header className="h-16 bg-white border-b border-cato-border px-6 flex items-center justify-between shadow-2xs sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setVistaActiva('general')}
            className="w-9 h-9 rounded-xl bg-cato-navy flex items-center justify-center text-cato-gold font-black text-lg shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
          >
            C
          </div>
          <div>
            <span
              onClick={() => setVistaActiva('general')}
              className="font-black text-cato-navy text-lg tracking-tight cursor-pointer"
            >
              CATOVOLUNTARIOS
            </span>
            <span className="text-xs text-cato-muted ml-2 font-medium hidden sm:inline">
              Pastoral UCB La Paz
            </span>
          </div>
        </div>

        {/* Barra de Navegación Institucional Estandarizada */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setVistaActiva('general')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              vistaActiva === 'general'
                ? 'bg-white text-cato-navy shadow-xs'
                : 'text-slate-600 hover:text-cato-navy'
            }`}
          >
            Inicio
          </button>
          <button
            type="button"
            onClick={() => setVistaActiva('wizard')}
            className={`px-3.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 ${
              vistaActiva === 'wizard'
                ? 'bg-cato-navy text-cato-gold shadow-xs'
                : 'text-slate-600 hover:text-cato-navy'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Formulario de Postulación
          </button>
          <button
            type="button"
            onClick={() => setVistaActiva('bandeja')}
            className={`px-3.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 ${
              vistaActiva === 'bandeja'
                ? 'bg-cato-navy text-cato-gold shadow-xs'
                : 'text-slate-600 hover:text-cato-navy'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Bandeja de Postulantes
          </button>
          <button
            type="button"
            onClick={() => setVistaActiva('catolideres')}
            className={`px-3.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 ${
              vistaActiva === 'catolideres'
                ? 'bg-cato-navy text-cato-gold shadow-xs'
                : 'text-slate-600 hover:text-cato-navy'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Equipo de Catolíderes
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <span className="badge-role-admin">Administración Pastoral</span>
          <div className="h-6 w-px bg-cato-border mx-1"></div>
          <span className="text-xs font-bold text-cato-slate">Gestión 2/2026</span>
        </div>
      </header>

      {/* Selector móvil de navegación */}
      <div className="md:hidden bg-white border-b border-cato-border p-2 flex overflow-x-auto gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setVistaActiva('general')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            vistaActiva === 'general' ? 'bg-cato-navy text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Inicio
        </button>
        <button
          type="button"
          onClick={() => setVistaActiva('wizard')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            vistaActiva === 'wizard' ? 'bg-cato-navy text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Postulación
        </button>
        <button
          type="button"
          onClick={() => setVistaActiva('bandeja')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            vistaActiva === 'bandeja' ? 'bg-cato-navy text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Bandeja
        </button>
        <button
          type="button"
          onClick={() => setVistaActiva('catolideres')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            vistaActiva === 'catolideres' ? 'bg-cato-navy text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Catolíderes
        </button>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {vistaActiva === 'wizard' && (
          <PostulacionWizard onFinalizar={() => setVistaActiva('bandeja')} />
        )}

        {vistaActiva === 'bandeja' && <BandejaPostulantes />}

        {vistaActiva === 'catolideres' && <SeleccionCatolideres />}

        {vistaActiva === 'general' && (
          <div className="space-y-8">
            {/* Banner Institucional de Bienvenida */}
            <div className="bg-gradient-to-r from-cato-navy via-slate-900 to-cato-navy rounded-3xl p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cato-gold text-xs font-semibold backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5" /> Convocatoria Activa Semestre 2/2026
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight">
                  Programa Catovoluntarios — Pastoral Universitaria
                </h1>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Plataforma integral para la admisión de nuevos voluntarios, evaluación de expedientes con prevención de sobrecarga académica y gestión del equipo de Catolíderes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setVistaActiva('wizard')}
                  className="btn-cta text-sm whitespace-nowrap inline-flex items-center gap-2 shadow-sm"
                >
                  <span>Abrir Formulario de Postulación</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Módulos de Operación Principal */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-cato-navy flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-cato-steel" />
                Secciones Principales del Sistema
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => setVistaActiva('wizard')}
                  className="cato-card hover:border-cato-navy cursor-pointer transition-all space-y-3 group p-6 rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      Admisión
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-cato-navy font-bold">
                      Ingresar →
                    </span>
                  </div>
                  <h3 className="font-black text-cato-navy text-base">
                    Formulario de Postulación
                  </h3>
                  <p className="text-xs text-cato-muted leading-relaxed">
                    Formulario guiado en 4 pasos para nuevos aspirantes con cálculo automático de edad, validación de carga académica, talentos y consentimiento institucional.
                  </p>
                </div>

                <div
                  onClick={() => setVistaActiva('bandeja')}
                  className="cato-card hover:border-cato-navy cursor-pointer transition-all space-y-3 group p-6 rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      Evaluación Pastoral
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-cato-navy font-bold">
                      Ingresar →
                    </span>
                  </div>
                  <h3 className="font-black text-cato-navy text-base">
                    Bandeja de Postulantes
                  </h3>
                  <p className="text-xs text-cato-muted leading-relaxed">
                    Panel de revisión centralizado con tarjetas KPI, filtros avanzados por carrera y zona, contacto directo por WhatsApp y ficha técnica para derivación a entrevistas.
                  </p>
                </div>

                <div
                  onClick={() => setVistaActiva('catolideres')}
                  className="cato-card hover:border-cato-navy cursor-pointer transition-all space-y-3 group p-6 rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                      Coordinación
                    </span>
                    <span className="text-xs text-slate-400 group-hover:text-cato-navy font-bold">
                      Ingresar →
                    </span>
                  </div>
                  <h3 className="font-black text-cato-navy text-base">
                    Equipo de Catolíderes
                  </h3>
                  <p className="text-xs text-cato-muted leading-relaxed">
                    Asignación semestral de liderazgo de proyectos comunitarios, restablecimiento periódico de roles y control de permisos de consulta para coordinadores.
                  </p>
                </div>
              </div>
            </section>

            {/* Muestra de Roles y Niveles Institucionales */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-cato-navy flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cato-steel" />
                  Estructura y Roles Institucionales
                </h2>
                <span className="text-xs text-cato-muted font-medium">Pastoral Universitaria UCB</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="cato-card p-4 space-y-2 border-t-4 border-t-role-voluntario-primary rounded-xl">
                  <span className="badge-role-voluntario">Catovoluntario</span>
                  <p className="text-xs text-cato-muted leading-relaxed">
                    Voluntarios activos en proyectos y centros comunitarios.
                  </p>
                </div>
                <div className="cato-card p-4 space-y-2 border-t-4 border-t-role-catolider-primary rounded-xl">
                  <span className="badge-role-catolider">Catolíder</span>
                  <p className="text-xs text-cato-muted leading-relaxed">
                    Líderes y coordinadores semestrales de proyecto.
                  </p>
                </div>
                <div className="cato-card p-4 space-y-2 border-t-4 border-t-role-postulante-primary rounded-xl">
                  <span className="badge-role-postulante">Postulante</span>
                  <p className="text-xs text-cato-muted leading-relaxed">
                    Aspirantes en proceso de postulación y evaluación.
                  </p>
                </div>
                <div className="cato-card p-4 space-y-2 border-t-4 border-t-role-interesado-primary rounded-xl">
                  <span className="badge-role-interesado">Interesado</span>
                  <p className="text-xs text-cato-muted leading-relaxed">
                    Estudiantes o familiares conociendo el programa.
                  </p>
                </div>
                <div className="cato-card p-4 space-y-2 border-t-4 border-t-role-admin-primary rounded-xl">
                  <span className="badge-role-admin">Administración</span>
                  <p className="text-xs text-cato-muted leading-relaxed">
                    Equipo de Pastoral Universitaria y supervisores.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer Institucional Limpio */}
      <footer className="bg-white border-t border-cato-border py-4 px-6 text-center text-xs text-cato-muted">
        Programa Catovoluntarios — Pastoral Universitaria UCB San Pablo La Paz &copy; 2026. Todos los derechos reservados.
      </footer>
    </div>
  );
}
