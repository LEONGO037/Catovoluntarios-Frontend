import React, { useState } from 'react';
import { Building2, Layers } from 'lucide-react';
import type {
  Institucion,
  ProyectoReceptor,
  CatoliderInfo,
  CrearProyectoReceptorDto,
} from '../../types/proyectos.types';
import { ZONAS_LA_PAZ } from '../../../../constants/zonas';
import { POBLACIONES_OBJETIVO } from '../../../../constants/poblaciones';
import { Modal } from '../../../../components/ui/Modal';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';

export interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CrearProyectoReceptorDto) => Promise<unknown>;
  projectToEdit?: ProyectoReceptor | null;
  instituciones: Institucion[];
  catolideres: CatoliderInfo[];
  semestre: string;
}

interface ProjectFormContentProps {
  onClose: () => void;
  onSubmit: (data: CrearProyectoReceptorDto) => Promise<unknown>;
  projectToEdit?: ProyectoReceptor | null;
  instituciones: Institucion[];
  catolideres: CatoliderInfo[];
  semestre: string;
}

const ProjectFormContent: React.FC<ProjectFormContentProps> = ({
  onClose,
  onSubmit,
  projectToEdit,
  instituciones,
  catolideres,
  semestre,
}) => {
  const isEditing = Boolean(projectToEdit);

  const [modoInstitucion, setModoInstitucion] = useState<'existente' | 'nueva'>(
    projectToEdit || instituciones.length > 0 ? 'existente' : 'nueva'
  );
  const [selectedInstitucionId, setSelectedInstitucionId] = useState(
    projectToEdit?.institucion_id || instituciones[0]?.id || ''
  );

  const selectedInstObj = instituciones.find((i) => i.id === selectedInstitucionId);

  const [nombreInstitucion, setNombreInstitucion] = useState(
    projectToEdit?.institucion?.nombre_institucion ||
      projectToEdit?.nombre_proyecto ||
      selectedInstObj?.nombre_institucion ||
      ''
  );
  const [nombreProyecto, setNombreProyecto] = useState(
    projectToEdit?.nombre_proyecto || selectedInstObj?.nombre_institucion || ''
  );
  const [direccion, setDireccion] = useState(
    projectToEdit?.direccion_exacta || selectedInstObj?.direccion_exacta || ''
  );
  const [macrodistrito, setMacrodistrito] = useState(
    projectToEdit?.macrodistrito_zona || selectedInstObj?.macrodistrito_zona || ZONAS_LA_PAZ[0]
  );
  const [supervisor, setSupervisor] = useState(
    projectToEdit?.nombre_supervisor_centro || selectedInstObj?.nombre_supervisor_centro || ''
  );
  const [telefono, setTelefono] = useState(
    projectToEdit?.telefono_contacto || selectedInstObj?.telefono_contacto || ''
  );
  const [correo, setCorreo] = useState(
    projectToEdit?.correo || selectedInstObj?.correo || ''
  );
  const [fechaInicio, setFechaInicio] = useState(
    projectToEdit?.fecha_inicio_convenio ||
      selectedInstObj?.fecha_inicio_convenio ||
      '2026-02-01'
  );
  const [fechaFin, setFechaFin] = useState(
    projectToEdit?.fecha_fin_convenio || selectedInstObj?.fecha_fin_convenio || '2026-12-15'
  );

  const [poblaciones, setPoblaciones] = useState<string[]>(
    projectToEdit?.poblacion_objetivo || [POBLACIONES_OBJETIVO[0]]
  );
  const [actividades, setActividades] = useState(
    projectToEdit?.actividades_semestre_actual || ''
  );
  const [pasajeFijo, setPasajeFijo] = useState<number>(
    projectToEdit?.monto_pasaje_fijo || 15
  );
  const [cupoMaximo, setCupoMaximo] = useState<number>(
    projectToEdit?.cupo_maximo_voluntarios || 10
  );
  const [titularId, setTitularId] = useState(
    projectToEdit?.catolider_titular_id || catolideres[0]?.id || ''
  );
  const [aprendizId, setAprendizId] = useState(
    projectToEdit?.catolider_aprendiz_id || ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectExistingInstitution = (instId: string) => {
    setSelectedInstitucionId(instId);
    const found = instituciones.find((i) => i.id === instId);
    if (found) {
      setNombreInstitucion(found.nombre_institucion);
      if (!isEditing) {
        setNombreProyecto(found.nombre_institucion);
      }
      setDireccion(found.direccion_exacta);
      setMacrodistrito(found.macrodistrito_zona || ZONAS_LA_PAZ[0]);
      setSupervisor(found.nombre_supervisor_centro);
      setTelefono(found.telefono_contacto);
      setCorreo(found.correo);
      if (found.fecha_inicio_convenio) setFechaInicio(found.fecha_inicio_convenio);
      if (found.fecha_fin_convenio) setFechaFin(found.fecha_fin_convenio);
    }
  };

  const handleSwitchMode = (mode: 'existente' | 'nueva') => {
    setModoInstitucion(mode);
    setErrorMsg('');
    if (mode === 'nueva') {
      setSelectedInstitucionId('');
      setNombreInstitucion('');
      setNombreProyecto('');
      setDireccion('');
      setMacrodistrito(ZONAS_LA_PAZ[0]);
      setSupervisor('');
      setTelefono('');
      setCorreo('');
      setFechaInicio('2026-02-01');
      setFechaFin('2026-12-15');
    } else if (instituciones.length > 0) {
      handleSelectExistingInstitution(instituciones[0].id);
    }
  };

  const handleTogglePoblacion = (pob: string) => {
    setPoblaciones((prev) =>
      prev.includes(pob) ? prev.filter((p) => p !== pob) : [...prev, pob]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const instName = (nombreInstitucion || nombreProyecto).trim();
    const projName = nombreProyecto.trim() || instName;

    if (!instName) {
      setErrorMsg('El nombre de la institución es obligatorio.');
      return;
    }
    if (!projName) {
      setErrorMsg('El nombre del Proyecto Receptor es obligatorio.');
      return;
    }
    if (!direccion.trim()) {
      setErrorMsg('La dirección exacta es obligatoria.');
      return;
    }
    if (!supervisor.trim()) {
      setErrorMsg('El nombre del supervisor del centro es obligatorio.');
      return;
    }
    if (!telefono.trim()) {
      setErrorMsg('El teléfono de contacto es obligatorio.');
      return;
    }
    if (poblaciones.length === 0) {
      setErrorMsg('Seleccione al menos una población objetivo.');
      return;
    }
    if (!actividades.trim()) {
      setErrorMsg('Las actividades del semestre actual son obligatorias.');
      return;
    }
    if (!titularId) {
      setErrorMsg('Debe designar un Catolíder Titular.');
      return;
    }

    const institucionPayload = {
      nombre_institucion: instName,
      direccion_exacta: direccion.trim(),
      macrodistrito_zona: macrodistrito,
      nombre_supervisor_centro: supervisor.trim(),
      telefono_contacto: telefono.trim(),
      correo: correo.trim(),
      fecha_inicio_convenio: fechaInicio,
      fecha_fin_convenio: fechaFin,
    };

    const payload: CrearProyectoReceptorDto = {
      institucion_id:
        isEditing || modoInstitucion === 'existente' ? selectedInstitucionId || undefined : undefined,
      institucion: institucionPayload,
      semestre: projectToEdit?.semestre || semestre,
      nombre_proyecto: projName,
      direccion_exacta: direccion.trim(),
      macrodistrito_zona: macrodistrito,
      nombre_supervisor_centro: supervisor.trim(),
      telefono_contacto: telefono.trim(),
      correo: correo.trim(),
      fecha_inicio_convenio: fechaInicio,
      fecha_fin_convenio: fechaFin,
      poblacion_objetivo: poblaciones,
      actividades_semestre_actual: actividades.trim(),
      monto_pasaje_fijo: Number(pasajeFijo),
      cupo_maximo_voluntarios: Number(cupoMaximo),
      catolider_titular_id: titularId,
      catolider_aprendiz_id: aprendizId || undefined,
    };

    setIsSaving(true);
    try {
      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar la información del Proyecto Receptor.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 text-red-800 text-xs border border-red-200 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Bloque 1: Entidad Maestra Institución (1) */}
      <div className="p-4 rounded-xl border border-cato-border bg-cato-canvas/60 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cato-border pb-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cato-navy">
            <Building2 className="w-4 h-4 text-cato-steel" />
            <span>1. Datos Maestros de la Institución</span>
          </div>

          {!isEditing && instituciones.length > 0 && (
            <div className="inline-flex rounded-lg border border-cato-border bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => handleSwitchMode('existente')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  modoInstitucion === 'existente'
                    ? 'bg-cato-navy text-white'
                    : 'text-cato-slate hover:bg-cato-canvas'
                }`}
              >
                Institución Existente
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode('nueva')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  modoInstitucion === 'nueva'
                    ? 'bg-cato-navy text-white'
                    : 'text-cato-slate hover:bg-cato-canvas'
                }`}
              >
                Nueva Institución
              </button>
            </div>
          )}
        </div>

        {!isEditing && modoInstitucion === 'existente' && instituciones.length > 0 && (
          <Select
            label="Seleccionar Institución Registrada"
            value={selectedInstitucionId}
            onChange={(e) => handleSelectExistingInstitution(e.target.value)}
            options={instituciones.map((inst) => ({
              value: inst.id,
              label: `${inst.nombre_institucion} (${inst.macrodistrito_zona})`,
            }))}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre de la Institución"
            required
            value={nombreInstitucion}
            onChange={(e) => {
              setNombreInstitucion(e.target.value);
              if (!isEditing && !nombreProyecto) {
                setNombreProyecto(e.target.value);
              }
            }}
            placeholder="Ej: Fundación Hogar San Ramón"
          />

          <Select
            label="Macrodistrito / Zona (La Paz / El Alto)"
            required
            value={macrodistrito}
            onChange={(e) => setMacrodistrito(e.target.value)}
            options={ZONAS_LA_PAZ.map((z) => ({ value: z, label: z }))}
          />
        </div>

        <Input
          label="Dirección Exacta de la Sede"
          required
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Ej: Av. Hernando Siles, Calle 14 de Obrajes #450"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Supervisor del Centro"
            required
            value={supervisor}
            onChange={(e) => setSupervisor(e.target.value)}
            placeholder="Ej: Hna. Rosario Cárdenas"
          />

          <Input
            label="Teléfono de Contacto"
            required
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej: 22784512 o 77291823"
          />

          <Input
            label="Correo Institucional"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Ej: centro@pastoral.bo"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Inicio de Convenio"
            type="date"
            required
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />

          <Input
            label="Fin de Convenio"
            type="date"
            required
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      </div>

      {/* Bloque 2: Configuración Semestral del Proyecto Receptor (N) */}
      <div className="p-4 rounded-xl border border-cato-border bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-cato-border pb-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cato-navy">
            <Layers className="w-4 h-4 text-cato-gold-dark" />
            <span>2. Proyecto Receptor por Gestión ({projectToEdit?.semestre || semestre})</span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-cato-navy border border-blue-200">
            Gestión {projectToEdit?.semestre || semestre}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Nombre del Proyecto Receptor"
            required
            value={nombreProyecto}
            onChange={(e) => setNombreProyecto(e.target.value)}
            placeholder="Ej: Hogar San Ramón - Adultos Mayores"
          />

          <Select
            label="Tarifa Fija de Pasajes (Bs/día)"
            required
            value={String(pasajeFijo)}
            onChange={(e) => setPasajeFijo(Number(e.target.value))}
            options={[
              { value: '10', label: 'Bs. 10 / día (Zona Central)' },
              { value: '12', label: 'Bs. 12 / día (Zona Media)' },
              { value: '15', label: 'Bs. 15 / día (Zona Sur / Lejana)' },
              { value: '20', label: 'Bs. 20 / día (El Alto / Especial)' },
            ]}
          />

          <Input
            label="Cupo Máximo de Voluntarios"
            type="number"
            min={1}
            max={50}
            required
            value={cupoMaximo}
            onChange={(e) => setCupoMaximo(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-cato-surface-header rounded-lg border border-cato-border">
          <Select
            label="Catolíder Titular"
            required
            value={titularId}
            onChange={(e) => setTitularId(e.target.value)}
            options={[
              { value: '', label: '-- Seleccionar Catolíder Titular --' },
              ...catolideres.map((c) => ({
                value: c.id,
                label: `${c.nombre} (${c.carrera} - ${c.nivel})`,
              })),
            ]}
          />

          <Select
            label="Catolíder Aprendiz (Opcional)"
            value={aprendizId}
            onChange={(e) => setAprendizId(e.target.value)}
            options={[
              { value: '', label: '-- Sin Catolíder Aprendiz --' },
              ...catolideres
                .filter((c) => c.id !== titularId)
                .map((c) => ({
                  value: c.id,
                  label: `${c.nombre} (${c.carrera} - ${c.nivel})`,
                })),
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-cato-slate mb-2">
            Poblaciones Objetivo Atendidas <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-cato-canvas p-3 rounded-lg border border-cato-border">
            {POBLACIONES_OBJETIVO.map((pob) => {
              const isChecked = poblaciones.includes(pob);
              return (
                <label
                  key={pob}
                  className="flex items-center gap-2 text-xs text-cato-text cursor-pointer hover:text-cato-navy"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleTogglePoblacion(pob)}
                    className="w-4 h-4 rounded text-cato-navy border-cato-input focus:ring-cato-navy"
                  />
                  <span>{pob}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-cato-slate mb-1">
            Actividades Específicas del Semestre Actual <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={actividades}
            onChange={(e) => setActividades(e.target.value)}
            placeholder="Describa puntualmente las tareas que desarrollarán los voluntarios durante este semestre..."
            className="w-full px-3 py-2 border border-cato-input rounded-md text-xs text-cato-text placeholder-cato-muted focus:outline-none focus:border-cato-navy focus:ring-1 focus:ring-cato-navy"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-cato-border flex items-center justify-end gap-3">
        <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" isLoading={isSaving}>
          {isEditing ? 'Guardar Cambios' : `Registrar en Gestión ${semestre}`}
        </Button>
      </div>
    </form>
  );
};

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectToEdit,
  instituciones,
  catolideres,
  semestre,
}) => {
  const isEditing = Boolean(projectToEdit);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditing
          ? 'Editar Institución y Proyecto Receptor'
          : 'Registrar Nuevo Proyecto Receptor'
      }
      subtitle={`Gestión activa: ${semestre} — Estructura Institución (1:N) Proyecto Receptor (RF-10, RF-11)`}
      size="xl"
    >
      <ProjectFormContent
        key={`${projectToEdit ? projectToEdit.id : 'new'}-${semestre}-${isOpen ? 'open' : 'closed'}`}
        onClose={onClose}
        onSubmit={onSubmit}
        projectToEdit={projectToEdit}
        instituciones={instituciones}
        catolideres={catolideres}
        semestre={semestre}
      />
    </Modal>
  );
};
