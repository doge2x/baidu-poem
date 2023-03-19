import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Divider } from "@/components/Divider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Messages } from "@/components/Messages";

export interface Message {
  type: "AI" | "USER" | "POEM";
  data: string;
}

export function Chat() {
  const [prompt, setPrompt] = useState({ id: 1, data: "我想写一首诗，关于" });
  const [messages, setMessages] = useState<Message[]>([
    { type: "AI", data: "你好！" },
  ]);

  const handleSend = (msg: string) => {
    if (!msg.length) {
      return;
    }
    if (prompt.id == 1) {
      setPrompt({ id: 2, data: "我还想写一首诗，关于" });
    } else {
      const id = prompt.id + 1;
      setPrompt({ id, data: `第${id}首诗，关于` });
    }
    setMessages((old) => [
      ...old,
      { type: "USER", data: `${prompt.data}${msg}` },
      { type: "POEM", data: msg },
    ]);
  };

  return (
    <Flex w="100%" h="100vh" justify="center" align="center">
      <Flex w={["100%", "100%", "60%"]} h="100%" px="1" py="5" flexDir="column">
        <Header />
        <Divider />
        <Messages msgs={messages} />
        <Divider />
        <Footer prompt={prompt.data} onSend={handleSend} />
      </Flex>
    </Flex>
  );
}
