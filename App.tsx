import { StyleSheet } from 'react-native';
import AppNav from '#src/navigation/AppNav';
import { AuthProvider } from '#src/auth/context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppNav />
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({});

export default App;
