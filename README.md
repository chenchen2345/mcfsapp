# MCFS (Multi-Channel Fraud System)

A modern React-based fraud management system featuring user authentication, user management, transaction management, fraud reporting, and an intelligent chat assistant for user support.

## Key Features

- **User Authentication**: Secure login and registration with JWT support
- **User Management**: Manage user profiles and permissions
- **Transaction Management**: View and manage transaction records
- **Fraud Reporting**: Report and track fraud incidents
- **Chat Assistant**: Interactive AI-powered chat assistant for user help

## Tech Stack

- **React** ^18.2.0
- **React Router DOM** ^5.2.0
- **Axios** ^0.21.1
- **@mui/material** ^7.2.0 & **@mui/icons-material** ^7.2.0 (Material UI)
- **@emotion/react** ^11.14.0 & **@emotion/styled** ^11.14.1 (CSS-in-JS)
- **date-fns** ^4.1.0 (Date utilities)
- **react-scripts** ^5.0.1

## Project Structure

```
mcfsapp/
├── public/                # Static assets (index.html, icons, etc.)
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   ├── pages/             # Page-level components
│   ├── services/          # API and business logic
│   ├── utils/             # Utility functions
│   └── assets/            # Images and global styles
├── package.json           # Project configuration and dependencies
├── README.md              # Project documentation
└── ...
```

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
```

### 2. Navigate to the project directory
```bash
cd mcfsapp
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the development server
```bash
npm start
```

The app will be available at http://localhost:3000

### 5. Build for production
```bash
npm run build
```

### 6. Run tests
```bash
npm test
```

## Scripts
- `npm start` – Start development server
- `npm run build` – Build for production
- `npm test` – Run tests
- `npm run eject` – Eject configuration (not recommended)

## Development Notes
- Uses Material UI (MUI) for modern UI components
- Uses Emotion for CSS-in-JS styling
- Supports modern browsers (latest Chrome, Firefox, Safari)
- API endpoints and backend integration should be configured as needed

## Contributing

Issues and Pull Requests are welcome to help improve the project.

## License

This project is licensed under the MIT License.
