# FleetPulse Tracking System

FleetPulse is a full-stack Fleet Management and Real-Time Vehicle Tracking System designed to manage drivers, vehicles, trips, and live GPS tracking. The platform provides secure authentication, role-based access control, driver approval workflows, trip management, and real-time vehicle monitoring through an intuitive dashboard.

---

## Features

### Authentication & Authorization
- JWT-based Authentication
- Access Token & Refresh Token Support
- Role-Based Access Control (ADMIN, DRIVER)
- Secure Login & Logout
- Driver Registration Workflow
- Admin Approval/Rejection System

### Driver Management
- Register Drivers
- View Driver Details
- Approve/Reject Driver Accounts
- Assign Drivers to Vehicles
- Driver Availability Validation

### Vehicle Management
- Add New Vehicles
- Update Vehicle Information
- Delete Vehicles
- Vehicle Status Tracking
- Vehicle Type Management

### Trip Management
- Create Trips
- Update Trips
- Cancel Trips
- View Trip Details
- Active Trip Monitoring
- Driver Assignment Validation
- Vehicle Assignment Validation

### Real-Time Tracking
- GPS Location Simulation
- Live Vehicle Tracking
- WebSocket-Based Updates
- Location History Tracking
- Real-Time Dashboard Updates

### Dashboard
- Admin Dashboard
- Driver Dashboard
- Pending Approval Screen
- Vehicle Monitoring
- Trip Monitoring

---

## Tech Stack

### Backend
- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Hibernate ORM
- JWT Authentication
- WebSocket (STOMP)
- Maven

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- React Hot Toast
- Lucide React Icons

### Database
- MySQL

### DevOps & Deployment
- Docker
- Docker Compose

---

## Project Architecture

```text
FleetPulse-Tracking-System
│
├── fleetuplse-backend
│   ├── auth
│   ├── driver
│   ├── vehicle
│   ├── trip
│   ├── location
│   ├── common
│   └── config
│
├── fleetpulse-frontend
│   ├── src
│   │   ├── api
│   │   ├── pages
│   │   ├── components
│   │   ├── context
│   │   └── assets
│
└── docker-compose.yml
```

---

## Core Modules

### Authentication Module
- Login
- Logout
- Refresh Token
- Driver Registration
- Admin Approval

### Driver Module
- Create Driver
- Update Driver
- Delete Driver
- Driver Assignment

### Vehicle Module
- Create Vehicle
- Update Vehicle
- Delete Vehicle
- Vehicle Status Management

### Trip Module
- Create Trip
- Update Trip
- Cancel Trip
- View Trips
- Active Trip Tracking

### Location Module
- GPS Location Storage
- Live Vehicle Tracking
- Vehicle Route History

---

## Database Entities

### User
- userId
- name
- email
- password
- role
- approvalStatus
- createdAt

### Driver
- driverId
- driverName
- mobileNumber
- assignedVehicle

### Vehicle
- vehicleId
- vehicleNumber
- vehicleType
- vehicleStatus
- createdAt

### Trip
- tripId
- pickupLocation
- destination
- tripDate
- tripTime
- tripStatus
- driver
- vehicle

### LocationPing
- id
- latitude
- longitude
- speed
- timestamp
- vehicle

---

## REST APIs

### Authentication APIs

```http
POST /auth/login
POST /auth/register-driver
POST /auth/refresh
POST /auth/logout

GET  /auth/pending-drivers
PUT  /auth/approve-driver/{userId}
PUT  /auth/reject-driver/{userId}
```

### Driver APIs

```http
GET    /drivers
POST   /drivers/add
PUT    /drivers/{id}
DELETE /drivers/{id}
```

### Vehicle APIs

```http
GET    /vehicles
POST   /vehicles/add
PUT    /vehicles/{id}
DELETE /vehicles/{id}
```

### Trip APIs

```http
GET    /trips
GET    /trips/{id}
POST   /trips/add
PUT    /trips/{id}
DELETE /trips/{id}

POST   /api/trips/{tripId}/start
GET    /api/trips/active
```

### Location APIs

```http
GET /api/locations/latest/{vehicleId}
GET /api/locations/history/{vehicleId}
```

---

## Running Locally

### Backend

```bash
cd fleetuplse-backend

./mvnw clean package

./mvnw spring-boot:run
```

### Frontend

```bash
cd fleetpulse-frontend

npm install

npm run dev
```

---

## Docker Setup

### Build & Start

```bash
docker compose up --build
```

### Stop Containers

```bash
docker compose down
```

### View Running Containers

```bash
docker ps
```

---

## Docker Services

| Service | Port |
|----------|------|
| Frontend | 5173 |
| Backend | 8081 |
| MySQL | 3307 |

---

## Environment Variables

### Backend

```properties
DB_URL=jdbc:mysql://mysql:3306/fleetpulse
DB_USERNAME=root
DB_PASSWORD=root
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:8081
VITE_WS_URL=ws://localhost:8081/ws
```

---

## Key Highlights

- Full-Stack Fleet Management Platform
- JWT Authentication & Refresh Tokens
- Role-Based Access Control
- Driver Approval Workflow
- Vehicle Management
- Trip Management
- Real-Time GPS Tracking
- WebSocket Integration
- Dockerized Deployment
- Responsive React Dashboard
- MySQL Integration
- RESTful APIs

---

## Future Enhancements

- CI/CD Pipeline using GitHub Actions
- Render Deployment
- Route Optimization
- Geofencing
- Notifications & Alerts
- Analytics Dashboard
- Redis Integration
- Kafka-Based Event Streaming
- Multi-Tenant Support

---

## Author

**Pranjal Tiwari**

Java Backend Developer | Spring Boot | Microservices | React | Docker

---