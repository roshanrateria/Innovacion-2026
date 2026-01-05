import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();

// Configure express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the built client
const staticPath = path.join(process.cwd(), 'dist', 'public');

if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
}

// Handle all routes by serving the React app
app.get('*', (req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback if built files don't exist
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Multiverse Portal</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <div id="root">
            <h1>Multiverse Portal</h1>
            <p>Application is loading...</p>
            <p>Static path: ${staticPath}</p>
            <p>Index exists: ${fs.existsSync(indexPath)}</p>
          </div>
        </body>
      </html>
    `);
  }
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
