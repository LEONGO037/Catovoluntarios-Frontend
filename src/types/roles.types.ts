export type UserRole =
  | 'admin'
  | 'catolider'
  | 'voluntario'
  | 'postulante'
  | 'interesado';

export interface CurrentUser {
  id: string;
  nombre: string;
  correo: string;
  rol: UserRole;
  proyectoAsignadoId?: string;
}
