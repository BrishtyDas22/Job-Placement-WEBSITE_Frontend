# WOLT frontend

Open `index.html` in a modern browser, or use VS Code Live Server. No installation or build step is required.

- `index.html`: all seven sections from the supplied mockup, plus the application preview.
- `style.css`: responsive layouts, blended photo backgrounds, light/dark themes, and CSS animations.
- `app.js`: small, framework-free enhancements for the theme switch, mobile menu, scroll effects, track selection, validation, and preview dialog.
- `assets/`: three original AI-generated photographs for the hero, program, and career growth sections. Exact prompts and generation method are recorded in `assets/IMAGE-PROMPTS.md`.
- `reference/`: original mockup images, retained only as design references.

The application form is a frontend demo. It validates fields and selected files and opens a local preview; it does not submit, upload, or save personal information. Theme preference is saved locally when browser storage is available.

Google Fonts is optional and requires internet access; local fallback fonts are included. Images are local. Motion follows the device's reduced-motion preference.

Verification: navigation targets, duplicate IDs, CSS brace balance, and local asset paths checked. Browser visual and interaction verification could not run because no browser was connected in the execution environment.
