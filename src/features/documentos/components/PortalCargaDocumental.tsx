import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useActiveSemester } from '../../../components/layout/active-semester';
import { documentosService } from '../../../services/documentos.service';
import type { DocumentoVoluntario, TipoDocumento, VoluntarioExpediente } from '../../../types/documentos.types';
import { DocumentoArchivo } from './DocumentoArchivo';
import { colorDocumento, estadosDocumento, mensajeError, nombresDocumento } from './documentos-ui';

const tiposBase: TipoDocumento[] = ['POLIZA_ACCIDENTES_APC7083', 'COMPROMISO_VOLUNTARIADO', 'CI_ANVERSO_REVERSO'];
const tiposMenor: TipoDocumento[] = ['CARTA_AUTORIZACION_PADRES_MENOR', 'CI_PADRE_TUTOR_MENOR'];

export function PortalCargaDocumental() {
  const semestre = useActiveSemester();
  return <PortalExpediente key={semestre} semestre={semestre} />;
}

function PortalExpediente({ semestre }: { semestre: string }) {
  const [expediente, setExpediente] = useState<VoluntarioExpediente>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmacionEnvio, setConfirmacionEnvio] = useState('');
  const [reload, setReload] = useState(0);
  const [viewer, setViewer] = useState<DocumentoVoluntario>();

  useEffect(() => {
    const controller = new AbortController();
    documentosService.getMisDocumentos(semestre, controller.signal)
      .then(setExpediente)
      .catch((failure: unknown) => {
        if (!controller.signal.aborted) setError(mensajeError(failure));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [semestre, reload]);

  async function ejecutar(action: () => Promise<void>) {
    setSaving(true);
    setError('');
    setSuccess('');
    setConfirmacionEnvio('');
    try {
      await action();
    } catch (failure) {
      setError(mensajeError(failure));
    } finally {
      setSaving(false);
    }
  }

  async function subir(event: FormEvent<HTMLFormElement>, tipoDocumento: TipoDocumento) {
    event.preventDefault();
    const form = event.currentTarget;
    const datos = new FormData(form);
    const file = datos.get('file');
    if (!(file instanceof File) || !file.size) return;
    if (!/\.(pdf|jpe?g|png|webp)$/i.test(file.name)) {
      setError('Selecciona un PDF o una imagen JPG, PNG o WebP.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo supera el límite de 10 MB.');
      return;
    }
    const getText = (name: string) => String(datos.get(name) || '');
    const poliza = tipoDocumento === 'POLIZA_ACCIDENTES_APC7083' ? {
      numeroPoliza: getText('numeroPoliza'),
      idPoliza: getText('idPoliza'),
      numeroCertificado: getText('numeroCertificado'),
      vigenciaInicio: getText('vigenciaInicio'),
      vigenciaFin: getText('vigenciaFin'),
      asegurado: getText('asegurado'),
    } : {};
    if (poliza.vigenciaInicio && poliza.vigenciaFin && poliza.vigenciaInicio > poliza.vigenciaFin) {
      setError('El fin de vigencia debe ser igual o posterior al inicio.');
      return;
    }
    await ejecutar(async () => {
      const documento = await documentosService.subirDocumento(semestre, { tipoDocumento, ...poliza }, file);
      setExpediente((actual) => actual && {
        ...actual,
        documentos: [...actual.documentos.filter((doc) => doc.tipoDocumento !== tipoDocumento), documento],
      });
      const input = form.elements.namedItem('file');
      if (input instanceof HTMLInputElement) input.value = '';
      setReload((value) => value + 1);
      setSuccess(`Se cargó «${documento.nombreArchivoOriginal}». Envíalo a revisión cuando esté listo.`);
    });
  }

  function eliminar(documento: DocumentoVoluntario) {
    if (!window.confirm(`¿Eliminar «${documento.nombreArchivoOriginal}» del expediente?`)) return;
    void ejecutar(async () => {
      await documentosService.eliminarDocumento(semestre, documento.id);
      setExpediente((actual) => actual && {
        ...actual,
        documentos: actual.documentos.filter((doc) => doc.id !== documento.id),
      });
      setReload((value) => value + 1);
      setSuccess('Documento eliminado.');
    });
  }

  const borradores = expediente?.documentos.filter((doc) => doc.estado === 'PENDIENTE' && !doc.enviadoRevisionEn) ?? [];

  function enviar() {
    void ejecutar(async () => {
      const { documentos } = await documentosService.enviarRevision(semestre, borradores.map((doc) => doc.id));
      setExpediente((actual) => actual && {
        ...actual,
        documentos: actual.documentos.map((doc) => documentos.find((enviado) => enviado.id === doc.id) ?? doc),
      });
      setReload((value) => value + 1);
      setConfirmacionEnvio(`Enviados a revisión: ${documentos.map((doc) => `${nombresDocumento[doc.tipoDocumento]} (${doc.nombreArchivoOriginal})`).join(', ')}.`);
    });
  }

  if (loading) return <p role="status" className="p-4 text-sm text-cato-muted">Cargando expediente documental…</p>;
  if (!expediente) return (
    <div className="space-y-3">
      <p role="alert" className="text-sm text-rose-800">{error}</p>
      <Button onClick={() => { setLoading(true); setError(''); setReload((value) => value + 1); }}>Volver a intentar</Button>
    </div>
  );

  const tipos = expediente.esMenor ? [...tiposBase, ...tiposMenor] : tiposBase;
  const documentos = [...new Set([...tipos, ...expediente.documentos.map((doc) => doc.tipoDocumento)])];
  const campo = 'rounded-lg border border-cato-border bg-white px-3 py-2 text-sm';

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-cato-navy">Mis documentos</h1>
        <p className="text-sm text-cato-muted">Gestión {semestre} · {expediente.nombreCompleto}</p>
      </header>

      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
      {success && (
        <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-4">
          {documentos.map((tipo) => {
            const doc = expediente.documentos.find((item) => item.tipoDocumento === tipo);
            const borrador = doc?.estado === 'PENDIENTE' && !doc.enviadoRevisionEn;
            return (
              <section key={tipo} className="space-y-3 rounded-xl border border-cato-border bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold text-cato-navy">{nombresDocumento[tipo]}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${doc ? colorDocumento[doc.estado] : 'bg-slate-100 text-slate-700'}`}>
                    {!doc ? 'Por cargar' : borrador ? 'Cargado · por enviar' : doc.estado === 'PENDIENTE' ? 'En revisión' : estadosDocumento[doc.estado]}
                  </span>
                </div>

                {tipo === 'COMPROMISO_VOLUNTARIADO' && semestre === '2/2026' && (
                  <a href="/docs/plantillas/Compromiso_Catovoluntario_Pastoral_UCB_2_2026.pdf" download className="text-sm text-cato-navy underline">
                    Descargar carta de compromiso (2/2026)
                  </a>
                )}
                {tipo === 'CARTA_AUTORIZACION_PADRES_MENOR' && (
                  <a href="/docs/plantillas/Modelo_Oficial_Autorizacion_Padres_Pastoral_UCB.pdf" download className="text-sm text-cato-navy underline">
                    Descargar modelo de autorización
                  </a>
                )}

                {doc && (
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="break-all text-cato-muted">{doc.nombreArchivoOriginal}</span>
                    <Button size="sm" variant="outline" onClick={() => setViewer(doc)}>Ver archivo</Button>
                    <Button size="sm" variant="ghost" disabled={saving} onClick={() => eliminar(doc)}>Eliminar</Button>
                  </div>
                )}
                {doc && (doc.estado === 'OBSERVADO' || doc.estado === 'RECHAZADO') && doc.observacionesValidacion && (
                  <p className="whitespace-pre-wrap rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
                    <strong>Motivo de Pastoral</strong><br />{doc.observacionesValidacion}
                  </p>
                )}

                {doc && !borrador && (
                  <p className="text-xs text-cato-muted">Al reemplazar el archivo tendrás que enviarlo a revisión de nuevo.</p>
                )}
                <form key={`${tipo}-${doc?.id ?? 'nuevo'}`} onSubmit={(event) => void subir(event, tipo)} className="space-y-3">
                  {tipo === 'POLIZA_ACCIDENTES_APC7083' && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="grid gap-1 text-xs font-medium">Número de póliza<input className={campo} name="numeroPoliza" maxLength={50} defaultValue={doc?.numeroPoliza ?? 'APC-7083'} /></label>
                      <label className="grid gap-1 text-xs font-medium">ID de póliza<input className={campo} name="idPoliza" maxLength={50} defaultValue={doc?.idPoliza} /></label>
                      <label className="grid gap-1 text-xs font-medium">Número de certificado<input className={campo} name="numeroCertificado" maxLength={50} defaultValue={doc?.numeroCertificado} /></label>
                      <label className="grid gap-1 text-xs font-medium">Persona asegurada<input className={campo} name="asegurado" maxLength={150} defaultValue={doc?.asegurado ?? expediente.nombreCompleto} /></label>
                      <label className="grid gap-1 text-xs font-medium">Inicio de vigencia<input className={campo} type="date" name="vigenciaInicio" defaultValue={doc?.vigenciaInicio?.slice(0, 10)} /></label>
                      <label className="grid gap-1 text-xs font-medium">Fin de vigencia<input className={campo} type="date" name="vigenciaFin" defaultValue={doc?.vigenciaFin?.slice(0, 10)} /></label>
                    </div>
                  )}
                  <div className="flex flex-wrap items-end gap-2">
                    <label className="grid gap-1 text-xs font-medium">
                      Archivo PDF o imagen de {nombresDocumento[tipo]}
                      <input name="file" type="file" required accept=".pdf,.jpg,.jpeg,.png,.webp" disabled={saving}
                        className="block max-w-full text-sm text-cato-muted file:mr-2 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-cato-navy" />
                    </label>
                    <Button type="submit" size="sm" disabled={saving}>{doc ? 'Reemplazar' : 'Cargar'}</Button>
                  </div>
                </form>
              </section>
            );
          })}
        </div>

        <aside className="space-y-3 rounded-xl border border-cato-border bg-white p-4">
          <h2 className="font-semibold text-cato-navy">Estado de habilitación</h2>
          <dl className="space-y-2 text-sm text-cato-muted">
            <div><dt className="font-medium text-cato-navy">Proyecto</dt><dd>{expediente.proyectoAsignado || 'Sin asignar'}</dd></div>
            <div><dt className="font-medium text-cato-navy">Inducción inicial</dt><dd>{expediente.induccionCompletada ? 'Completada' : 'Por realizar'}</dd></div>
            <div><dt className="font-medium text-cato-navy">Ingreso a campo</dt><dd>{expediente.habilitadoCampo ? 'Habilitado' : 'Pendiente de habilitación'}</dd></div>
          </dl>
          <Button onClick={enviar} isLoading={saving} disabled={!borradores.length} className="w-full">
            Enviar documentos a revisión
          </Button>
          {borradores.length > 0 && <p className="text-xs text-cato-muted">{borradores.length} archivo(s) cargado(s) por enviar</p>}
          {confirmacionEnvio && (
            <p role="status" className="break-words rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{confirmacionEnvio}</p>
          )}
        </aside>
      </div>

      <Modal isOpen={Boolean(viewer)} onClose={() => setViewer(undefined)} title={viewer && nombresDocumento[viewer.tipoDocumento]}
        subtitle={viewer?.nombreArchivoOriginal} maxWidth="3xl">
        {viewer && <DocumentoArchivo key={viewer.id} documento={viewer} semestre={semestre} />}
      </Modal>
    </div>
  );
}
