import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { useActiveSemester } from '../../../components/layout/active-semester';
import { documentosService } from '../../../services/documentos.service';
import type { BandejaDocumental, EstadoDocumento } from '../../../types/documentos.types';
import { DocumentoArchivo } from './DocumentoArchivo';
import { colorDocumento, estadosDocumento, mensajeError, nombresDocumento } from './documentos-ui';

type Veredicto = Exclude<EstadoDocumento, 'PENDIENTE'>;

export function BandejaValidacionDocumental() {
  const semestre = useActiveSemester();
  return <BandejaPorSemestre key={semestre} semestre={semestre} />;
}

function BandejaPorSemestre({ semestre }: { semestre: string }) {
  const [bandeja, setBandeja] = useState<BandejaDocumental>();
  const [voluntarioId, setVoluntarioId] = useState<number>();
  const [documentoId, setDocumentoId] = useState<number>();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<EstadoDocumento | ''>('');
  const [motivo, setMotivo] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    documentosService.getBandejaValidacion(semestre, controller.signal)
      .then(setBandeja)
      .catch((failure: unknown) => {
        if (!controller.signal.aborted) setError(mensajeError(failure));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [semestre, reload]);

  const voluntarios = (bandeja?.voluntarios ?? []).filter((voluntario) => {
    const texto = `${voluntario.nombreCompleto} ${voluntario.ci} ${voluntario.proyectoAsignado ?? ''}`.toLocaleLowerCase('es');
    return texto.includes(busqueda.trim().toLocaleLowerCase('es')) &&
      (!filtro || voluntario.documentos.some((documento) => documento.estado === filtro));
  });
  const voluntario = voluntarios.find((persona) => persona.id === voluntarioId) ?? voluntarios[0];
  const documento = voluntario?.documentos.find((doc) => doc.id === documentoId) ??
    voluntario?.documentos.find((doc) => doc.estado === filtro) ?? voluntario?.documentos[0];

  function actualizar() {
    setError('');
    setLoading(true);
    setReload((value) => value + 1);
  }

  async function validar(estado: Veredicto) {
    if (!documento || !voluntario) return;
    const detalle = motivo.trim();
    if (estado !== 'APROBADO' && !detalle) {
      setError('Escribe el motivo de la observación o del rechazo.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const actualizado = await documentosService.validarDocumento(
        semestre, documento.id, estado, documento.enviadoRevisionEn, estado === 'APROBADO' ? undefined : detalle,
      );
      setBandeja((prev) => prev && ({
        ...prev,
        voluntarios: prev.voluntarios.map((item) => item.id === voluntario.id ? ({
          ...item,
          documentos: item.documentos.map((doc) => doc.id === actualizado.id ? actualizado : doc),
        }) : item),
      }));
      setMotivo('');
      if (filtro && estado !== filtro) setDocumentoId(undefined);
      setSuccess(`${nombresDocumento[documento.tipoDocumento]} de ${voluntario.nombreCompleto}: ${estadosDocumento[estado]}.`);
      actualizar();
    } catch (failure) {
      setError(mensajeError(failure));
    } finally {
      setSaving(false);
    }
  }

  const indicadores = bandeja && [
    ['Pendientes de revisión', bandeja.kpis.pendientesRevision],
    ['Observados o rechazados', bandeja.kpis.observados],
    ['Habilitados en la gestión', bandeja.kpis.habilitadosEsteSemestre],
    ['Pólizas próximas a vencer', bandeja.kpis.polizasProximasVencer],
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-cato-navy">Validación documental</h1>
          <p className="text-sm text-cato-muted">Gestión {semestre}</p>
        </div>
        <Button variant="outline" isLoading={loading} disabled={saving} onClick={actualizar}>Actualizar</Button>
      </header>

      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
      {success && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p>}
      {loading && !bandeja && <p role="status" className="text-sm text-cato-muted">Cargando bandeja…</p>}
      {indicadores && (
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {indicadores.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-cato-border bg-white p-3">
              <dt className="text-xs text-cato-muted">{label}</dt>
              <dd className="mt-1 text-xl font-bold text-cato-navy">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {bandeja && (
        <div className="grid items-start gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="space-y-3 rounded-xl border border-cato-border bg-white p-3">
            <label className="block space-y-1 text-xs font-medium">
              <span>Buscar expediente</span>
              <input value={busqueda} disabled={saving} onChange={(event) => { setBusqueda(event.target.value); setMotivo(''); }}
                placeholder="Nombre, CI o proyecto" className="w-full rounded-lg border border-cato-border p-2 text-sm" />
            </label>
            <label className="block space-y-1 text-xs font-medium">
              <span>Estado de los documentos</span>
              <select value={filtro} disabled={saving} onChange={(event) => { setFiltro(event.target.value as typeof filtro); setDocumentoId(undefined); setMotivo(''); }}
                className="w-full rounded-lg border border-cato-border p-2 text-sm">
                <option value="">Todos los estados</option>
                {Object.entries(estadosDocumento).map(([estado, label]) => <option key={estado} value={estado}>{label}</option>)}
              </select>
            </label>
            {voluntarios.length === 0 && <p className="p-2 text-sm text-cato-muted">No hay expedientes para estos filtros.</p>}
            <ul className="max-h-[65vh] space-y-2 overflow-y-auto">
              {voluntarios.map((persona) => (
                <li key={persona.id}>
                  <button type="button" aria-pressed={persona.id === voluntario?.id} disabled={saving} onClick={() => {
                    setVoluntarioId(persona.id);
                    setDocumentoId(undefined);
                    setMotivo('');
                    setError('');
                  }} className={`w-full rounded-lg border p-2 text-left ${persona.id === voluntario?.id ? 'border-cato-navy bg-slate-50' : 'border-cato-border'}`}>
                    <span className="block text-sm font-semibold text-cato-navy">{persona.nombreCompleto}</span>
                    <span className="block text-xs text-cato-muted">{persona.ci} · {persona.proyectoAsignado || 'Sin proyecto'}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {voluntario && documento && (
            <section className="min-w-0 space-y-4 rounded-xl border border-cato-border bg-white p-4">
              <div>
                <h2 className="text-lg font-semibold text-cato-navy">{voluntario.nombreCompleto}</h2>
                <p className="text-sm text-cato-muted">CI {voluntario.ci}{voluntario.carrera && ` · ${voluntario.carrera}`}{voluntario.esMenor && ' · Menor de edad'}</p>
              </div>
              <div className="flex flex-wrap gap-2" aria-label="Documentos enviados">
                {voluntario.documentos.map((doc) => (
                  <button key={doc.id} type="button" disabled={saving} aria-pressed={doc.id === documento.id}
                    className={`rounded-lg border px-3 py-2 text-left text-xs ${doc.id === documento.id ? 'border-cato-navy bg-slate-50' : 'border-cato-border'}`}
                    onClick={() => { setDocumentoId(doc.id); setMotivo(''); setError(''); }}>
                    <span className="block font-semibold text-cato-navy">{nombresDocumento[doc.tipoDocumento]}</span>
                    <span className={`mt-1 inline-block rounded px-1.5 py-0.5 ${colorDocumento[doc.estado]}`}>{estadosDocumento[doc.estado]}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3 rounded-lg border border-cato-border p-3">
                <h3 className="break-all text-sm font-semibold text-cato-navy">{documento.nombreArchivoOriginal}</h3>
                {documento.tipoDocumento === 'POLIZA_ACCIDENTES_APC7083' && (
                  <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-cato-muted">
                    {documento.numeroPoliza && <div><dt>Póliza</dt><dd className="font-semibold">{documento.numeroPoliza}</dd></div>}
                    {documento.idPoliza && <div><dt>ID de póliza</dt><dd className="font-semibold">{documento.idPoliza}</dd></div>}
                    {documento.numeroCertificado && <div><dt>Certificado</dt><dd className="font-semibold">{documento.numeroCertificado}</dd></div>}
                    {documento.vigenciaInicio && <div><dt>Inicio de vigencia</dt><dd className="font-semibold">{documento.vigenciaInicio.slice(0, 10)}</dd></div>}
                    {documento.vigenciaFin && <div><dt>Fin de vigencia</dt><dd className="font-semibold">{documento.vigenciaFin.slice(0, 10)}</dd></div>}
                  </dl>
                )}
                <DocumentoArchivo key={`${documento.id}-${documento.enviadoRevisionEn ?? ''}`} documento={documento} semestre={semestre} />
              </div>

              {documento.observacionesValidacion && (
                <p className="whitespace-pre-wrap rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
                  <strong>Motivo registrado</strong><br />{documento.observacionesValidacion}
                </p>
              )}

              <label className="block space-y-1 text-sm font-medium">
                <span>Motivo obligatorio para observar o rechazar</span>
                <textarea rows={3} value={motivo} disabled={loading || saving} onChange={(event) => setMotivo(event.target.value)}
                  className="w-full rounded-lg border border-cato-border p-2 text-sm"
                  placeholder="Indica qué debe corregir el voluntario." />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button disabled={loading || saving || documento.estado === 'APROBADO'} onClick={() => void validar('APROBADO')}>Aprobar documento</Button>
                <Button variant="outline" disabled={loading || saving} onClick={() => void validar('OBSERVADO')}>Observar documento</Button>
                <Button variant="danger" disabled={loading || saving} onClick={() => void validar('RECHAZADO')}>Rechazar documento</Button>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
