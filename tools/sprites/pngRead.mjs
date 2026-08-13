// Minimal PNG decoder — 8-bit greyscale/RGB/palette/RGBA, filters 0-4, no
// interlace. Enough to load reference art and measure it (palette, figure
// height, colour count) instead of guessing at it from a thumbnail.

import { inflateSync } from 'node:zlib';

export function decodePNG(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let p = 8;
  let ihdr = null;
  let palette = null;
  let trns = null;
  const idat = [];

  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      ihdr = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        depth: data[8],
        colour: data[9],
        interlace: data[12],
      };
    } else if (type === 'PLTE') palette = Buffer.from(data);
    else if (type === 'tRNS') trns = Buffer.from(data);
    else if (type === 'IDAT') idat.push(Buffer.from(data));
    else if (type === 'IEND') break;
    p += 12 + len;
  }

  if (!ihdr) throw new Error('no IHDR');
  if (ihdr.interlace) throw new Error('interlaced PNGs not supported');
  if (ihdr.depth !== 8 && ihdr.colour !== 3) {
    throw new Error('unsupported bit depth ' + ihdr.depth);
  }

  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.colour];
  if (!channels) throw new Error('unsupported colour type ' + ihdr.colour);

  const { width: w, height: h } = ihdr;
  // Sub-byte palette images pack several pixels per byte; the filters still
  // operate on whole bytes, so unpacking happens after unfiltering.
  const stride = Math.ceil((w * channels * ihdr.depth) / 8);
  const bpp = Math.max(1, (channels * ihdr.depth) / 8);
  const raw = inflateSync(Buffer.concat(idat));
  const lines = Buffer.alloc(h * stride);

  // Undo the per-scanline filters.
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)];
    const src = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const cur = lines.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? lines.subarray((y - 1) * stride, y * stride) : null;
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0;
      const b = prev ? prev[i] : 0;
      const c = prev && i >= bpp ? prev[i - bpp] : 0;
      let v = src[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const pp = a + b - c;
        const pa = Math.abs(pp - a);
        const pb = Math.abs(pp - b);
        const pc = Math.abs(pp - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[i] = v & 0xff;
    }
  }

  // Expand sub-byte palette indices to one byte each. GBA-era sprite rips are
  // usually 4-bit indexed, which is the whole point: 16 colours.
  let expanded = lines;
  if (ihdr.depth < 8) {
    expanded = Buffer.alloc(h * w);
    const per = 8 / ihdr.depth;
    const mask = (1 << ihdr.depth) - 1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const byte = lines[y * stride + Math.floor(x / per)];
        expanded[y * w + x] = (byte >> (8 - ihdr.depth * ((x % per) + 1))) & mask;
      }
    }
  }
  const px = ihdr.depth < 8 ? expanded : lines;
  const step = ihdr.depth < 8 ? 1 : channels;

  const rgba = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const s = i * step;
    const o = i * 4;
    if (ihdr.colour === 3) {
      const idx = px[s];
      rgba[o] = palette[idx * 3];
      rgba[o + 1] = palette[idx * 3 + 1];
      rgba[o + 2] = palette[idx * 3 + 2];
      rgba[o + 3] = trns && idx < trns.length ? trns[idx] : 255;
    } else if (ihdr.colour === 0 || ihdr.colour === 4) {
      rgba[o] = rgba[o + 1] = rgba[o + 2] = px[s];
      rgba[o + 3] = ihdr.colour === 4 ? px[s + 1] : 255;
    } else {
      rgba[o] = px[s];
      rgba[o + 1] = px[s + 1];
      rgba[o + 2] = px[s + 2];
      rgba[o + 3] = ihdr.colour === 6 ? px[s + 3] : 255;
    }
  }
  return { width: w, height: h, data: rgba };
}
