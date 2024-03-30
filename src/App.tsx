import { SafeAreaView, StyleSheet } from "react-native";
import AppNav from "#src/navigation/AppNav";
import { AuthProvider } from "#src/auth/context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
