import { StatusBar } from 'expo-status-bar';
import React from 'react';
import ReduxProvider from "./redux/ReduxProvider";


export default function App() {
  return (
    <ReduxProvider/>
  );
}
