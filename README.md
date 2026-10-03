# Movielist — app híbrida (HTML/JS + Capacitor)

Obligatorio de Taller (Universidad ORT, 2026). Aplicación web empaquetada como app móvil con **Capacitor**. Consume la API `movielist.develotion.com` (países, categorías y operaciones autenticadas con token Bearer) y muestra un mapa con tiles de OpenStreetMap.

## Contenido

```
www/
  index.html
  script.js
```

## Nota importante

Este repo contiene **solo la carpeta `www/`** (la parte web). `index.html` carga `capacitor.js`, que genera Capacitor al armar el proyecto nativo, así que abrirlo directo en el navegador no funciona completo. Para rearmar la app hay que crear un proyecto Capacitor y usar esta carpeta como `webDir`.

El `.apk` compilado no se versiona en el repo; si querés compartirlo, subilo como *Release* de GitHub.
