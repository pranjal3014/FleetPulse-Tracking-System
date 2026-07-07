np# FleetPulse Frontend

React + Vite client for the FleetPulse Spring Boot backend.

## Run locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` and calls `http://localhost:8080`. Copy
`.env.example` to `.env` to override either the REST or WebSocket URL.

## Authentication flow

- Drivers register with `name`, `email`, and `password`.
- New accounts remain `PENDING` until an `ADMIN` approves them.
- Login stores the access token, refresh token, and non-sensitive user profile.
- Axios adds bearer tokens and retries one request after refreshing an expired access token.
- Refresh failure clears local credentials and redirects protected navigation to login.
- Route guards enforce `ADMIN` and `DRIVER` access in the client; Spring Security remains authoritative.

## Backend contracts used

The client matches the Java DTOs in the repository, including `vehicleNumber`,
`vehicleType`, `vehicleStatus`, `driverId`, `vehicleId`, `tripDate`, `tripTime`,
and STOMP messages on `/topic/location`.
