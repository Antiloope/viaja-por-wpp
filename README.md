# Viaja por WhatsApp

Plataforma para empresas de transporte privado que permite recibir solicitudes estructuradas vía WhatsApp. Los usuarios pueden seleccionar origen y destino en un mapa interactivo y enviar la solicitud directamente por WhatsApp.

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

## 📦 Deploy a GitHub Pages

### Paso 1: Crear repositorio en GitHub

1. Ve a [GitHub](https://github.com) y crea un nuevo repositorio
2. **Importante:** Anota el nombre exacto del repositorio (ej: `viaja-por-wpp`)

### Paso 2: Configurar el base path

Abre `vite.config.js` y actualiza el `base` con el nombre de tu repositorio:

```js
export default defineConfig({
  plugins: [react()],
  base: '/NOMBRE-DE-TU-REPO/',  // ⚠️ Cambia esto por el nombre de tu repo
})
```

**Ejemplo:** Si tu repo se llama `mi-transporte`, sería:
```js
base: '/mi-transporte/',
```

### Paso 3: Inicializar Git (si no lo has hecho)

```bash
git init
git add .
git commit -m "Initial commit"
```

### Paso 4: Conectar con GitHub

```bash
git remote add origin https://github.com/TU-USUARIO/NOMBRE-DE-TU-REPO.git
git branch -M main
git push -u origin main
```

### Paso 5: Hacer deploy

```bash
npm run deploy
```

Este comando:
1. Construye la aplicación (`npm run build`)
2. Crea/actualiza la rama `gh-pages` con los archivos de `dist`
3. GitHub Pages automáticamente publica el sitio

### Paso 6: Activar GitHub Pages (si es necesario)

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. En "Source", selecciona la rama `gh-pages` y la carpeta `/ (root)`
4. Guarda

Tu sitio estará disponible en:
```
https://TU-USUARIO.github.io/NOMBRE-DE-TU-REPO/
```

### Actualizar el sitio

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
npm run deploy
```

## 📁 Estructura del Proyecto

```
viaja-por-wpp/
├── src/
│   ├── components/        # Componentes React
│   │   ├── LocationPicker.jsx
│   │   ├── RequestForm.jsx
│   │   ├── CompanyHeader.jsx
│   │   └── ...
│   ├── context/           # Contextos (i18n)
│   ├── data/              # Configuración y traducciones
│   ├── utils/             # Utilidades
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## ⚙️ Configuración

### Personalizar información de la empresa

Edita `src/data/companyConfig.js`:

```js
export const companyConfig = {
  name: "Tu Empresa",
  whatsappNumber: "1234567890",  // Solo números, sin + ni espacios
  description: "Descripción de tu servicio",
  operatingArea: "Tu área de operación",
  mapCenter: { lat: -32.8895, lng: -68.8458 },  // Coordenadas iniciales
  mapZoom: 13
}
```

## 🌍 Características

- ✅ Mapa interactivo con React-Leaflet (OpenStreetMap)
- ✅ Selección de ubicación por click, drag & drop o búsqueda
- ✅ Autocompletado de direcciones
- ✅ Geocodificación inversa (coordenadas → dirección)
- ✅ Bilingüe (Español/Inglés)
- ✅ Diseño mobile-first
- ✅ Integración con WhatsApp

## 📝 Notas

- El proyecto usa **gh-pages** para deploy automático
- El `base` en `vite.config.js` debe coincidir con el nombre del repositorio
- GitHub Pages es gratuito para repositorios públicos
- Los cambios pueden tardar unos minutos en aparecer después del deploy
