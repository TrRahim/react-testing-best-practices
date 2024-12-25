# React Testing with Vite

A React project demonstrating the use of modern testing libraries and tools to create robust, maintainable, and testable applications. This repository focuses on implementing unit, integration, and UI testing with **Vitest**, **React Testing Library**, and **MSW**.

## Features

- **React Testing Library**: Simplified DOM testing for React components.
- **Vitest**: A fast, modern testing framework designed for Vite-based projects.
- **Mock Service Worker (MSW)**: API mocking to simulate backend interactions.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Query**: Simplified server state management with hooks.
- **TypeScript**: Strongly typed development for enhanced reliability.
- **React Router DOM**: Declarative routing for React applications.
- **JSON Server**: Simulated REST API for testing.

## Tech Stack

- **Frontend**: React, React Router DOM, Tailwind CSS
- **Testing**: Vitest, React Testing Library, MSW
- **Backend**: JSON Server
- **Tooling**: Vite, TypeScript, ESLint

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/react-testing-with-vite.git
   cd react-testing-with-vite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

- Start the development server:
  ```bash
  npm run start
  ```
  This runs both the JSON server and Vite development server concurrently.

- Preview the application:
  ```bash
  npm run preview
  ```

- Run the test suite:
  ```bash
  npm run test
  ```

- Run the test UI:
  ```bash
  npm run test:ui
  ```

- Generate coverage reports:
  ```bash
  npm run coverage
  ```

## Folder Structure

- `src/`: Main source code for the application.
  - `components/`: Reusable React components.
  - `data/`: Mock data for the JSON server.
  - `tests/`: Test cases for components and features.
- `tailwind.config.js`: Tailwind CSS configuration.
- `vite.config.ts`: Vite project configuration.
- `tsconfig.json`: TypeScript configuration.

## Learning Objectives

1. Learn to implement and run tests for React components using modern tools.
2. Use MSW to mock API requests for integration testing.
3. Apply best practices in styling and state management.

## Scripts

- `dev`: Start the Vite development server.
- `build`: Build the application for production.
- `lint`: Lint the project using ESLint.
- `server`: Start the JSON server.
- `start`: Run both the development server and JSON server.
- `test`: Run the test suite with Vitest.
- `test:ui`: Run the test UI with Vitest.
- `coverage`: Generate a test coverage report.

## Contributions

Contributions are welcome! Feel free to open issues or submit pull requests to improve this project.

---

### License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

