# Full Stack Developer Assignment: Event Booking Platform

## Objective

Design and develop an application for an **Event Booking Platform** where users can search and book services such as marriage venues, hotels, caterers, cameramen, DJs, etc.

The system must support:

- Service discovery with filtering
- Booking management for users
- Service management for admins

---

## Task Overview

Build a full-stack web application that allows:

- **Users** to search, filter, and book event-related services.
- **Admins (service providers)** to manage their services and view bookings.

### Tech Stack

- **Backend:** Node.js with Express.js
- **Frontend:** React
- **Database:** NoSQL (MongoDB)

---

# Functional Requirements

---

## 1. User Features

### 1.1 User Registration & Authentication

- Users must be able to:
  - Sign up
  - Log in
- Passwords must be securely stored (hashed).
- JWT must be used for authentication.

---

### 1.2 Event Booking

Users should be able to:

#### Search Services

Search for services such as:

- Venues
- Hotels
- Caterers
- Cameramen
- DJs
- Other event-related services

#### Filter Services By:

- Price range
- Service category
- Location
- Availability (date-based filter)

#### Service Details Page

Each service must display:

- Service title
- Category
- Description
- Price per day
- Availability status (based on dates)
- Contact information or booking details

#### Booking Functionality

- Users can book a service for specific dates.
- Booking confirmation must be stored in the database.
- Booking must link:
  - User
  - Service provider
  - Selected dates
  - Total calculated price

---

### 1.3 View Bookings

Users must be able to:

- View upcoming bookings
- View past bookings

---

## 2. Admin Features

### 2.1 Admin Authentication

- Admins must be able to log in securely.
- JWT authentication required.

---

### 2.2 Service Management

Admins must be able to:

- Add services
- Edit services
- Remove services

Each service must include:

- Title
- Category (venue, caterer, DJ, etc.)
- Price per day
- Description
- Availability dates
- Contact details

---

### 2.3 Booking Management

- Admins should be able to view all bookings related to their services.

---

## 3. Other Functionalities

### 3.1 Search & Filtering

- Keyword-based search
- Support multiple filters at the same time

---

### 3.2 Price Calculation

- Total booking price must be calculated based on:
  - Number of booked days
  - Price per day

---

### 3.3 Database Requirements

The database must store:

- Users
- Services
- Bookings

Supported database types:

- Relational: PostgreSQL, MySQL
- NoSQL: MongoDB

---

### 3.4 Security Requirements

- Use JWT for authentication
- Hash passwords securely
- Data validation
- Prevent SQL injection (if relational DB)
- Follow basic security best practices

---

# Deliverables

## 1. Source Code

- Well-structured and organized
- Proper documentation
- Clean folder structure

---

## 2. README File

Must include:

- Setup instructions
- Installation steps
- Environment configuration
- How to run the project
- How to interact with the API

---

## 3. API Documentation

- Document all API routes
- Use tools like:
  - Swagger
  - Postman collection

---

## 4. Database Schema

Provide schema including tables/collections for:

- Users
- Services
- Bookings

---

# Bonus (Optional)

- Pagination for services list
- Sorting functionality
- Unit tests for key features
- Email notifications for booking confirmations

---

# Evaluation Criteria

- Code readability and structure
- Proper implementation of all required features
- RESTful API design principles
- Secure authentication implementation
- Optimized and well-structured database schema

---

# Submission

Submit:

- GitHub repository link  
  **OR**
- ZIP file containing the source code

A short walkthrough of the solution will be required during the follow-up interview.

---

**Good luck!**
