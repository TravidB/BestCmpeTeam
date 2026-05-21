# Pet-Friendly Travel Booking Platform

## Overview

This project is a full-stack pet-friendly travel booking platform developed for CMPE 131 Software Engineering I.

The application allows users to:

- Create accounts and log in
- Book pet-friendly flights
- Search pet-friendly hotels near attractions
- View pet accommodation services
- Create bookings
- Edit bookings
- Cancel bookings

The system demonstrates frontend/backend integration, CRUD operations, authentication, and dynamic filtering using a React frontend with a Node.js + Express backend.

---

# Features

## User Authentication
- Register new accounts
- Login system
- SQLite user database integration

<img src="screenshots/create_account.png" width="500">
(user successfully created)

<img src="screenshots/account_already.png" width="500">
(account already exist)

<img src="screenshots/log_success.png" width="500">
(successfully logged in - viewing dashboard)

## Flight Booking
- View flights by:
  - departure city
  - destination city
  - travel date
- Sold-out flight handling
- Booking creation

<img src="screenshots/book_flight.png" width="500">

- Full flight list can be viewed on the webpage. Only partial section is shown for space consideration.

<img src="screenshots/book_success.png" width="500">

## Hotel Booking
- Search hotels by:
  - city
  - nearby attraction
  - travel date
- Pet-friendly accommodation services
- Dynamic hotel filtering

<img src="screenshots/book_hotel.png" width="500">

- Full flight list can be viewed on the webpage. Only partial section is shown for space consideration.

<img src="screenshots/book_hotel2.png" width="500">
<img src="screenshots/hotel_success.png" width="500">


## Booking Management
- View bookings
- Edit bookings
- Cancel bookings

<img src="screenshots/view_booking.png" width="500">

## User Isolation
- Users are having individual platforms
- Security is granted, no data crossovers

<img src="screenshots/diff_user.png" width="500">

---

# Tech Stack

## Frontend
- React
- JavaScript
- HTML/CSS

## Backend
- Node.js
- Express.js
- SQLite

---

# Project Structure

```bash
travel-agency-app/
travel-agency-node-api/
```

---

# How to Run the Project

## Backend

```bash
cd travel-agency-node-api
npm install
npm run dev
```
or
```bash
cd travel-agency-platform/travel-agency-api
npm install
node server.js
```

Backend runs on:
```bash
http://localhost:5001
```

---

## Frontend

```bash
cd travel-agency-app
npm install
npm start
```

Frontend runs on:
```bash
http://localhost:3000
```

Seed Test
```bash
cd travel-agency-platform\travel-agency-api
node database/seed.js
```

Sqlite3 reload
```bash
npm uninstall sqlite3
npm install sqlite3
```


---

# Demonstrated Functionalities

The project successfully demonstrates:

- Full CRUD operations
- Authentication system
- Dynamic frontend filtering
- Backend API communication
- SQLite database integration
- Pet-friendly travel search functionality

---

# Example Features Demonstrated

## Flight Search
- Dynamic filtering by route
- Booking functionality
- Sold-out state handling

## Hotel Search
- Attraction-based search
- Pet accommodation services
- Booking creation

## Booking Management
- Edit existing bookings
- Cancel bookings
- Persistent booking display

---

# Future Improvements

Potential future improvements include:

- Real travel APIs
- Payment integration
- Live hotel availability
- Cloud deployment
- Improved UI styling


## Authors

- Yve Do
- Travis Bui
- Yoomi Kim
- Vincent Nguyen 
- Lucia Lu

## Date

05/21/2026 
