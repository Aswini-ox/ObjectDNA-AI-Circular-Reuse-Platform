# Setup Instructions

## Requirements
- Python 3.x (for the simplest local static server)
- A modern web browser

## Run
Open a terminal in:

source_code/objectdna-preview

Run:

```bash
python -m http.server 4173
```

Open:

http://localhost:4173

## No npm install required
This prototype is dependency-free and does not require Node.js or a package manager.

## Render static deployment
The application can be served as a static site. Because `index.html` is inside the project folder, the static site root should point to the folder containing `index.html`.

## Troubleshooting
If the browser shows a blank page:
1. Confirm `index.html`, `styles.css` and `app.js` are in the same directory.
2. Use the local HTTP server instead of opening from an unusual file location.
3. Check browser developer-console errors.
