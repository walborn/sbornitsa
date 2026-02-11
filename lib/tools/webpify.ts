import sharp from 'sharp'

const inputFileName = process.argv.at(-1) || ''

async function webpify(inputFileName: string) {
  const ext = inputFileName.slice(inputFileName.lastIndexOf('.') + 1)
  const outputFileName = `${inputFileName.slice(0, -`.${ext}`.length)}.webp`
  try {
    await sharp(inputFileName)
      // .resize({ width: 1280, height: 624, fit: 'inside' })
      .webp({ quality: 75 })
      .toFile(outputFileName)
  } catch (error) {
    console.error('Ошибка:', error)
  }
}

webpify(inputFileName)
