const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function generateManifest(directory) {
  const manifest = {};

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const relativePath = path.relative(directory, filePath);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else {
        const content = fs.readFileSync(filePath);
        const hash = crypto.createHash("md5").update(content).digest("hex");
        manifest[`/${relativePath.replace(/\\/g, "/")}`] = hash;
      }
    }
  }

  walkDir(directory);
  return manifest;
}

const distPath = path.join(__dirname, "front-end", "dist");
const manifest = generateManifest(distPath);

// Ensure the src directory exists
const srcDir = path.join(__dirname, "src");
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

const manifestPath = path.join(srcDir, "assets-manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log("Manifest generated successfully at:", manifestPath);
