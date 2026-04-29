const fs = require('fs')

const filePath = '/Users/walborn/Projects/sbornitsa/lib/data/transactions.ts'
const content = fs.readFileSync(filePath, 'utf8')

// Define the correct alphabetical order
const familyOrder = [
  'cherny',
  'eremeev',
  'fadeev',
  'gerber',
  'kirillov',
  'legoshin',
  'leonenko',
  'marshev',
  'novitskiy',
  'petrov',
  'pimenov',
  'skvortsov',
  'usarov',
  'yuzhakov',
]

// Function to sort families object properties
function sortFamiliesObject(match, indent, content) {
  const lines = content.split('\n')
  const familyLines = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed) {
      // Extract family name from the line
      const familyMatch = trimmed.match(/^(\w+):/)
      if (familyMatch) {
        familyLines.push({
          name: familyMatch[1],
          line: line,
        })
      }
    }
  }

  // Sort by the defined order
  familyLines.sort((a, b) => {
    const indexA = familyOrder.indexOf(a.name)
    const indexB = familyOrder.indexOf(b.name)
    return indexA - indexB
  })

  // Reconstruct the families object
  const sortedLines = familyLines.map(f => f.line).join('\n')
  return `${indent}families: {\n${sortedLines}\n${indent}}`
}

// Replace all families objects
const result = content.replace(/( +)families: \{([^}]+)\}/g, (match, indent, content) =>
  sortFamiliesObject(match, indent, content)
)

fs.writeFileSync(filePath, result, 'utf8')
console.log('✓ Families sorted alphabetically')
