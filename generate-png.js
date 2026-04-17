const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = './png';

const SIZES = [
  { name: '64',   width: 64 },
  { name: '128',  width: 128 },
  { name: '256',  width: 256 },
  { name: '512',  width: 512 },
  { name: '1024', width: 1024 },
  { name: '2048', width: 2048 },
];

const SOURCES = [
  { input: 'ploky-wordmark.svg',             prefix: 'dark-bg' },
  { input: 'ploky-wordmark-transparent.svg', prefix: 'transparent' },
];

async function generate() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }

  for (const source of SOURCES) {
    const svgPath = path.resolve(source.input);
    if (!fs.existsSync(svgPath)) {
      console.warn(`SVG not found: ${svgPath}`);
      continue;
    }
    console.log(`\nProcessing: ${source.input}`);

    for (const size of SIZES) {
      const outputName = `${source.prefix}-ploky-wordmark-${size.name}.png`;
      const outputPath = path.join(OUTPUT_DIR, outputName);
      try {
        await sharp(svgPath)
          .resize({ width: size.width })
          .png()
          .toFile(outputPath);
        console.log(`  OK: ${outputName} (${size.width}px)`);
      } catch (err) {
        console.error(`  Failed: ${outputName}`, err.message);
      }
    }
  }
  console.log('\nDone! Check the ./png folder.');
}

generate();
