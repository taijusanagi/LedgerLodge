import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src="https://unpkg.com/@web5/api@0.8.2/dist/browser.js" async />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
