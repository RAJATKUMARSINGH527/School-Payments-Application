# SchoolPay - Modern School Payment System Frontend

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Authentication Flow](#authentication-flow)
- [API Integration](#api-integration)
- [Dark Mode Support](#dark-mode-support)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Introduction

SchoolPay is a modern, responsive React frontend application for managing school payment transactions securely and efficiently. It features user authentication, transaction management, profile and settings pages, and advanced filtering.

---

## Features

- Secure JWT-based user authentication
- Protected routes with React Router v6 and auth guards
- Transaction overview with filtering and CSV export
- User profile and settings management
- Responsive design with TailwindCSS and dark mode support
- API integration with Axios and error handling

---

## Technologies Used

- React 18 with Hooks & functional components
- React Router v6
- TailwindCSS (including dark mode support)
- Axios for HTTP requests
- JWT for authentication management
- Vite as the development build tool

---

## Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn
- Running backend API server accessible for API requests

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/schoolpay-frontend.git
cd schoolpay-frontend
```

3. **Install dependencies**

```bash
npm install
```

4. **Run the server**

```bash
npm run dev
```

Your server will start at:

Open [http://localhost:5173](http://localhost:5173) in your browser to use the application.

---

## Project Structure

```text
src/
 ├─ components/         # Reusable UI components (Home, Navbar, Footer, TableWithHover, Settings, Viewprofile,)
 ├─ pages/              # Route-level pages (Login, Signup, Orders, TransactionsOverview  etc.)
 ├─ App.jsx             # Main app with routing and auth setup
 ├─ main.jsx            # Entry point
```


---

## Authentication Flow

- User logs in or registers to receive a JWT stored in localStorage.
- Protected routes wrapped with `RequireAuth` redirect unauthorized users.
- Token sent in HTTP headers when making API requests.
- Token expiration handled by backend; frontend responds accordingly.

---

## API Integration

- Uses Axios to communicate with backend.
- All secure requests pass JWT in Authorization header.
- Supports CRUD functionality for user profile and transactions.
- Error handling to display appropriate UI feedback.

---


## Testing

- Currently manual testing recommended.
- Future tests planned using Jest and React Testing Library.

---

## Contributing

Contributions welcome! Please fork repo, create branch, make PR.

---

## License

This project is licensed under the MIT License.

---

## Contact

Developer - Rajat Kumar Singh
Email - rajatkumarsingh257@example.com
GitHub - https://github.com/RAJATKUMARSINGH527
