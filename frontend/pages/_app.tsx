import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />

        <title>Rainbow Connection</title>

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />

        <meta
          property="og:image"
          content="https://via.placeholder.com/450x200.png"
        />
        <meta property="og:url" content="" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
