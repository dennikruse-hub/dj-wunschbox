import DjDock from '../components/DjDock';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <DjDock />
    </>
  );
}
