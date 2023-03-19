import Head from "next/head";
import { Chat } from "@/components/Chat";

export default function Home() {
  return (
    <>
      <Head>
        <title>从言·寺声</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Chat />
      </main>
    </>
  );
}
