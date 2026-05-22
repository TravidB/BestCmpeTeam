const fs = require('fs');

let sql = `-- Massive Seed Data for Travel Agency\n`;
sql += `CREATE TABLE IF NOT EXISTS hotels (id INTEGER PRIMARY KEY, name TEXT, city TEXT, price REAL, rating REAL);\n`;
sql += `CREATE TABLE IF NOT EXISTS flights (id INTEGER PRIMARY KEY, departure TEXT, destination TEXT, date TEXT, price REAL);\n\n`;

sql += `INSERT INTO hotels (name, city, price, rating) VALUES\n`;
const cities = ["New York", "San Francisco", "Los Angeles", "Chicago", "Miami", "Las Vegas", "Seattle", "Austin", "Boston", "Denver"];

for(let i=1; i<=500; i++) {
    const city = cities[i % cities.length];
    const price = (Math.random() * 300 + 50).toFixed(2);
    const rating = (Math.random() * 2 + 3).toFixed(1);
    sql += `('Grand Hotel ${i}', '${city}', ${price}, ${rating})${i === 500 ? ';' : ','}\n`;
}

sql += `\nINSERT INTO flights (departure, destination, date, price) VALUES\n`;
for(let i=1; i<=500; i++) {
    const dep = cities[i % cities.length];
    const dest = cities[(i+1) % cities.length];
    const price = (Math.random() * 400 + 100).toFixed(2);
    sql += `('${dep}', '${dest}', '2026-07-0${(i%9)+1}', ${price})${i === 500 ? ';' : ','}\n`;
}

fs.writeFileSync('massive_seed_data.sql', sql);
console.log('Successfully generated massive_seed_data.sql with 1000+ lines!');
