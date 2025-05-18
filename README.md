# 👥 Employee Organogram

A hierarchical employee management system built with **NestJS**, **TypeORM**, and **PostgreSQL**. It supports recursive data fetching (e.g., managers and their subordinates) and includes:

- JWT-protected API endpoints
- Winston-based logging
- Frontend UI
- K6testing setup
- Database seeding support

---

## Features

- Dynamic employee hierarchy (CEO → Managers → Engineers, etc.)
- Recursive subordinate fetching via API
- JWT-based route protection
- Logging using Winston
- Load test using **K6**
- Database seeding via TypeORM

---

## Tech Stack

- **Backend:** NestJS, TypeORM
- **Database:** PostgreSQL
- **Logger:** Winston
- **Testing:** Jest
- **Load Testing:** K6
- **UI:** Static HTML, no frontend framework

---

## Prerequisite

- Javascript Runtime (Node)
- Typescript
- PostgreSQL (A docker compose file is attached in the root directory to spin a postgres instance easily)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/armalam/employee-organogram-nest.git
cd employee-organogram

# Install dependencies
yarn

# Set up environment variables using proper credentials
cp .env.example .env

# Run migrations
yarn migration:run

#Seed the database
yarn seed

# Start the app in dev mode
yarn start:dev

```

## UI

Visit http://localhost:3000/employees

## Testing

### Unit tests

```
  yarn test
```

## Load tests using K6. (System needs to have k6 pre-installed)

```bash
k6 run test/k6-load-test.js
```

## Folder Structure

```
employee-organogram/
├── src/
│ ├── auth/
│ ├── employee/
│ ├── guards/
│ ├── logger/
│ ├── app.module.ts
│ └── main.ts
├── public/index.html
├── db/
│ ├── migrations/
│ └── seed/seed.ts
├── test/
│ ├── k6-load-test.js
├── .env
├── README.md
└── package.json
```

## TODO:

- Write unit test for remaining services
- Database Optimization
- Setup linters and git hooks.

## Supporting thousads of users

- Optimize database schema and table structure
- Use proper indexing for faster read acess
- Use caching to reduce load on database
- Upgrade host maching configuration (increase processeor power, RAM etc )
- If machine is a multi-core cpu, run the application on multiple custers using cluster module
- For expensive operation, we can use rate-limiting

## Logging & monitoring at scale

The system is currenlty configured to use winston as logger which writes into a log file. We can check the log file for tracing exeception origin in a file. But as the application grows for a large userbase, we can use APM (application performance monitoring ) to track our system performance in real time. Some the popular APM are Elastic APM, Datadog etc.

## Deploying to production

For deploying the application to production, we can

- Manual process: build the application (yarn build), and then host it on the server(EC2, Digital Ocean etc) containing proper env credentials.
- Docker: Using a Dockerfile (optionally with a docker-compose file), we can slightly automate the deploying process
  -CICD: Using CI-CD and Github actions, we can fully automate the deployment process.
