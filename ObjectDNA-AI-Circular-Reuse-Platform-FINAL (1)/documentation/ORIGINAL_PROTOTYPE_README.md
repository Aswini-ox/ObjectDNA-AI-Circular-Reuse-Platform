# ObjectDNA Preview

ObjectDNA is an offline-first product preview for an AI object life-path engine.
It demonstrates the core journey:

`OBJECT -> CONDITION -> COMPONENTS -> POSSIBILITIES -> COMPARISON -> ACTION`

## Run it

No install or build step is required. From this folder, run any static server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

Opening `index.html` directly also renders the page, but a local server enables the service worker and installable app shell.

## Included in this preview

- Responsive ObjectDNA landing and scanner experience.
- Upload/dropzone with image validation and local preview.
- Six deterministic demo objects that work without an AI key or backend.
- Animated four-phase analysis state.
- Repair, reimagine, pass-on and recover comparison matrix.
- Interactive `What if this wasn't waste?` transformation control.
- Six-stage ObjectDNA method selector.
- Accessible labels, keyboard-operable upload area and reduced-motion support.
- Local service worker and web manifest.

## Production handoff

The local `runAnalysis` boundary in `app.js` is the integration point for a vision model. Replace the deterministic demo data with a request to a secured backend, retain the loading/error states, and validate returned fields before rendering.
