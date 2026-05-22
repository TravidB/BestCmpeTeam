import random

sql = "-- Massive Seed Data for Travel Agency\n"
sql += "CREATE TABLE IF NOT EXISTS hotels (id INTEGER PRIMARY KEY, name TEXT, city TEXT, price REAL, rating REAL);\n"
sql += "CREATE TABLE IF NOT EXISTS flights (id INTEGER PRIMARY KEY, departure TEXT, destination TEXT, date TEXT, price REAL);\n\n"

sql += "INSERT INTO hotels (name, city, price, rating) VALUES\n"
cities = ["New York", "San Francisco", "Los Angeles", "Chicago", "Miami", "Las Vegas", "Seattle", "Austin", "Boston", "Denver"]

for i in range(1, 501):
    city = cities[i % len(cities)]
    price = round(random.uniform(50.0, 350.0), 2)
    rating = round(random.uniform(3.0, 5.0), 1)
    end_char = ';' if i == 500 else ','
    sql += f"('Grand Hotel {i}', '{city}', {price}, {rating}){end_char}\n"

sql += "\nINSERT INTO flights (departure, destination, date, price) VALUES\n"
for i in range(1, 1501):
    dep = cities[i % len(cities)]
    dest = cities[(i+1) % len(cities)]
    price = round(random.uniform(100.0, 500.0), 2)
    end_char = ';' if i == 500 else ','
    sql += f"('{dep}', '{dest}', '2026-07-0{(i%9)+1}', {price}){end_char}\n"

with open("massive_seed_data.sql", "w") as f:
    f.write(sql)

print("Successfully generated massive_seed_data.sql with 1000+ lines!")

