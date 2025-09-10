# Mic-Hub

A web application for managing microphone campaigns and users. Built with the T3 Stack.

## Tech Stack

-   [Next.js](https://nextjs.org/) - React framework for production.
-   [React](https://react.dev/) - A library for building user interfaces.
-   [tRPC](https://trpc.io/) - End-to-end typesafe APIs.
-   [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for SQL databases.
-   [PostgreSQL](https://www.postgresql.org/) - Open source object-relational database.
-   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
-   [Clerk](https://clerk.com/) - User management and authentication.
-   [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
-   [ESLint](https://eslint.org/) - Pluggable linting utility for JavaScript and JSX.
-   [Prettier](https://prettier.io/) - An opinionated code formatter.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v20.x or later recommended)
-   [pnpm](https://pnpm.io/installation)
-   [Docker](https://www.docker.com/products/docker-desktop/) or [Podman](https://podman.io/) for running the database.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd mic-hub
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Copy the example environment file and update it with your configuration.

    ```bash
    cp .env.example .env
    ```

    You will need to add your Clerk credentials and other environment-specific variables.

### Database Setup

This project uses PostgreSQL as the database. The `start-database.sh` script simplifies running it in a Docker container.

1.  **Start the database container:**

    This script will parse your `.env` file for the `DATABASE_URL` and start a Postgres container with the correct credentials.

    On macOS/Linux:
    ```bash
    ./start-database.sh
    ```

    On Windows (using WSL):
    ```bash
    wsl ./start-database.sh
    ```

2.  **Run database migrations:**

    This command applies any pending database schema changes.

    ```bash
    pnpm run db:push
    ```
    *Note: The `package.json` also includes `db:migrate` which uses Drizzle Kit's migration files. `db:push` directly applies schema changes without creating migration files, which is often simpler for development.*


### Running the Application

Once the setup is complete, you can start the development server.

```bash
pnpm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script           | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| `pnpm run dev`     | Starts the development server with hot-reloading.          |
| `pnpm run build`   | Builds the application for production.                     |
| `pnpm run start`   | Starts a production server.                                |
| `pnpm run preview` | Builds and starts a production server.                     |
| `pnpm run lint`    | Lints the codebase using Next.js's built-in ESLint config. |
| `pnpm run format:write` | Formats all files using Prettier.                        |
| `pnpm run check`   | Runs linting and type-checking.                            |
| `pnpm run typecheck` | Runs TypeScript compiler to check for type errors.         |
| `pnpm run db:generate` | Generates SQL migration files from your Drizzle schema.    |
| `pnpm run db:migrate`  | Applies generated migrations to the database.              |
| `pnpm run db:push`     | Pushes schema changes directly to the database (dev only). |
| `pnpm run db:studio`   | Opens the Drizzle Studio to browse your database.          |


## Deployment

Follow the official T3 Stack deployment guides for more information.

-   [Vercel](https://create.t3.gg/en/deployment/vercel)
-   [Netlify](https://create.t3.gg/en/deployment/netlify)
-   [Docker](https://create.t3.gg/en/deployment/docker)