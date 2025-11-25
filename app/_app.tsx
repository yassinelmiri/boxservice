import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './globals.css';
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}