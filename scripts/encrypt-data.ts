import CryptoJS from 'crypto-js'
import fs from 'fs'
import path from 'path'

const DATA_ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY

if (!DATA_ENCRYPTION_KEY) {
  console.error('Error: DATA_ENCRYPTION_KEY is not defined in .env')
  process.exit(1)
}

const inputPath = path.join(process.cwd(), 'data', 'families.secret.json')
const outputPath = path.join(process.cwd(), 'data', 'families.enc')

try {
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Source file not found at ${inputPath}`)
    process.exit(1)
  }

  const rawData = fs.readFileSync(inputPath, 'utf-8')

  // Encrypt
  const encrypted = CryptoJS.AES.encrypt(rawData, DATA_ENCRYPTION_KEY).toString()

  fs.writeFileSync(outputPath, encrypted)
  console.log(`Successfully encrypted data to ${outputPath}`)
} catch (error) {
  console.error('Encryption failed:', error)
  process.exit(1)
}
