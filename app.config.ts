module.exports = () => {
  return {
    expo: {
      name: "taluyku",
      slug: "taluyku",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/app-icon.png",
      scheme: "myapp",
      userInterfaceStyle: "automatic",
      splash: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        supportsTablet: true,
        config: {
          googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#ffffff",
        },
        permissions: [
          "CAMERA",
          "READ_EXTERNAL_STORAGE",
          "WRITE_EXTERNAL_STORAGE",
        ],
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png",
      },
      plugins: [["expo-image-picker"], ["expo-location"]],
      experiments: {
        typedRoutes: true,
        tsconfigPaths: true,
      },
    },
  };
};
