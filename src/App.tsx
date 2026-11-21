import { useState, useMemo } from 'react';
import type { UserRole } from './types/roles.types';
import { AppShell } from './components/layout/AppShell';
import { P13ReceptorCatalog } from './features/proyectos/components/P13ReceptorCatalog/P13ReceptorCatalog';
import { P14MatchingBoard } from './features/proyectos/components/P14MatchingBoard/P14MatchingBoard';
import { P15TransferManager } from './features/proyectos/components/P15TransferManager/P15TransferManager';
import { proyectosService } from './features/proyectos/services/proyectos.service';

export default function App() {
  const [currentView, setCurrentView] = useState<'p13' | 'p14' | 'p15'>('p13');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [searchTerm, setSearchTerm] = useState('');

  // Sincronización de conteos por proyecto
  const voluntariosCountsByProject = useMemo(() => {
    const voluntarios = proyectosService.getVoluntarios();
    return voluntarios.reduce<Record<string, number>>((acc, v) => {
      if (v.proyecto_id) {
        acc[v.proyecto_id] = (acc[v.proyecto_id] || 0) + 1;
      }
      return acc;
    }, {});
  }, []);

  const pageTitles: Record<'p13' | 'p14' | 'p15', string> = {
    p13: 'Módulo 05 — P-13: Catálogo y Ficha de Proyectos Receptores',
    p14: 'Módulo 05 — P-14: Asignación Inteligente y Ubicación de Voluntarios',
    p15: 'Módulo 05 — P-15: Gestión de Reasignaciones y Traslados entre Proyectos',
  };

  return (
    <AppShell
      currentView={currentView}
      onNavigate={setCurrentView}
      currentRole={currentRole}
      onRoleChange={setCurrentRole}
      pageTitle={pageTitles[currentView]}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    >
      {currentView === 'p13' && (
        <P13ReceptorCatalog
          userRole={currentRole}
          voluntariosCountsByProject={voluntariosCountsByProject}
        />
      )}

      {currentView === 'p14' && (
        <P14MatchingBoard
          userRole={currentRole}
          voluntariosCountsByProject={voluntariosCountsByProject}
        />
      )}

      {currentView === 'p15' && (
        <P15TransferManager userRole={currentRole} />
      )}
    </AppShell>
  );
}
