import sharp from 'sharp'

const inputFileName = process.argv.at(-1) || ''

async function webpify(inputFileName: string) {
  const ext = inputFileName.slice(inputFileName.lastIndexOf('.') + 1)
  const outputFileName = `${inputFileName.slice(0, -`.${ext}`.length)}.png`
  try {
    await sharp(inputFileName)
      // .resize({ width: 1280, height: 624, fit: 'inside' })
      .png()
      .toFile(outputFileName)
  } catch (error) {
    console.error('Ошибка:', error)
  }
}

console.log(inputFileName)
webpify(inputFileName)
