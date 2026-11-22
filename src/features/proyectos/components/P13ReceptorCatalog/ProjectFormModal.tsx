import React, { useState } from 'react';
import type { ProyectoReceptor, CatoliderInfo } from '../../types/proyectos.types';
import { ZONAS_LA_PAZ } from '../../../../constants/zonas';
import { POBLACIONES_OBJETIVO } from '../../../../constants/poblaciones';
import { Modal } from '../../../../components/ui/Modal';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';

export interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ProyectoReceptor, 'id' | 'estado'>) => void;
  projectToEdit?: ProyectoReceptor | null;
  catolideres: CatoliderInfo[];
}

interface ProjectFormContentProps {
  onClose: () => void;
  onSubmit: (data: Omit<ProyectoReceptor, 'id' | 'estado'>) => void;
  projectToEdit?: ProyectoReceptor | null;
  catolideres: CatoliderInfo[];
}

const ProjectFormContent: React.FC<ProjectFormContentProps> = ({
  onClose,
  onSubmit,
  projectToEdit,
  catolideres,
}) => {
  const isEditing = Boolean(projectToEdit);

  const [nombre, setNombre] = useState(projectToEdit?.nombre_proyecto || '');
  const [direccion, setDireccion] = useState(projectToEdit?.direccion_exacta || '');
  const [macrodistrito, setMacrodistrito] = useState(
    projectToEdit?.macrodistrito_zona || ZONAS_LA_PAZ[0]
  );
  const [supervisor, setSupervisor] = useState(
    projectToEdit?.nombre_supervisor_centro || ''
  );
  const [telefono, setTelefono] = useState(projectToEdit?.telefono_contacto || '');
  const [correo, setCorreo] = useState(projectToEdit?.correo || '');
  const [fechaInicio, setFechaInicio] = useState(
    projectToEdit?.fecha_inicio_convenio || '2026-02-01'
  );
  const [fechaFin, setFechaFin] = useState(
    projectToEdit?.fecha_fin_convenio || '2026-12-15'
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
  const [errorMsg, setErrorMsg] = useState('');

  const handleTogglePoblacion = (pob: string) => {
    setPoblaciones((prev) =>
      prev.includes(pob) ? prev.filter((p) => p !== pob) : [...prev, pob]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorMsg('El nombre del proyecto es obligatorio');
      return;
    }
    if (!direccion.trim()) {
      setErrorMsg('La dirección exacta es obligatoria');
      return;
    }
    if (!supervisor.trim()) {
      setErrorMsg('El nombre del supervisor del centro es obligatorio');
      return;
    }
    if (!telefono.trim()) {
      setErrorMsg('El teléfono de contacto es obligatorio');
      return;
    }
    if (poblaciones.length === 0) {
      setErrorMsg('Seleccione al menos una población objetivo');
      return;
    }
    if (!actividades.trim()) {
      setErrorMsg('Las actividades del semestre actual son obligatorias');
      return;
    }
    if (!titularId) {
      setErrorMsg('Debe designar un Catolíder Titular');
      return;
    }

    onSubmit({
      nombre_proyecto: nombre.trim(),
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
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 text-red-800 text-xs border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Nombre y Zona */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre Oficial del Proyecto Receptor"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Hogar San Ramón de Adultos Mayores"
        />

        <Select
          label="Macrodistrito / Zona (La Paz / El Alto)"
          required
          value={macrodistrito}
          onChange={(e) => setMacrodistrito(e.target.value)}
          options={ZONAS_LA_PAZ.map((z) => ({ value: z, label: z }))}
        />
      </div>

      {/* Dirección exacta */}
      <Input
        label="Dirección Exacta"
        required
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        placeholder="Ej: Av. Hernando Siles, Calle 14 de Obrajes #450"
      />

      {/* Supervisor y Contactos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Nombre del Supervisor del Centro"
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
          label="Correo Electrónico Institucional"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Ej: centro@pastoral.bo"
        />
      </div>

      {/* Vigencia Convenio y Cupos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Catolíderes Asignados */}
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

      {/* Poblaciones Objetivo Multi-check */}
      <div>
        <label className="block text-xs font-semibold text-cato-slate mb-2">
          Poblaciones Objetivo Atendidas (Seleccione las aplicables)
          <span className="text-red-500 ml-0.5">*</span>
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

      {/* Actividades Semestre Actual */}
      <div>
        <label className="block text-xs font-semibold text-cato-slate mb-1">
          Actividades Específicas del Semestre Actual
          <span className="text-red-500 ml-0.5">*</span>
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

      {/* Form Actions */}
      <div className="pt-4 border-t border-cato-border flex items-center justify-end gap-3">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          {isEditing ? 'Guardar Cambios' : 'Registrar Proyecto'}
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
  catolideres,
}) => {
  const isEditing = Boolean(projectToEdit);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Proyecto Receptor' : 'Registrar Nuevo Proyecto Receptor'}
      subtitle="Complete los campos requeridos para la ficha técnica institucional (RF-10, RF-11)"
      size="xl"
    >
      <ProjectFormContent
        key={projectToEdit ? projectToEdit.id : 'new-project'}
        onClose={onClose}
        onSubmit={onSubmit}
        projectToEdit={projectToEdit}
        catolideres={catolideres}
      />
    </Modal>
  );
};
