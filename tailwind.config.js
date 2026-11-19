/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Institucional Catos (Extraída de Logo Oficial)
        cato: {
          navy: '#004077',        // Primario: Sidebar, H1, cabeceras, botones primarios
          'navy-dark': '#003366', // Hover botones primarios, ítem activo sidebar
          slate: '#1A4B7C',       // Subtítulos H2/H3, etiquetas formularios
          steel: '#557FA1',       // Iconos secundarios, bordes focus suaves
          gold: '#FFCC00',        // Acento: Botones CTA ("Postúlate"), badges activos
          'gold-dark': '#E6B800',  // Hover botones dorados
          'gold-light': '#FFF7D7', // Banners crema suaves
          canvas: '#F4F7FA',      // Fondo principal de trabajo
          surface: '#FFFFFF',     // Superficie de tarjetas y modales
          'surface-header': '#F8FAFC', // Cabecera de tablas
          border: '#DCE4EE',      // Líneas divisorias de tarjetas
          'border-table': '#B8C4D0', // Bordes estándar de celdas de tabla
          input: '#CBD5E1',       // Borde estándar inputs
          text: '#1E293B',        // Texto principal de lectura
          muted: '#64748B',       // Textos secundarios y placeholders
        },
        // Semáforo de Desempeño Operativo
        semaforo: {
          green: {
            text: '#15803D',
            bg: '#DCFCE7',
            border: '#22C55E',
          },
          amber: {
            text: '#B45309',
            bg: '#FEF3C7',
            border: '#F59E0B',
          },
          red: {
            text: '#B91C1C',
            bg: '#FEE2E2',
            border: '#EF4444',
          },
          purple: {
            text: '#6D28D9',
            bg: '#EDE9FE',
            border: '#8B5CF6',
          },
        },
        // Código Cromático por Rol (Observaciones Pastoral)
        role: {
          voluntario: {
            primary: '#EAB308',
            bg: '#FEF9C3',
            text: '#854D0E',
          },
          catolider: {
            primary: '#EF4444',
            bg: '#FEE2E2',
            text: '#991B1B',
          },
          postulante: {
            primary: '#2563EB',
            bg: '#DBEAFE',
            text: '#1E40AF',
          },
          interesado: {
            primary: '#0EA5E9',
            bg: '#E0F2FE',
            text: '#0369A1',
          },
          admin: {
            primary: '#10B981',
            bg: '#D1FAE5',
            text: '#065F46',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 64, 119, 0.08)',
        modal: '0 10px 25px -5px rgba(0, 64, 119, 0.2)',
      },
    },
  },
  plugins: [],
}
