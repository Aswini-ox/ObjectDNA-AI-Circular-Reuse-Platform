# Technical Documentation

## Application structure

source_code/objectdna-preview/
- index.html — application markup and sections
- styles.css — responsive visual system and layout
- app.js — demo object data, analysis state, pathway rendering and interactions
- assets/icon.svg — ObjectDNA icon
- manifest.webmanifest — installable web app metadata
- sw.js — service worker
- README.md — local run instructions
- ERROR_FIX_REPORT.md — verification and reliability notes

## Main data model
The prototype contains demo object records for:
- Wooden chair
- Old bicycle
- Damaged laptop
- Torn jeans
- Plastic bottle
- Old suitcase

Each demo record contains an object name, label, visual class, summary, tags and a recommended pathway.

## Pathway model
The UI compares:
- Repair it
- Reimagine it
- Pass it on
- Recover parts

Each pathway includes a description, practical fit/impact metadata and a score used by the demo UI.

## Production architecture direction

Browser
  |
  v
Secure Backend API
  |
  +--> Vision/AI model
  |
  +--> Validation + safety rules
  |
  +--> Circular pathway engine
  |
  v
Structured ObjectDNA response
  |
  v
Web UI

The browser should not expose private AI API keys. Production model calls should happen through a secured backend with authentication, rate limits, file validation and response validation.
