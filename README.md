🏏 California Cricket Academy Online Booking Portal

A full-stack **MERN Stack web application** developed for managing cricket academy programs, student registrations, batch scheduling, bookings, attendance, and communication between users and academy management.

This project provides a seamless platform for students to explore available cricket programs, register, book sessions, and manage their profiles, while administrators can efficiently manage batches, attendance, student records, and bookings.

 Features : 

 User Side :

* User Registration & Login
* Secure Authentication using JWT
* View cricket academy programs
* Program details page
* Batch booking system
* Contact form
* Student dashboard
* Booking confirmation
* User profile management
* Attendance view
* Responsive UI design

Coach Side :

* Coach Login & Authentication
* Coach Dashboard
* View assigned batches
* Manage student attendance
* View student details
* Check batch schedules
* Track bookings
* Update training session status
* Monitor daily attendance records
* Profile management

Admin Side :

* Admin login
* Dashboard analytics
* Manage students
* Manage programs
* Manage batches
* Booking management
* Attendance management
* Contact queries handling
* Email notification support
* File/image upload support

# Tech Stack

# Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS / CSS
* Lucide React Icons

# Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Nodemailer
* Multer

# Project Structure

client/
 ├── src/
 ├── public/
 ├── package.json

server/
 ├── config/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── uploads/
 ├── server.js



# Installation & Setup

# Clone Repository

git clone https://github.com/Priyanka-44/California-Cricket-Academy-Online-Booking-Portal.git

# Install Frontend Dependencies

cd client
npm install

# Install Backend Dependencies

cd ../server
npm install

# Environment Variables

Create `.env` file inside `server` folder.

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password

# Run Project

# Start Backend

cd server
node server.js

# Start Frontend

cd client
npm start


# Database

This project uses **MongoDB Atlas Cloud Database** for storing:

* Users
* Students
* Bookings
* Attendance
* Contact details
* Program data


# Objective

The objective of this project is to simplify the process of managing cricket academy operations digitally, including student registrations, session booking, and attendance tracking.

# Developed By

**Priyanka Panchal**
B.Tech Information Technology
MERN Stack Developer
