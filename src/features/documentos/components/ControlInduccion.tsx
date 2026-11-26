import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useActiveSemester } from '../../../components/layout/active-semester';
import { documentosService } from '../../../services/documentos.service';
import type { EstadoInduccion, ParticipanteInduccion, ParticipantesInduccion } from '../../../types/documentos.types';
import { useAuth } from '../../auth/hooks/useAuth';
import { mensajeError } from './documentos-ui';

const estados: Record<EstadoInduccion, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En proceso',
  COMPLETADA: 'Completada',
  REPROGRAMAR: 'Reprogramar',
};

const roles = {
  VOLUNTARIO: ['Catovoluntario', 'bg-amber-100 text-amber-900'],
  CATOLIDER: ['Catolíder', 'bg-red-100 text-red-900'],
  POSTULANTE: ['Postulante', 'bg-blue-100 text-blue-900'],
  INTERESADO: ['Interesado', 'bg-sky-100 text-sky-900'],
  ADMIN_PASTORAL: ['Administración', 'bg-emerald-100 text-emerald-900'],
  ENCARGADO_RECEPTOR: ['Encargado receptor', 'bg-slate-100 text-slate-900'],
} as const;

const campo = 'w-full rounded-lg border border-cato-border bg-white px-3 py-2 text-sm';
const etiqueta = 'grid gap-1 text-sm font-medium text-cato-navy';

function mostrarFecha(fecha?: string | null) {
  if (!fecha || !/^\d{4}-\d{2}-\d{2}/.test(fecha)) return '—';
  const [year, month, day] = fecha.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

export function ControlInduccion() {
  const semestre = useActiveSemester();
  const { user } = useAuth();
  return <ControlPorSemestre key={semestre} semestre={semestre} esAdmin={user?.rol === 'ADMIN_PASTORAL'} />;
}

function ControlPorSemestre({ semestre, esAdmin }: { semestre: string; esAdmin: boolean }) {
  const [data, setData] = useState<ParticipantesInduccion>();
  const [proyectos, setProyectos] = useState<{ id: number; nombre: string }[]>([]);
  const [proyectoId, setProyectoId] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [participante, setParticipante] = useState<ParticipanteInduccion>();
  const [nuevaSesion, setNuevaSesion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errorModal, setErrorModal] = useState('');
  const [success, setSuccess] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      documentosService.getParticipantesInduccion(semestre, controller.signal),
      documentosService.getProyectosInduccion(semestre, controller.signal),
    ]).then(([participantes, listaProyectos]) => {
      if (controller.signal.aborted) return;
      setData(participantes);
      setProyectos(listaProyectos);
    }).catch((failure: unknown) => {
      if (!controller.signal.aborted) setError(mensajeError(failure));
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [semestre, reload]);

  function actualizar() {
    setLoading(true);
    setError('');
    setReload((value) => value + 1);
  }

  async function guardar(action: () => Promise<void>) {
    setSaving(true);
    setErrorModal('');
    setSuccess('');
    try {
      await action();
      setParticipante(undefined);
      setNuevaSesion(false);
      actualizar();
    } catch (failure) {
      setErrorModal(mensajeError(failure));
    } finally {
      setSaving(false);
    }
  }

  function registrarAsistencia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!participante) return;
    const referencia = participante.id != null ? { asistenciaId: participante.id }
      : participante.sesionId != null ? { userId: participante.userId, sesionId: participante.sesionId } : null;
    if (!referencia) return;

    const form = new FormData(event.currentTarget);
    const fechaCharla = String(form.get('fechaCharla') ?? '') || null;
    const recorridoSitio = String(form.get('recorridoSitio') ?? '') || null;
    const estadoInduccion = fechaCharla && recorridoSitio ? 'COMPLETADA'
      : fechaCharla || recorridoSitio ? 'EN_PROCESO'
        : form.has('reprogramar') ? 'REPROGRAMAR' : 'PENDIENTE';
    void guardar(async () => {
      await documentosService.registrarAsistenciaInduccion(semestre, referencia, {
        asistio: Boolean(fechaCharla),
        fechaCharla,
        recorridoSitio,
        estadoInduccion,
        observaciones: String(form.get('observaciones') ?? '').trim(),
      });
      setSuccess(`Asistencia de ${participante.nombreCompleto} guardada.`);
    });
  }

  function agendarSesion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const titulo = String(form.get('titulo') ?? '').trim();
    const fechaHora = String(form.get('fechaHora') ?? '');
    const proyecto = String(form.get('proyectoId') ?? '');
    const modalidad = form.get('modalidad') === 'VIRTUAL' ? 'VIRTUAL' : 'PRESENCIAL';
    if (!titulo || !fechaHora) {
      setErrorModal('Ingresa el título y la fecha de la sesión.');
      return;
    }
    void guardar(async () => {
      await documentosService.crearSesionInduccion(semestre, {
        titulo,
        fechaHora: new Date(`${fechaHora}-04:00`).toISOString(),
        modalidad,
        lugarEnlace: String(form.get('lugarEnlace') ?? '').trim() || undefined,
        facilitador: String(form.get('facilitador') ?? '').trim() || undefined,
        proyectoId: proyecto ? Number(proyecto) : undefined,
      });
      setSuccess(`Sesión de inducción «${titulo}» agendada.`);
    });
  }

  const participantes = data?.participantes.filter((persona) =>
    (!proyectoId || String(persona.proyectoId) === proyectoId) && (!filtroEstado || persona.estadoInduccion === filtroEstado),
  ) ?? [];
  const kpis = data && [
    ['Voluntarios habilitados', data.kpis.voluntariosHabilitados],
    ['Inducción completada', data.kpis.induccionCompletada],
    ['Pendientes de inducción', data.kpis.pendientesInduccion],
    ['Reprogramar asistencia', data.kpis.reprogramarAsistencia],
  ];

  function exportar() {
    const escapar = (value: string | null | undefined) => {
      const texto = value ?? '';
      const seguro = /^[=+@-]|^[\t\r\n]/.test(texto) ? "'" + texto : texto;
      return '"' + seguro.replaceAll('"', '""') + '"';
    };
    const filas = participantes.map((persona) => [
      persona.nombreCompleto, persona.ci, persona.rol, persona.proyectoAsignado,
      persona.fechaCharla, persona.recorridoSitio, estados[persona.estadoInduccion],
    ].map(escapar).join(','));
    const encabezado = '\uFEFFNombre,CI,Rol,Proyecto,Fecha de charla,Fecha de recorrido,Estado de inducción\r\n';
    const csv = new Blob([encabezado, filas.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(csv);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Induccion_${semestre.replace('/', '_')}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const selectorProyectos = proyectos.map((proyecto) => <option key={proyecto.id} value={proyecto.id}>{proyecto.nombre}</option>);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-cato-navy">Control de inducción</h1>
          <p className="text-sm text-cato-muted">Gestión {semestre} · Charla y recorrido inicial</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" isLoading={loading} onClick={actualizar}>Actualizar</Button>
          {esAdmin && <Button disabled={loading} onClick={() => { setErrorModal(''); setNuevaSesion(true); }}>Registrar sesión</Button>}
        </div>
      </header>

      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
      {success && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p>}
      {loading && !data && <p role="status" className="text-sm text-cato-muted">Cargando participantes…</p>}
      {kpis && (
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-cato-border bg-white p-3">
              <dt className="text-xs text-cato-muted">{label}</dt>
              <dd className="mt-1 text-xl font-bold text-cato-navy">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {data && (
        <section className="space-y-3 rounded-xl border border-cato-border bg-white p-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className={etiqueta}>
              Proyecto
              <select className={campo} value={proyectoId} onChange={(event) => setProyectoId(event.target.value)}>
                <option value="">Todos los proyectos</option>{selectorProyectos}
              </select>
            </label>
            <label className={etiqueta}>
              Estado
              <select className={campo} value={filtroEstado} onChange={(event) => setFiltroEstado(event.target.value)}>
                <option value="">Todos los estados</option>
                {Object.entries(estados).map(([estado, label]) => <option key={estado} value={estado}>{label}</option>)}
              </select>
            </label>
            <Button variant="outline" disabled={!participantes.length} onClick={exportar}>Exportar lista</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-cato-navy">
                <tr>{['Voluntario', 'Proyecto', 'Documentos', 'Charla', 'Recorrido', 'Estado', 'Acción'].map((label) =>
                  <th key={label} className="p-2 font-semibold">{label}</th>)}</tr>
              </thead>
              <tbody>
                {participantes.map((persona) => (
                  <tr key={persona.id ?? `usuario-${persona.userId}`} className="border-b border-cato-border">
                    <th scope="row" className="p-2 font-medium text-cato-navy">
                      {persona.nombreCompleto}
                      <span className="block text-xs text-cato-muted">CI {persona.ci}</span>
                      {roles[persona.rol] && (
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${roles[persona.rol][1]}`}>
                          {roles[persona.rol][0]}
                        </span>
                      )}
                    </th>
                    <td className="p-2">{persona.proyectoAsignado}</td>
                    <td className="p-2">{persona.documentosHabilitados ? 'Habilitados' : 'Pendientes'}</td>
                    <td className="p-2">{mostrarFecha(persona.fechaCharla)}</td>
                    <td className="p-2">{mostrarFecha(persona.recorridoSitio)}</td>
                    <td className="p-2">{estados[persona.estadoInduccion]}</td>
                    <td className="p-2">
                      {persona.id == null && persona.sesionId == null ? (
                        <span className="text-xs text-cato-muted">Sin sesión programada</span>
                      ) : (
                        <Button size="sm" variant="outline" disabled={loading} onClick={() => { setErrorModal(''); setParticipante(persona); }}>
                          {persona.id == null ? 'Registrar' : 'Editar asistencia'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {participantes.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-cato-muted">No hay participantes para estos filtros.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <Modal title="Registrar asistencia" subtitle={participante?.nombreCompleto} isOpen={Boolean(participante)}
        onClose={() => { if (!saving) setParticipante(undefined); }}>
        {participante && (
          <form onSubmit={registrarAsistencia} className="space-y-3">
            {errorModal && <p role="alert" className="text-sm text-rose-800">{errorModal}</p>}
            <p className="text-sm text-cato-muted">Completa la fecha de cada actividad realizada.</p>
            <label className={etiqueta}>Fecha de charla<input name="fechaCharla" type="date" className={campo} defaultValue={participante.fechaCharla?.slice(0, 10)} /></label>
            <label className={etiqueta}>Fecha de recorrido<input name="recorridoSitio" type="date" className={campo} defaultValue={participante.recorridoSitio?.slice(0, 10)} /></label>
            <label className="flex items-center gap-2 text-sm"><input name="reprogramar" type="checkbox" defaultChecked={participante.estadoInduccion === 'REPROGRAMAR'} /> Reprogramar si ambas actividades están pendientes</label>
            <label className={etiqueta}>Observaciones<textarea name="observaciones" className={campo} defaultValue={participante.observaciones} /></label>
            <Button type="submit" isLoading={saving}>Guardar asistencia</Button>
          </form>
        )}
      </Modal>

      <Modal title="Agendar sesión de inducción" isOpen={nuevaSesion} onClose={() => { if (!saving) setNuevaSesion(false); }}>
        <form onSubmit={agendarSesion} className="space-y-3">
          {errorModal && <p role="alert" className="text-sm text-rose-800">{errorModal}</p>}
          <label className={etiqueta}>Título<input name="titulo" required className={campo} /></label>
          <label className={etiqueta}>Fecha y hora (Bolivia)<input name="fechaHora" type="datetime-local" required className={campo} /></label>
          <label className={etiqueta}>Modalidad<select name="modalidad" className={campo}><option value="PRESENCIAL">Presencial</option><option value="VIRTUAL">Virtual</option></select></label>
          <label className={etiqueta}>Proyecto<select name="proyectoId" className={campo} defaultValue={proyectoId}>
            <option value="">Sesión institucional para todos los proyectos</option>{selectorProyectos}
          </select></label>
          <label className={etiqueta}>Lugar o enlace<input name="lugarEnlace" className={campo} /></label>
          <label className={etiqueta}>Facilitador<input name="facilitador" className={campo} /></label>
          <Button type="submit" isLoading={saving}>Agendar sesión</Button>
        </form>
      </Modal>
    </div>
  );
}
