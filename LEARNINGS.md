# What I learned building Applyd

## Git and GitHub

- **git add** chooses which changed files go into the next snapshot.
- **git commit -m "message"** saves that snapshot on my computer with a description.
- **git push** uploads my commits to GitHub.
- **git status** shows what has changed since my last commit. `M` means modified, `U` means a new untracked file.
- **git restore <file>** throws away my changes to a file and brings back the last committed version. I used it when I accidentally overwrote my dashboard page.
- The LF/CRLF warning only means Windows and Mac/Linux use different invisible line endings. It doesn't affect the code.

## Environment variables

- My Supabase URL and key live in `.env.local`. Git ignores this file (it's listed in `.gitignore`), so my keys never end up on GitHub.
- `.env.example` has the same variable names but only placeholders. It is on GitHub so other developers know which variables the app needs.
- Vercel doesn't get `.env.local` from GitHub, so I had to add the same variables in Vercel's project settings.
- After changing `.env.local`, I have to restart `npm run dev`, because Next.js only reads it at startup.

## The database

- The `applications` table stores every application. Each row is one application, and each column is one detail (company, role, status, job link, applied date, notes).
- Every row has a `user_id`, which is filled in automatically with the logged-in user (`default auth.uid()`), so my code never has to send it.
- A `check` constraint makes sure `status` can only be one of five values: wishlist, applied, interview, offer, rejected.
- I saved the SQL in `supabase/schema.sql`, so anyone can recreate the database from my repo.

## Row Level Security (RLS)

- RLS is a rule inside the database that decides which rows each user can see or change.
- My rule is `auth.uid() = user_id`: a user only gets rows where they are the owner.
- That's why my query just says "give me the applications" without filtering by user. The database filters automatically.
- This matters because the publishable key is visible in the browser. Someone could call my database directly, but RLS still only gives them their own data.
- It also protects changes: if someone tries to delete or edit another user's application by sending its id, the database refuses.
- If someone opens another user's edit page, they get a 404, because RLS returns nothing.

## Next.js routing

- **File-based routing:** the folder structure inside `app` decides the URLs. `app/page.tsx` is the homepage (`/`), and `app/protected/page.tsx` is `/protected`. That's why there are several files called `page.tsx`.
- **Dynamic routes:** a folder with square brackets, like `applications/[id]`, matches any value. One edit page works for every application. The page reads the value with `await params`.
- **Layouts:** `layout.tsx` is a frame around every page in its folder and all folders below it. My double header happened because I pasted the landing page (which has its own header) into the dashboard folder, whose layout already adds a header.

## Server components vs. client components

- **Server components** (the default) run on the server before the page reaches the browser. They can load data from the database directly. My dashboard and edit page are server components.
- **Client components** start with `"use client"` and run in the browser. I need them for anything that reacts to the user: clicks, typing, dragging. My Kanban board, status dropdown and delete button are client components.
- Rule of thumb: load data on the server, handle interaction in the browser.

## Server actions

- A file starting with `"use server"` contains server actions: functions that run on the server but can be called from a form or a button.
- My form uses `action={addApplication}`. When it's submitted, the form data goes to the server, and `formData.get("company")` reads each field by its `name`.
- I validate data on the server too (required fields, allowed statuses), because data from the browser can't be trusted.
- `updateApplication.bind(null, app.id)` creates a version of the action that already knows which application to update.
- `revalidatePath("/protected")` tells Next.js the data changed, so the page shows fresh data. `redirect("/protected")` sends the user back to the board after saving.

## React concepts

- **useState** lets a component remember something, like the board's list of cards or what was typed in the search box. Changing it redraws the component.
- **Controlled input:** the search box uses `value={query}` and `onChange`, so React always knows what's typed. I filter the cards with `.filter()` and `.includes()`, using `.toLowerCase()` so the search ignores capital letters.
- **useEffect** runs code when something changes. My board uses it to copy in fresh data from the server, for example after adding an application.
- **useTransition / isPending** disables a control while it's saving, so users can't click twice.
- **key** helps React keep track of each item in a list, like each card.
- **Suspense** shows a fallback ("Loading applications…") while a server component is still loading its data.

## The Kanban board (dnd-kit)

- `DndContext` is the drag-and-drop area. Columns use `useDroppable` (their id is the status), and cards use `useDraggable` (their id is the application id).
- When a card is dropped, `handleDragEnd` gets "card X was dropped on column Y" and sets X's status to Y.
- **Optimistic update:** I move the card on screen immediately, then save to the database in the background. The app feels instant because it doesn't wait for the network.
- **Drag handle:** only the grip icon starts a drag, so clicking the dropdown, edit or delete button never moves a card by accident.
- **Accessibility:** cards can be moved with the keyboard, and the status dropdown is an alternative for people who can't drag. Icon buttons have `aria-label`s so screen readers can describe them.
- `DragOverlay` shows the floating card that follows the mouse. `useId()` gives the drag area a stable id, which avoids a mismatch between server and browser.

## Deployment

- Vercel is connected to my GitHub repo. Every `git push` triggers a new build, and the live site updates in a minute or two.
- The Deployments page shows whether a build is **Ready** or failed.
- I use the permanent production address (`application-tracker-nine-vert.vercel.app`), not the deployment URLs with random codes, which change with every push.
- Supabase needs to know my live address (Site URL and Redirect URLs), so confirmation emails and login redirects send users back to the right site.

## Debugging lessons

- **Hydration warning:** attributes like `bis_skin_checked` came from a browser extension changing the page, not from my code. Testing in an Incognito window (where extensions are off) confirmed it.
- **Two copies of the app:** running `npm run dev` twice made the second copy use port 3001, so my browser showed the old one. Only one copy should run at a time.
- **Pasting into the wrong file:** files with the same name (`page.tsx`, `layout.tsx`) are easy to mix up. I check the file path in the VS Code tab before pasting.
- **Login problems:** check which email the account was created with before assuming the code is broken.

## UX decisions I made as a designer

- Every data view handles three states: loading, empty and error.
- Delete asks for confirmation, because it can't be undone.
- The header greets users without showing their email, for privacy.
- The search shows "X of Y applications" so users know cards are hidden, not deleted.