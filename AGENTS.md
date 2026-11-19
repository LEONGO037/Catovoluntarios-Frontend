# INSTRUCCIONES DE DESARROLLO PARA AGENTES IA — FRONTEND CATOVOLUNTARIOS

Este archivo contiene las directrices operativas que **TODO AGENTE IA** debe cumplir estrictamente al generar, editar o refactorizar código en este repositorio.

---

## 1. LECTURA PREVIA OBLIGATORIA
Antes de proponer o escribir cualquier componente, servicio o módulo, debes consultar:
* **Arquitectura y Carpetas:** `docs/architecture-and-folders.md`
* **Protocolo Git Obligatorio:** `docs/git-workflow.md` (Siempre ejecutar `git fetch origin main` antes de push)
* **Requerimientos Funcionales:** `docs/requirements.md`

---

## 2. REGLAS ARQUITECTURALES DEL FRONTEND
1. **Estructura Feature-Driven:**
   * Las pantallas y componentes pertenecientes a un dominio específico deben residir en `src/features/<modulo>/components/`.
   * Los componentes transversales reutilizables en 2 o más dominios deben ubicarse en `src/components/` (ui, layout o feedback).
2. **App Shell Maestro con Sidebar:**
   * Todas las pantallas internas protegidas (Admin, Catolíder, Voluntario) deben usar el `AppShell` con el Sidebar izquierdo persistente de `260 px` en color `#004077`.
   * Solo el Portal Público (`P-01` Landing, `P-02` Login y `P-04/P-05` Formulario de Postulación) utiliza el `PublicNavbar`.
3. **Control de Estilos y Paleta Cromática:**
   * Utilizar **ÚNICAMENTE** las clases de Tailwind configuradas en `tailwind.config.js`.
   * Colores institucionales: `cato-navy` (`#004077`), `cato-gold` (`#FFCC00`), `cato-canvas` (`#F4F7FA`), etc.
   * Badges de Semáforo: `badge-semaforo-green`, `badge-semaforo-amber`, `badge-semaforo-red`, `badge-semaforo-purple`.
   * Badges de Rol: `badge-role-voluntario` (Amarillo), `badge-role-catolider` (Rojo), `badge-role-postulante` (Azul), `badge-role-admin` (Verde).
   * **Prohibido** usar colores hexadecimales quemados arbitrariamente en inline styles.
4. **Tipado Estricto con TypeScript:**
   * Prohibido el uso de `any`. Definir interfaces explícitas para props, DTOs y respuestas de la API en `src/types/` o en el módulo correspondiente.
5. **Separación de Responsabilidades:**
   * La lógica de consumo de API debe encapsularse en `src/services/` utilizando el cliente HTTP centralizado `src/services/api.client.ts`.
   * La lógica de estado compleja debe modularse en Custom Hooks (`src/features/<modulo>/hooks/`).

---

## 3. REGLAS DE NEGOCIO CRÍTICAS QUE NO DEBEN ROMPERSE
* **Filtro Anti-Sobrecarga (RF-03):** El wizard de postulación debe bloquear el avance si `numero_materias > 6`.
* **Seguro Estudiantil Obligatorio (RF-07):** Un voluntario no puede registrar horas ni iniciar voluntariado en campo si `poliza_validada = false`.
* **Pasajes Fijos por Proyecto (RF-17):** La reposición de pasajes es un monto fijo predeterminado por el proyecto receptor; no aceptar montos con decimales arbitrarios ingresados por el voluntario.
* **Principio de Menor Privilegio (RF-02):** Los Catolíderes solo tienen acceso de lectura (consulta) en la bandeja de postulantes `P-06`.

---

## 4. PROTOCOLO GIT OBLIGATORIO PARA AGENTES
Al preparar un commit o push:
```bash
git add .
git commit -m "feat(modulo): descripcion de la implementacion"
git fetch origin main
git rebase origin/main
git push origin <rama>
```
Si hay conflictos, resolverlos manteniendo la coherencia funcional y asegurando que `npm run build` pase con éxito antes de empujar.
