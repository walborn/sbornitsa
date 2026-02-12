import CryptoJS from 'crypto-js'
import fs from 'fs'
import path from 'path'

const DATA_ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY

if (!DATA_ENCRYPTION_KEY) {
  console.error('Error: DATA_ENCRYPTION_KEY is not defined in environment variables')
  process.exit(1)
}

const inputPath = path.join(process.cwd(), 'data', 'families.enc')
const outputPath = path.join(process.cwd(), 'lib', 'data', 'families-generated.json')

// If encryption source doesn't exist (e.g. local dev without it), we might fail or check for secret json
// But for this workflow, we assume we want to decrypt families.enc
try {
  if (!fs.existsSync(inputPath)) {
    // Fallback: if families.secret.json exists (local dev), use that instead of failing
    const localSecretPath = path.join(process.cwd(), 'data', 'families.secret.json')
    if (fs.existsSync(localSecretPath)) {
      console.log('Encrypted file not found, using local secret file...')
      const rawData = fs.readFileSync(localSecretPath, 'utf-8')
      processData(rawData)
      process.exit(0)
    }
    console.error(`Error: Encrypted file not found at ${inputPath}`)
    process.exit(1)
  }

  const encrypted = fs.readFileSync(inputPath, 'utf-8')

  // Decrypt
  const bytes = CryptoJS.AES.decrypt(encrypted, DATA_ENCRYPTION_KEY)
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8)

  if (!decryptedData) {
    console.error('Error: Decryption failed (invalid key or corrupted data)')
    process.exit(1)
  }

  processData(decryptedData)
} catch (error) {
  console.error('Build data generation failed:', error)
  process.exit(1)
}

function processData(jsonString: string) {
  try {
    const families = JSON.parse(jsonString)

    // Hash passwords
    const processedFamilies = families.map((family: any) => ({
      ...family,
      password: CryptoJS.SHA256(family.password).toString(),
    }))

    const finalContent = JSON.stringify(processedFamilies, null, 2)
    fs.writeFileSync(outputPath, finalContent)
    console.log(`Successfully generated data at ${outputPath}`)
  } catch (e) {
    console.error('Error parsing or processing JSON data:', e)
    process.exit(1)
  }
}
