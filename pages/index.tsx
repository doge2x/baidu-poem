import Head from "next/head";
import { Chat } from "@/components/Chat";

export default function Home() {
  return (
    <>
      <Head>
        <title>智能作诗</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Chat />
      </main>
    </>
  );
}
