# 🍳 Cooking Assistant

An AI-powered cooking companion built with React Native and Expo, featuring voice recognition and Google Gemini AI integration.

## ✨ Features

- **Voice Recognition**: Speak naturally to get cooking help
- **AI-Powered Responses**: Powered by Google Gemini for intelligent cooking advice
- **Text-to-Speech**: Hear responses read aloud
- **Modern UI**: Beautiful, intuitive interface with smooth animations
- **Cross-Platform**: Works on iOS, Android, and Web

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your Gemini API key from: https://makersuite.google.com/app/apikey

4. Start the development server:
   ```bash
   npm start
   ```

5. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web browser
   - Scan QR code with Expo Go app on your phone

## 🎨 UI Improvements Made

- **Modern Design System**: Consistent colors, spacing, and typography
- **Enhanced Navigation**: Better tab icons and styling
- **Improved Voice Assistant**: Better error handling and visual feedback
- **Feature Cards**: Interactive cards showcasing app capabilities
- **Responsive Layout**: Works well on different screen sizes
- **Dark Mode Support**: Automatic theme switching based on system preferences

## 🛠 Technical Improvements

- **TypeScript Migration**: Converted JavaScript files to TypeScript for better type safety
- **Error Handling**: Comprehensive error handling for voice recognition and API calls
- **Performance**: Optimized components and reduced re-renders
- **Accessibility**: Better accessibility support with proper labels and contrast
- **Code Organization**: Cleaner file structure and component organization

## 📱 Screens

- **Home**: Main interface with voice assistant and feature overview
- **Explore**: Quick actions and helpful resources
- **Modal**: About screen with app information

## 🔧 Configuration

The app uses Expo Router for navigation and includes:
- Voice recognition via `@react-native-voice/voice`
- Text-to-speech via `react-native-tts`
- AI responses via Google Gemini API
- Modern UI components with Expo Vector Icons

## 📄 License

This project is open source and available under the MIT License.
