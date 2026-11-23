import { useCallback, useEffect, useState } from 'react';

interface EstadoConsulta<T> {
  datos: T | null;
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
}

/** Ejecuta una consulta a la API y la vuelve a ejecutar cuando cambian sus dependencias. */
export function useConsulta<T>(consulta: () => Promise<T>, dependencias: unknown[]): EstadoConsulta<T> {
  const [datos, setDatos] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ejecutar = useCallback(consulta, dependencias);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setDatos(await ejecutar());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar la información');
    } finally {
      setCargando(false);
    }
  }, [ejecutar]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { datos, cargando, error, recargar };
}
