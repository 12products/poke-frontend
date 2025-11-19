# Poke

A personal accountability system built with React Native and Expo. Set up recurring goals and get reminded about them via text message. Track your progress and build lasting habits.

## About

Poke helps you stay accountable to your goals. For example, if you want to go to the gym three days a week, you can add a reminder in Poke to message you on your gym days. Poke will keep track of when you accomplish your goals or when you've slipped up.

## Features

### Core Features
- Create reminders that will be regularly sent as text messages
- Set which days reminders are sent
- Set which times reminders are sent
- Respond to text to confirm completion
- Respond to text to disable reminders ("snooze")
- Get reminded if you do not respond to text
- Manage all your reminders in one place

### Planned Features
- Dashboard summarizing your reminders
- Data visualization of your streaks

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Language**: TypeScript
- **Backend**: [Supabase](https://supabase.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind React Native (twrnc)](https://github.com/jaredh159/tailwind-react-native-classnames)
- **Forms**: React Hook Form with Yup validation
- **Navigation**: React Navigation v6

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Yarn](https://yarnpkg.com/) package manager
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (macOS) or Android Studio (for Android emulator)
- A Supabase project (for backend services)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/poke-frontend.git
   cd poke-frontend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**

   Copy the example environment file and update with your values:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_PUBLIC_KEY=your_supabase_anon_key
   POKE_URL=your_backend_api_url
   ```

4. **Build native dependencies** (required for dev client)
   ```bash
   # For iOS
   yarn ios

   # For Android
   yarn android
   ```

## Running the App

```bash
# Start the development server
yarn start

# Run on iOS simulator
yarn ios

# Run on Android emulator
yarn android

# Run on web
yarn web
```

## Project Structure

```
poke-frontend/
├── assets/              # Images, fonts, and other static assets
├── components/          # Reusable UI components
│   └── ReminderItem.tsx
├── constants/           # App constants and configuration
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries (Supabase client, etc.)
├── navigation/          # React Navigation configuration
├── screens/             # App screens organized by stack
│   ├── AppStack/        # Main app screens (authenticated)
│   │   ├── RemindersScreen.tsx
│   │   ├── CreateReminderScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── AuthStack/       # Authentication screens
│   │   ├── SignInScreen.tsx
│   │   └── VerifyAccountScreen.tsx
│   └── OnboardStack/    # Onboarding screens
│       └── OnboardScreen.tsx
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
├── App.tsx              # App entry point
├── app.json             # Expo configuration
└── package.json         # Dependencies and scripts
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start the Expo development server |
| `yarn ios` | Run on iOS simulator |
| `yarn android` | Run on Android emulator |
| `yarn web` | Run in web browser |
| `yarn test` | Run tests in watch mode |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_PUBLIC_KEY` | Your Supabase anonymous/public key |
| `POKE_URL` | Backend API URL for Poke services |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

If you encounter any issues or have questions, please open an issue in the repository.
