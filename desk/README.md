# Desk View

The desktop scene fits one screen. Each photographed object and its label opens the same preview. Mouse movement and dragging adjust the view; mobile uses large object cards.

## Structure

- `index.html`: page shell and shared `../data.js` content source.
- `js/scene.js`: content surfaces, object silhouettes, labels, and mobile crop coordinates.
- `js/geometry.js`: four-corner perspective mapping for screens, paper and photo inserts.
- `js/camera.js`: bounded mouse movement, drag handling, and reduced-motion support.
- `js/main.js`: preview contents, input events, mobile cards and section restoration.
- `js/utils.js`: shared escaping and asset-path helpers.
- `css/layout.css`: scene layout, media surfaces, object hit areas, previews, responsive rules.
- `css/theme.css`: desk appearance, portrait color treatment and book-spine typography. Room materials are graded directly in `studio-v6.webp` while preserving sunlight.
- `css/palette.css`: desk-only colors matched to the original academic stylesheet.
- `../assets/desk/`: final room artwork, lossless master and its generation prompt.

## Content

Motto uses the original profile quotation. Contact Me is attached to the pen: the visible email retains `[at]`, while the mail link uses `@`; LinkedIn comes from the same profile data. These links do not send a message automatically.

Existing academic `styles.css`, `script.js`, and `data.js` match the original repository byte for byte. Academic HTML retains the previously added one-line `view-switcher.js` integration; its original content and layout are not rewritten. The standalone switcher is the only shared integration.

Serve the site root over HTTP; ES modules and existing-page content requests are used. GitHub Pages supports the directory route `/desk/` without a build step.
