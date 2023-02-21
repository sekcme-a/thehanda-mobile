import React,{useCallback, useEffect, useState} from 'react';
import { StyleSheet, Text, TextInput, View,Platform } from 'react-native';
import Browser from "./components/Browser"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import * as SplashScreen from 'expo-splash-screen';



export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    
    async function prepare() {
      try {

        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        // console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {

      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}}>
        <View style={styles.root} onLayout={onLayoutRootView}>
          <View style={styles.browser}>
            <Browser />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  browser: {
    flex: 1,
    flexDirection: 'row'
  },
  header: {
    height: 65,
    paddingTop: 25,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20
  },
  root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
});
