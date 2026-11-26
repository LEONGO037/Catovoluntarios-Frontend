import { useEffect, useState } from 'react';
import { documentosService } from '../../../services/documentos.service';
import type { DocumentoVoluntario } from '../../../types/documentos.types';
import { mensajeError } from './documentos-ui';

interface Props {
  documento: DocumentoVoluntario;
  semestre: string;
}

export function DocumentoArchivo({ documento, semestre }: Props) {
  const [archivo, setArchivo] = useState<{ url: string; type: string }>();
  const [error, setError] = useState<string>();
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let url: string | undefined;
    documentosService.obtenerArchivo(semestre, documento.id, controller.signal)
      .then((blob) => {
        if (controller.signal.aborted) return;
        url = URL.createObjectURL(blob);
        setArchivo({ url, type: blob.type });
      })
      .catch((failure: unknown) => {
        if (!controller.signal.aborted) setError(mensajeError(failure));
      });

    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [documento.id, semestre, intento]);

  if (error) return (
    <div className="space-y-2 p-4">
      <p role="alert" className="text-sm text-rose-800">{error}</p>
      <button type="button" className="text-sm font-semibold text-cato-navy underline" onClick={() => {
        setError(undefined);
        setIntento((valor) => valor + 1);
      }}>Reintentar descarga</button>
    </div>
  );
  if (!archivo) return <p role="status" className="p-4 text-sm text-cato-muted">Cargando archivo…</p>;

  return (
    <div className="space-y-3">
      {/^image\/(jpeg|png|webp)$/.test(archivo.type) ? (
        <img src={archivo.url} alt={documento.nombreArchivoOriginal} className="mx-auto max-h-[60vh] max-w-full object-contain" />
      ) : archivo.type === 'application/pdf' ? (
        <iframe
          src={archivo.url}
          title={documento.nombreArchivoOriginal}
          className="h-[55vh] w-full rounded-lg border border-cato-border bg-white"
        />
      ) : (
        <p className="text-sm text-cato-muted">Descarga el archivo para abrirlo en el programa correspondiente.</p>
      )}
      <a
        href={archivo.url}
        download={documento.nombreArchivoOriginal}
        className="inline-flex text-sm font-semibold text-cato-navy underline underline-offset-4"
      >
        Descargar archivo original
      </a>
    </div>
  );
}
