Project Setup (local PHP + simple webserver)


1) Prereqs:
   - PHP 8+ with CLI and web server
   - Composer (for tcpdf or place tcpdf library in backend/tcpdf_min)
   - Node + npm (optional to run a dev server for React static import)


2) Quick static deployment (no bundler):
   - Place `public/` folder on your webroot (e.g. htdocs or public_html)
   - Place `src/App.jsx` as an ES module under /src/
   - Place backend/ folder alongside public and configure PHP to serve backend


3) Running locally with PHP built-in server:
   - From project root run: php -S 0.0.0.0:8000 -t public
   - Visit http://localhost:8000


4) Install TCPDF (for PDF):
   - composer require tecnickcom/tcpdf
   - or download TCPDF and extract into backend/tcpdf_min


5) Security notes:
   - This example is minimal and for demonstration only. Validate and sanitize all inputs before using in production.
   - Protect order storage and PDF generation from arbitrary file writes.
