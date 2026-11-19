# FLUJO DE TRABAJO Y PROTOCOLO GIT OBLIGATORIO — FRONTEND
**Repositorio Oficial:** `https://github.com/LEONGO037/Catovoluntarios-Frontend.git`  
**Rama Principal de Producción:** `main`

---

## 1. REGLA FUNDAMENTAL DE SINCRONIZACIÓN (FETCH PREVIO)
> [!IMPORTANT]
> **ANTES DE SUBIR CUALQUIER CAMBIO AL REPOSITORIO REMOTO, ES OBLIGATORIO HACER UN `FETCH` Y REBASAR/INTEGRAR CON LA RAMA `main`.**  
> Esto garantiza que nadie sobrescriba el trabajo de otros compañeros de equipo, previene divergencias en el historial y mantiene el repositorio siempre al día.

---

## 2. PASO A PASO PARA SUBIR CAMBIOS AL REPOSITORIO

### Paso 1: Verificar el Estado Local
Asegurarse de qué archivos han sido modificados o agregados:
```bash
git status
```

### Paso 2: Guardar el Trabajo en la Rama Local (Stash o Commit)
Hacer commit de los cambios locales con un mensaje claro y descriptivo siguiendo Conventional Commits:
```bash
git add .
git commit -m "feat(admision): implementacion de validacion anti-sobrecarga en wizard P-04"
```

### Paso 3: Sincronizar Obligatoriamente con `main` Remoto (Fetch)
Antes de ejecutar `git push`, descargar los cambios más recientes del repositorio:
```bash
# 1. Traer las referencias del servidor remoto
git fetch origin main

# 2. Rebasar o integrar los cambios de main sobre tu rama local
git rebase origin/main
# (O alternativamente: git merge origin/main)
```

### Paso 4: Resolución de Conflictos (Si existieran)
Si durante el `rebase` o `merge` se detecta algún conflicto en archivos compartidos:
1. Abrir los archivos en conflicto y conservar la versión consensuada.
2. Añadir los archivos resueltos:
   ```bash
   git add <archivo-resuelto>
   ```
3. Continuar el rebase:
   ```bash
   git rebase --continue
   ```
4. Probar que la aplicación compila sin errores:
   ```bash
   npm run build
   ```

### Paso 5: Enviar los Cambios al Remoto (Push)
Una vez verificado que el código local está 100% sincronizado con `main`:
```bash
git push origin <tu-rama>
# O si trabajas directamente en main autorizado:
git push origin main
```

---

## 3. CONVENCIONES DE RAMAS Y COMMITS

### 3.1 Nombres de Ramas
* `feat/M01-landing-appshell` (Nuevas características por módulo)
* `feat/M02-wizard-postulacion`
* `fix/M04-ci-panel-derecho` (Corrección de bugs)
* `refactor/components-button-ui` (Mejoras estructurales sin cambio de lógica)

### 3.2 Formato de Mensajes de Commit
* `feat(modulo): descripción clara en minúsculas`
* `fix(modulo): descripción de la corrección`
* `docs(arquitectura): actualización de guías markdown`
* `style(tailwind): ajuste de colores de semáforos`
