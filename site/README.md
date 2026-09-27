# Miramare Residence — demo

Three-screen scroll demo: logo intro → hero day/night loop → fly-through → scroll-scrubbed apartment walk → fly-through → beach loop. EN / RO.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

Web videos are produced from the raw clips in the project root by `bash tools/encode.sh`.
Pushing to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).
