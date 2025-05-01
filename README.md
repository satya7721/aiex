![AI Exam Platform Banner](/gitbanner.png)

# AI Exam Platform

A modern examination platform powered by AI for managing and conducting exams.

## Code Owner
- **Name**: Vidya
- **Email**: vhkshk21@gmail.com

## Project Status

| Feature | Status | Description |
|---------|--------|-------------|
| **Authentication** |
| Student Login | ✅ | 4-digit ID based login with route protection |
| Admin Login | ✅ | Email/password based login with route protection |
| Logout | ✅ | Session management and route redirection |
| **Admin Features** |
| Dashboard | ✅ | Overview of exams and submissions |
| Create/Edit Exams | ✅ | Full exam management with MCQ and subjective questions |
| View Submissions | ✅ | Review student submissions with detailed responses |
| Student Management | ✅ | Add/edit students and view their performance |
| **Student Features** |
| Dashboard | ✅ | Student overview and upcoming exams |
| Available Exams | ✅ | List of exams ready to take |
| Take Exam | ✅ | Interactive exam interface with auto-save |
| View Reports | ✅ | Detailed performance reports with feedback |
| **UI/UX** |
| Responsive Design | ✅ | Mobile-first approach with tailwind CSS |
| Dark Mode | ✅ | System-based and manual theme switching |
| Loading States | ✅ | Skeleton loaders and loading indicators |
| Error Handling | ✅ | User-friendly error messages |
| **Backend Integration** |
| Data Types | ✅ | TypeScript interfaces for all entities |
| API Routes | 🚧 | In progress - Moving from mock to real API |
| Database Schema | ✅ | NoSQL schema design completed |
| Authentication Flow | 🚧 | In progress - Adding JWT implementation |

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Hooks
- **Type Safety**: TypeScript
- **Authentication**: Custom auth (JWT planned)
- **Database**: NoSQL (MongoDB planned)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                  # Next.js app router pages
│   ├── (auth)/          # Authentication routes
│   ├── (dashboard)/     # Protected dashboard routes
│   └── (landing)/       # Public landing pages
├── components/          # React components
├── types/              # TypeScript definitions
└── lib/               # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
