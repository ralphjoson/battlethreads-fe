# BattleThreads

BattleThreads is a competitive battle game that merges strategy, RNG mechanics, and user progression. This project leverages modern technologies like **Expo Monorepo**, **TailwindCSS**, and **TypeScript** to deliver a responsive and scalable application.

---

## 🎯 Features (Planned)

- **User Accounts**: Registration and login functionality.
- **Battle System**: Attack mechanics with RNG-based critical hits, dodging, and damage calculations.
- **Stats and Progression**: Dynamic user stats including health, attack power, and leveling up.
- **Responsive UI**: Built with TailwindCSS for a seamless experience across devices.

---

## 🛠️ Technologies Used

- **Frontend**: [Expo](https://expo.dev/), [React Native](https://reactnative.dev/), [TailwindCSS](https://tailwindcss.com/), [TypeScript](https://www.typescriptlang.org/)
- **Backend/Database**: [PostgreSQL](https://www.postgresql.org/) (Database schema designed for scalability)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (planned)
- **RNG Mechanics**: Centralized configuration for battle randomness.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Yarn](https://yarnpkg.com/) or npm
- Expo CLI: `npm install -g expo-cli`

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/battlethreads.git
   cd battlethreads
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory with the following values:

   ```
   DATABASE_URL=your_database_url
   API_BASE_URL=your_api_base_url
   ```

4. **Run the App**
   ```bash
   yarn start
   ```

---

## 📂 Project Structure

```plaintext
battlethreads/
├── apps/               # Expo Monorepo Apps
│   ├── mobile/         # Mobile app
│   ├── web/            # Web app
├── packages/
│   ├── ui/             # Shared UI components
│   ├── utils/          # Shared utilities
├── database/           # Database schema and migrations
├── src/
│   ├── features/       # Modular features (e.g., battles, users)
│   ├── components/     # Reusable React Native components
├── rngSettings.ts      # Centralized RNG settings for attacks
└── README.md           # Project documentation
```

---

## 🔧 Development Workflow

### Running in Development

- **Mobile**: Launch the mobile app:
  ```bash
  cd apps/mobile
  yarn start
  ```
- **Web**: Start the web app:
  ```bash
  cd apps/web
  yarn start
  ```

### Code Formatting

Run Prettier and ESLint for consistent code:

```bash
yarn lint
yarn format
```

### Database Management

- Use [Prisma](https://www.prisma.io/) or similar ORM for migrations.
- Example command:
  ```bash
  yarn prisma migrate dev
  ```

---

## 🤝 Contributing

Contributions are welcome! Please fork this repo, create a new branch, and submit a pull request. Make sure to follow the coding standards and include relevant documentation for any new features.

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

---

## 🛡️ TODO

- [ ] Implement user authentication and registration
- [ ] Develop battle mechanics with RNG settings
- [ ] Build the UI for battles and stats tracking
- [ ] Add unit tests for core functionalities
- [ ] Optimize performance for mobile and web
