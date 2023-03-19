import { useEffect, useRef, useState } from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import { Message } from "./Chat";
import { getPoem } from "@/lib/api";
import { BsRobot } from "react-icons/bs";
import { BeatLoader } from "react-spinners";

const AlwaysScrollToBottom = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.scrollIntoView());
  return <div ref={ref} />;
};

const AiMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex w="100">
      <Avatar bg="white" color="gray.900" icon={<BsRobot />}></Avatar>
      <Flex bg="blue.50" borderRadius="0.3rem" maxW="56" my="1" p="3">
        <Text>{children}</Text>
      </Flex>
    </Flex>
  );
};

const UserMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex w="100%" justify="flex-end">
      <Flex bg="yellow.200" borderRadius="0.3rem" maxW="56" my="1" p="3">
        <Text>{children}</Text>
      </Flex>
    </Flex>
  );
};

const PoemMessage = ({ keyword }: { keyword: string }) => {
  const [lines, setLines] = useState<string[] | undefined | string>();

  useEffect(() => {
    getPoem({ text: keyword }).then((data) => {
      if ("error_code" in data) {
        setLines(data.error_msg);
      } else {
        setLines(data.poem[0].content.split("\t"));
      }
    });
  }, [keyword]);

  if (!lines) {
    return (
      <AiMessage>
        <BeatLoader size={6} />
      </AiMessage>
    );
  } else if (typeof lines == "string") {
    return (
      <AiMessage>
        <Text color="red">出错了😢！{lines}</Text>
      </AiMessage>
    );
  } else {
    return (
      <AiMessage>
        {lines.map((txt, id) => (
          <Text key={id}>{txt}</Text>
        ))}
      </AiMessage>
    );
  }
};

const Message = ({ msg }: { msg: Message }) => {
  switch (msg.type) {
    case "AI":
      return <AiMessage>{msg.data}</AiMessage>;
    case "USER":
      return <UserMessage>{msg.data}</UserMessage>;
    case "POEM":
      return <PoemMessage keyword={msg.data} />;
  }
};

export const Messages = ({ msgs }: { msgs: Message[] }) => {
  return (
    <Flex
      w="100%"
      h="80%"
      p="3"
      overflowY="scroll"
      flexDirection="column"
      bg="repeating-linear-gradient(
          45deg,
          transparent 0 5rem,
          var(--chakra-colors-yellow-50) 5rem 9rem
        )"
    >
      {msgs.map((item, id) => {
        return <Message key={id} msg={item} />;
      })}
      <AlwaysScrollToBottom />
    </Flex>
  );
};
