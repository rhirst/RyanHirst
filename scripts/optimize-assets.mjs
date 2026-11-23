import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import wawoff2 from 'wawoff2'

const asset = path => new URL(`../src/${path}`, import.meta.url)

for (const [name, source] of [['profile', 'profile.png'], ['profile_dark', 'profile_dark.jpeg']]) {
  for (const width of [120, 240, 360]) {
    const output = asset(`images/${name}-${width}.webp`)
    await sharp(await readFile(asset(`images/${source}`)))
      .resize(width, width, { fit: 'cover' })
      .webp({ quality: 80, effort: 6 })
      .toFile(fileURLToPath(output))
    console.log(`Generated ${name}-${width}.webp`)
  }
}

for (const face of ['Regular', 'Medium', 'Bold', 'BoldItalic']) {
  const base = `fonts/IBM_Plex_Serif/IBMPlexSerif-${face}`
  // Convert the complete font without subsetting or changing its glyph coverage.
  const compressed = await wawoff2.compress(await readFile(asset(`${base}.ttf`)))
  await writeFile(asset(`${base}.woff2`), compressed)
  console.log(`Generated IBMPlexSerif-${face}.woff2`)
}
