# Applyd: Internship Application Tracker

A full-stack web app to keep track of internship and job applications on a drag-and-drop Kanban board, built with Next.js and Supabase.

**Live demo:** https://application-tracker-nine-vert.vercel.app

![Dashboard with Kanban board](docs/dashboard.png)

## Why I built it

As a Media Informatics student looking for a mandatory internship, I needed one place to keep track of every application I send. Spreadsheets got messy, so I built my own tool and use it for my own job search.

## Features

- **Kanban board with drag and drop** (dnd-kit) to move applications between Wishlist, Applied, Interview, Offer and Rejected
- **Status dropdown on every card** as a keyboard-friendly alternative to dragging
- **Add, edit and delete applications** with company, role, job link, status, applied date and notes
- **Instant search** by company or role
- **Sign up and log in** with email (Supabase Auth)
- **Private by default:** each user only sees their own data, enforced in the database with Row Level Security
- Clear empty, loading and error states
- Responsive layout with light and dark mode

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js (App Router, Server Components, Server Actions, dynamic routes) |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui components |
| Drag and drop | dnd-kit |
| Database & Auth | Supabase (PostgreSQL, Row Level Security) |
| Hosting | Vercel |

## Design and technical decisions

- **Security in the database, not just the UI.** A Row Level Security policy (`auth.uid() = user_id`) makes sure users can only read and change their own rows, even if someone calls the API directly with the public key.
- **Optimistic updates for drag and drop.** When a card is dropped, the board updates instantly and the change is saved in the background with a Server Action, so the interface never waits for the network.
- **A dedicated drag handle.** Only the grip icon starts a drag, so clicking the status dropdown or the edit and delete buttons never moves a card by accident.
- **Accessible alternatives.** Cards can be moved with the keyboard or with the status dropdown, and icon buttons have descriptive `aria-label`s. Deleting asks for confirmation first.
- **Server Components for data loading.** The board and the edit page load data on the server, so no database logic runs in the browser.
- **Server Actions for changes.** Create, update and delete run on the server and refresh the page data with `revalidatePath`.
- **Validation on the server.** Required fields and status values are checked on the server and by a database constraint, never trusted from the browser alone.
- **Dynamic routes for editing.** One page (`/protected/applications/[id]`) handles editing for every application. Opening another user's application id shows a 404 page, thanks to Row Level Security.
- **Privacy in the UI.** The header greets users without showing their email address.

![Landing page](docs/landing.png)

## Project structure

```
app/
├── page.tsx                          Landing page
├── auth/                             Login, sign-up and password pages
└── protected/
    ├── layout.tsx                    Frame around the dashboard
    ├── page.tsx                      Dashboard: add form + Kanban board
    ├── kanban-board.tsx              Drag-and-drop board and search
    ├── application-controls.tsx      Status dropdown and delete button
    ├── actions.ts                    Server Actions: add, update, delete
    └── applications/[id]/page.tsx    Edit page
components/site-layout.tsx            Shared header and footer
supabase/schema.sql                   Database table and security policy
```

## Run it locally

1. Clone the repository and install dependencies:
```bash
   git clone https://github.com/msalmanbhatti/application-tracker.git
   cd application-tracker
   npm install
```
2. Create a free project on [Supabase](https://supabase.com) and run the SQL in [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor.
3. Copy `.env.example` to `.env.local` and add your Supabase project URL and publishable key.
4. Start the development server:
```bash
   npm run dev
```
5. Open http://localhost:3000.

## Roadmap

- [x] Kanban board with drag and drop
- [x] Edit applications, with notes and applied date
- [x] Search
- [ ] Automated tests (Vitest, Playwright) and CI with GitHub Actions
- [ ] Form validation with Zod and success/error notifications
- [ ] Statistics (applications per week, response rate)
- [ ] AI-assisted matching of my CV against job descriptions

## Author

**Muhammad Salman Bhatti**, M.Sc. Media Informatics student at Saarland University
[GitHub](https://github.com/msalmanbhatti)