import React, { useRef, useState, useEffect } from 'react';
import { BackHandler, ToastAndroid, Text, Button, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
// 

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-modules-core';
import { firestore as db } from "../firebase"

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

const Browser = () => {
  //포스트를 보고있을땐, 루트페이지에서 뒷버튼을 누르면 "한번도 클릭하면 나가집니다" 가 뜨지 않게 방지하기 위함.
  const [isOnPost, setIsOnPost] = useState(false)
  //***********웹뷰 부분************* */
  const webview = useRef(null);
  const URL = "https://dahanda.netlify.app"
  // const URL = "http://192.168.43.38:3000/"
  const [location, setLocation] = useState([""]);
  const [canGoBack, setCanGoBack] = useState(false)
  const [his, setHis] = useState([])
  let history = [""];
  let time = 0;

  // const handleMessage = event => {
  //   const { nativeEvent: { data } } = event;
  //   Alert.alert(data);
  // }

  const onPressHardwareBackButton = () => {
    console.log(his)
    console.log(his[his.length - 1])
    if (his[his.length - 1] === `${URL}/` || his.length === 1) {
      time += 1;
      ToastAndroid.show("'뒤로' 버튼을 한번 더 누르시면 종료됩니다.", ToastAndroid.SHORT);
      if (time === 1) {
        setTimeout(() => time = 0, 2000)
      } else if (time === 2) {
        BackHandler.exitApp();
        return false;
      }
      return true;
    } else if (webview.current) {
      webview.current.goBack();
      history = his
      // history = [`${history.pop()}`]
      history.pop()
      setHis(history)
      return true;
    } else {
      console.log("err")
    }

    // if (webview.current && history[history.length-1] !== `${URL}/` && history.length!==1) {
    //   webview.current.goBack();
    //   history=[`${history.pop()}`]
    //   return true;
    // } else {
    //   time += 1;
    //   ToastAndroid.show("'뒤로' 버튼을 한번 더 누르시면 종료됩니다.", ToastAndroid.SHORT);
    //   if (time === 1) {
    //     setTimeout(()=> time = 0, 2000)
    //   } else if (time === 2) {
    //     BackHandler.exitApp();
    //     return false;
    //   }
    //   return true;
    // }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onPressHardwareBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onPressHardwareBackButton);
    }
  }, []);


  //***********************notification부분***************************/
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState();
  const [pushToken, setPushToken] = useState("")
  const notificationListener = useRef();
  const responseListener = useRef();
  
  const [test, setTest] = useState("")
 
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      setTest(token)
    });
	
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
	
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
	
    return () => {
      if (typeof notificationListener.current !== 'undefined' && typeof responseListener.current !== 'undefined') {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);
  
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        // alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      setPushToken(token)
      webview.current.postMessage(token)
    } else {
      // alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }


  const handleMessage = event => {
    const { nativeEvent: { data } } = event;
    console.log(`data:${data}`)
    if (data.includes("UID_DATA: ")) {
      const temp = data.split("UID_DATA: ")
      db.collection("users").doc(temp[1]).update({ pushToken: pushToken })
    }
    
  };

  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <WebView
      ref={webview}
      source={{
        uri: URL,
      }}
      userAgent='customuseragent'
      textZoom={100}
      injectedJavaScript={`
        (function() {
          function wrap(fn) {
            return function wrapper() {
              var res = fn.apply(this, arguments);
              window.ReactNativeWebView.postMessage(window.location.href);
              return res;
            }
          }

          history.pushState = wrap(history.pushState);
          history.replaceState = wrap(history.replaceState);
          window.addEventListener('popstate', function() {
            window.ReactNativeWebView.postMessage(window.location.href);
          });
        })();

        true;
      `}
      onMessage={handleMessage}
    />
  // </SafeAreaView>
  );
};

export default Browser