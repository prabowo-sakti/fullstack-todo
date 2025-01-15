import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dbPath = join(process.cwd(), 'db.json')
const restoreDb = () => {
  return writeFileSync(dbPath, JSON.stringify([]))
}
const populateDb = (data) => {
  return writeFileSync(dbPath, JSON.stringify(data))
}

export { restoreDb, populateDb }
