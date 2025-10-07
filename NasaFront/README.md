# Nasa Space Apps Challenge 2025
## Will it rain in my parade?

**Hacka Cloud** - A weather prediction app that helps you plan your outdoor events with confidence.

## Team Los Hackamoles: segunda temporada van al espacio en HD
### Members
- Diego Quiros
- Isaac Reyes
- Eliel Ontiveros
- Adan Gonzalez
- Alejandro Mercado
- Ramon Mejia

---

## 📱 About the Project

Hacka Cloud is a React Native mobile application built with Expo that provides weather predictions and recommendations for your outdoor events. The app uses NASA's weather data to help you make informed decisions about your plans.

### Key Features
- 🗺️ **Interactive Map Selection**: Select your event location using an interactive map with address search
- 📅 **Date & Time Planning**: Choose when your event will take place
- 🌤️ **Weather Metrics**: Get predictions for temperature, precipitation, humidity, and solar radiation
- 💬 **AI Chat Assistant**: Ask questions about weather conditions with our intelligent chatbot
- 📊 **Visual Results**: See weather data in beautiful charts and graphs
- ☁️ **Animated UI**: Smooth cloud animations and modern gradient backgrounds

---

## 🚀 Getting Started

### Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** (will be installed with dependencies)
- **Expo Go app** on your mobile device (iOS/Android) - [Download](https://expo.dev/client)
- **Git** - [Download](https://git-scm.com/)

For iOS development:
- **Xcode** (macOS only)
- **iOS Simulator** (included with Xcode)

For Android development:
- **Android Studio**
- **Android Emulator** (included with Android Studio)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NasaFront
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory (or modify the existing one):
   ```env
   EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
   EXPO_PUBLIC_API_TIMEOUT=30000
   ```
   
   **Important**: If testing on a physical device, replace `localhost` with your computer's IP address:
   ```env
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.XXX:8000
   ```

4. **Start the backend server** (if available)
   
   The app requires a backend server to be running. Navigate to your backend directory:
   ```bash
   cd ../NasaBack
   python main.py
   ```

### Running the App

#### Development Mode

Start the Expo development server:
```bash
npm start
# or
expo start
```

This will open the Expo Developer Tools in your browser.

#### Run on iOS Simulator (macOS only)
```bash
npm run ios
# or
expo start --ios
```

#### Run on Android Emulator
```bash
npm run android
# or
expo start --android
```

#### Run on Physical Device

1. Install **Expo Go** app on your device
2. Start the development server: `npm start`
3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

---

## 📂 Project Structure

```
NasaFront/
├── app/                          # App screens and navigation
│   ├── (stack)/                  # Stack navigation screens
│   │   ├── home/                 # Home screen
│   │   ├── map/                  # Map selection screens
│   │   │   └── dateHour/         # Date & time selection
│   │   ├── chat/                 # Chat with AI assistant
│   │   └── Resultados/           # Weather results screen
│   └── _layout.tsx               # Root layout configuration
├── componentes/                  # Reusable components
│   ├── chat/                     # Chat components
│   ├── maps/                     # Map components
│   ├── CloudsBackground.tsx      # Animated clouds
│   ├── MapWithAddressInput.tsx   # Map with search
│   └── ...                       # Other UI components
├── contexts/                     # React Context providers
│   └── EventContext.tsx          # Event data management
├── hooks/                        # Custom React hooks
│   ├── useAPI.ts                 # API integration hooks
│   └── useLocation.ts            # Location management
├── services/                     # API services
│   └── api.ts                    # API client
├── types/                        # TypeScript type definitions
├── config/                       # App configuration
│   └── api.ts                    # API endpoints config
├── assets/                       # Images and static files
├── .env                          # Environment variables
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

---

## 🛠️ Technologies Used

### Core
- **React Native** (0.81.4) - Mobile framework
- **Expo** (~54.0.12) - Development platform
- **TypeScript** (~5.9.2) - Type safety
- **Expo Router** (~6.0.10) - File-based routing

### UI & Styling
- **NativeWind** (^4.2.1) - Tailwind CSS for React Native
- **Expo Linear Gradient** - Gradient backgrounds
- **Lucide React** - Icon library
- **React Native Reanimated** - Smooth animations

### Maps & Location
- **React Native Maps** (1.20.1) - Interactive maps
- **Expo Location** (~19.0.7) - GPS and geocoding

### Navigation
- **React Navigation** - Navigation library
- **Expo Router** - File-based routing

### Other
- **Expo Image** - Optimized image component
- **React Native Gesture Handler** - Touch gestures
- **Expo Haptics** - Haptic feedback

---

## 🔧 Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

---

## 🌐 API Integration

The app connects to a backend API for weather predictions. See [INTEGRATION_README.md](./INTEGRATION_README.md) for detailed API documentation.

### Available Services
- **Weather Prediction**: Get weather forecasts for specific locations and times
- **Chat Service**: Ask questions about weather conditions
- **CSV Generation**: Export weather data

---

## 📱 App Flow

1. **Home Screen**: Welcome screen with app introduction
2. **Map Selection**: Choose your event location on an interactive map
3. **Date & Time**: Select when your event will happen
4. **Plan Details**: Describe your event and select weather metrics
5. **Results**: View weather predictions and recommendations
6. **Chat**: Ask questions to the AI assistant

---

## 🔐 Permissions

The app requires the following permissions:
- **Location**: To access GPS and select event locations
- **Internet**: To fetch weather data from the API

---

## 🐛 Troubleshooting

### Common Issues

**1. Metro bundler error**
```bash
# Clear cache and restart
npm start -- --clear
```

**2. Cannot connect to backend**
- Ensure backend server is running
- Check `.env` file has correct API URL
- For physical devices, use your computer's IP address instead of `localhost`

**3. Map not loading**
- Check internet connection
- Verify location permissions are granted
- Ensure `expo-location` plugin is configured in `app.json`

**4. Build errors**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 License

This project was created for the NASA Space Apps Challenge 2025.

---

## 🤝 Contributing

This is a hackathon project. For questions or suggestions, please contact the team members.

---

## 📞 Support

For issues or questions:
1. Check the [INTEGRATION_README.md](./INTEGRATION_README.md) for API documentation
2. Review the [FIXES_SUMMARY.md](./FIXES_SUMMARY.md) for known issues and fixes
3. Contact the development team

---

**Made with ❤️ by Team Los Hackamoles**