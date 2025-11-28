// faf.js - Fire and Forget (POC)
//
// Async file write with atomic rename and dedupe handling.
// Caller owns filename strategy; FAF owns atomic-write-with-dedupe mechanics.

import fs from 'fs/promises'
import path from 'path'
import os from 'os'

/**
 * Fire and forget write
 *
 * @param {Object} options
 * @param {string} options.folder - Target folder path
 * @param {string} options.filename - Target filename (without path)
 * @param {string} options.dedupe - Dedupe algorithm ('numeric-digit')
 * @param {Object} options.record - Data to write
 * @returns {Promise<{ written: string }>} - The actual filename written
 */
export async function write({ folder, filename, dedupe, record }) {
  // Ensure target folder exists
  await fs.mkdir(folder, { recursive: true })

  // Find unique filename
  const finalFilename = await findUniqueFilename(folder, filename, dedupe)
  const finalPath = path.join(folder, finalFilename)

  // Write to temp file first
  const tempPath = path.join(os.tmpdir(), `spl-faf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.tmp`)

  await fs.writeFile(tempPath, JSON.stringify(record, null, 2))

  // Atomic rename to final location
  await fs.rename(tempPath, finalPath)

  return { written: finalFilename }
}

/**
 * Find unique filename using dedupe algorithm
 */
async function findUniqueFilename(folder, filename, dedupe) {
  const targetPath = path.join(folder, filename)

  // Try original filename first
  if (!await exists(targetPath)) {
    return filename
  }

  // Apply dedupe algorithm
  if (dedupe === 'numeric-digit') {
    return await dedupeNumericDigit(folder, filename)
  }

  throw new Error(`Unknown dedupe algorithm: ${dedupe}`)
}

/**
 * Numeric digit dedupe: append 0, 1, 2... until unique
 * 1732789234567.json -> 17327892345670.json -> 17327892345671.json
 */
async function dedupeNumericDigit(folder, filename) {
  const ext = path.extname(filename)
  const base = path.basename(filename, ext)

  let digit = 0
  while (digit < 1000) {
    const candidate = `${base}${digit}${ext}`
    const candidatePath = path.join(folder, candidate)

    if (!await exists(candidatePath)) {
      return candidate
    }
    digit++
  }

  throw new Error(`Dedupe exhausted: could not find unique filename for ${filename}`)
}

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}
