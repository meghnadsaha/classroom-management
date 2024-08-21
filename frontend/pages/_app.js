// pages/_app.js
// import { AuthProvider } from '../src/context/AuthContext';

import { AuthProvider } from "@/app/src/context/AuthContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
