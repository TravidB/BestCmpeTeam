const bcrypt = require('bcryptjs')
const db = require('./db')

async function seed() {
  const password = await bcrypt.hash('CMPE-131@2026', 10)

  db.run(
    `INSERT OR IGNORE INTO users (username, password, first_name, last_name, phone_number)
     VALUES (?, ?, ?, ?, ?)`,
    ['john.doe@example.com', password, 'John', 'Doe', '555-123-4567'],
    function (err) {
      if (err) {
        console.error('Seed error:', err.message)
      } else if (this.changes === 0) {
        console.log('User john.doe@example.com already exists — skipped.')
      } else {
        console.log('Seeded: john.doe@example.com / CMPE-131@2026')
      }
      process.exit(0)
    }
  )
}

seed()