# Vela Matute Institute

Sitio web / PWA del Instituto Vela Matute — Cátedra Libre Antidrogas (CLIAD).
React + Vite, igual stack que Vela Fertility y Vela Venezuela.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview   # para probar el build localmente
```

## Desplegar en Vercel (mismo flujo que tus otros proyectos Vela)

1. Sube este proyecto a un repo nuevo en tu cuenta de GitHub (gigimatute):
   ```bash
   git init
   git add .
   git commit -m "Vela Matute Institute — versión inicial"
   git branch -M main
   git remote add origin https://github.com/gigimatute/vela-matute-institute.git
   git push -u origin main
   ```
2. En Vercel (team "Ava Companion"): New Project → Import desde GitHub →
   selecciona `vela-matute-institute` → Framework Preset: Vite → Deploy.
3. Listo — te da una URL tipo `vela-matute-institute.vercel.app`.
   Puedes conectar un dominio propio después desde Vercel → Settings → Domains.

## Conectar el Google Sheet (para que tu tío edite el contenido)

Abre `src/App.jsx` y busca la línea:

```js
const SHEET_ID = "";
```

Pega ahí el ID de tu Google Sheet (instrucciones completas de cómo armar el
Sheet con las pestañas "Distinciones" y "Biblioteca" ya las tienes en el chat).
Si lo dejas vacío, el sitio simplemente muestra el contenido que ya está
escrito en el código — nunca se rompe.

## Instalar como app en el teléfono (PWA)

Una vez desplegado en Vercel (HTTPS), cualquier persona puede:
- **Android/Chrome:** abrir el link → menú (⋮) → "Instalar app" / "Agregar a pantalla de inicio".
- **iPhone/Safari:** abrir el link → botón compartir → "Agregar a pantalla de inicio".

Queda como ícono en el teléfono, abre a pantalla completa, sin barra de navegador.
