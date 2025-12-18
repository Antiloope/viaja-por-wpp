# Viaja por WhatsApp

Página web simple creada con React y Vite, lista para hostear en GitHub Pages.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build

```bash
npm run build
```

### Deploy a GitHub Pages

```bash
npm run deploy
```

**Nota:** Asegúrate de actualizar el `base` en `vite.config.js` con el nombre de tu repositorio de GitHub.

## 📁 Estructura del Proyecto

```
viaja-por-wpp/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos del componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── index.html
├── vite.config.js       # Configuración de Vite
└── package.json
```

## ✨ Agregar Nuevos Componentes

Para agregar nuevos componentes, simplemente crea archivos en la carpeta `src/` y impórtalos en `App.jsx`:

```jsx
import MiNuevoComponente from './components/MiNuevoComponente'

// Usar en el JSX
<MiNuevoComponente />
```

## 📝 Notas

- Proyecto configurado para GitHub Pages
- Estructura simple y fácil de extender
- React 18 con Vite para desarrollo rápido

