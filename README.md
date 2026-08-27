# FitTrack Daily

Create a modern responsive React web application called FitTrack.

Purpose

FitTrack is a simple workout tracking MVP. Authenticated users should be able to create, view and delete their own workout records.

The application should be functional, clean, modern and suitable as an MVP for a student project.

Technology

Use:

React

TypeScript

Tailwind CSS

Supabase for authentication and database

React Router for navigation

Use Supabase Auth for user registration, login and logout.

User authentication

The application must support:

User registration

User login

User logout

Protected application pages for authenticated users

Unauthenticated users should be redirected to the login page when trying to access protected pages.

Pages

Create the following pages:

1. Landing / Home page

Create a simple landing page introducing FitTrack.

Include:

Application name

Short description

Call-to-action buttons for Login and Register

Modern fitness-oriented visual design

2. Login page

Create a login form with:

Email

Password

Login button

Include a link to the registration page.

Show clear validation and error messages.

3. Register page

Create a registration form with:

Email

Password

Confirm password

Register button

Validate that passwords match.

After successful registration, handle the Supabase authentication flow correctly.

4. Dashboard page

Create a protected dashboard page for authenticated users.

Show:

Welcome message

Number of workouts

Most recent workouts

Button to add a new workout

5. Add Workout page

Create a protected form for adding a workout.

Fields:

Workout title

Date

Duration in minutes

Description

When the form is submitted, save the workout to the Supabase database and associate it with the currently authenticated user's ID.

Validate required fields and show success/error messages.

6. Workouts page

Create a protected page showing the authenticated user's workouts.

Display workouts in clean cards or a table.

Each workout should show:

Title

Date

Duration

Allow the user to click a workout to open its details.

7. Workout Details page

Create a protected details page for one selected workout.

Display:

Workout title

Date

Duration

Description

Include a delete button.

The user must only be able to access and delete their own workouts.

Supabase database

Create the required database structure.

Create a workouts table with:

id UUID primary key

user_id UUID referencing the authenticated user

title text

date date

duration integer

description text

created_at timestamp

Enable Row Level Security.

Users should only be able to:

insert their own workouts

select their own workouts

delete their own workouts

Do not allow one user to access another user's workouts.

Navigation

Create a clear navigation bar.

For authenticated users include:

Dashboard

Workouts

Add Workout

Logout

For unauthenticated users include:

Home

Login

Register

The navigation should be responsive on mobile devices.

Design

Use a modern, clean fitness dashboard style.

Requirements:

Responsive design

Mobile friendly

Clean typography

Cards with rounded corners

Good spacing

Clear buttons

Consistent visual hierarchy

Subtle animations where appropriate

Do not make the interface overly complicated.

Important

Prioritize functionality and reliability over unnecessary features.

Make sure:

Authentication works correctly

Supabase database operations work correctly

Forms validate input

Loading states are handled

Error states are handled

Protected routes work correctly

Users can only see their own workout data

There are no unnecessary features outside the MVP scope

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://trackmy-sweat.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/10caf552-7e7f-49e2-bf44-9a9ff9f9d2c3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
