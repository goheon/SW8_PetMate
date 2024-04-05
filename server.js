import fs from 'node:fs/promises';
import express from 'express';
import dotenv from 'dotenv';
<<<<<<< HEAD
import { authRouter } from './routes/auth.js';
import mongoose from "mongoose";
=======

>>>>>>> 6d56d0107d4b1921bc2d10f045856a30bd0bf787
dotenv.config();

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';
const db_id = process.env.DB_ID;
const db_pw = process.env.DB_PW;

// Cached production assets
const templateHtml = isProduction ? await fs.readFile('./dist/client/index.html', 'utf-8') : '';
const ssrManifest = isProduction ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8') : undefined;

// Create http server
const app = express();
app.use(express.json());

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}
<<<<<<< HEAD
//mongoose, mongodb 연결
async function connectToMongoDB() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PW}@petmate.bhm01el.mongodb.net/?retryWrites=true&w=majority&appName=PetMate`,
    );
    console.log("MongoDB 연결 성공");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();


//Serve APIs
app.use('/signup',authRouter);

=======
>>>>>>> 6d56d0107d4b1921bc2d10f045856a30bd0bf787

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
    } else {
      template = templateHtml;
      render = (await import('./dist/server/entry-server.js')).render;
    }

    const rendered = await render(url, ssrManifest);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});
//

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
