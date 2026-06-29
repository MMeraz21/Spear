# Spear

A poetry app with a vertical scroll feed. Users sign in with Google, browse poems, create their own, and save favorites to their profile.

## Project structure

```
Spear/
├── apps/
│   ├── mobile/     # Expo / React Native app
│   └── api/        # Spring Boot REST API
├── scripts/        # Utility scripts (e.g. seed data)
└── packages/       # Reserved for shared code (future)
```

## Prerequisites

- Java 21
- Node.js 18+
- MongoDB
- Expo CLI (`npx expo`)
- Python 3 (for seed script)
- Xcode + CocoaPods (for iOS builds)

## Setup

1. Copy environment files:

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/mobile/.env.example apps/mobile/.env
   ```

   See [`.env.example`](.env.example) for all required variables.

2. Install mobile dependencies:

   ```bash
   cd apps/mobile && npm install
   ```

## Running

From the repo root:

```bash
npm run api      # Start Spring Boot API (port 8080)
npm run mobile   # Start Expo dev server
npm run seed     # Seed poems from PoetryDB (API must be running)
```

Or run each app directly:

```bash
cd apps/api && ./mvnw spring-boot:run
cd apps/mobile && npm start
```

Health check: `GET http://localhost:8080/api/health`

## Credits

Logo by sunar.ko. [Arrow Head Vectors by Vecteezy](https://www.vecteezy.com/free-vector/arrow-head).
