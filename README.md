# [Volunteer task tracker 📋](https://volunteer-task-tracker.vercel.app)

Volunteer task tracker is project built for a scout group I volunteer at that had the issue of having minimum visiblity into volunteer activities. Volunteer task tracker creates a place to report completed activities, get reminders on scheduled activities and get an overall look on the whole years progress.

The production application is closed source due to data sensitivity and faster development cycle. The repo here is the groundwork on the application that the closed source version is forked from.

You can log in to the application with the [Clerk test credentials](https://clerk.com/docs/testing/test-emails-and-phones).

## Tech Stack

- [Next.js 13](https://nextjs.org/)
- [React](https://react.dev/)
- [pnpm](https://pnpm.io/)
- [Vercel](https://www.vercel.com/)
- [Clerk](https://clerk.com)

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
pnpm run dev
```

## Production

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run start
```
