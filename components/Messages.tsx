import { useEffect, useRef, useState } from "react";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { Message } from "./Chat";
import { BsRobot } from "react-icons/bs";
import { BeatLoader } from "react-spinners";
import { ApiRes, GetPoemRes } from "@/lib/types";
import useSWR from "swr";
import { newUrl } from "@/lib/util";

const AlwaysScrollToBottom = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.scrollIntoView());
  return <div ref={ref} />;
};

const AiMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex w="100">
      <Avatar
        boxShadow="xl"
        bg="white"
        color="gray.900"
        mr="2"
        icon={<BsRobot />}
      ></Avatar>
      <Flex
        boxShadow="xl"
        bg="gray.50"
        borderRadius="0.3rem"
        maxW="56"
        my="1"
        p="3"
      >
        <Text>{children}</Text>
      </Flex>
    </Flex>
  );
};

const UserMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex w="100%" justify="flex-end">
      <Flex
        boxShadow="xl"
        bg="yellow.200"
        borderRadius="0.3rem"
        maxW="56"
        my="1"
        p="3"
      >
        <Text>{children}</Text>
      </Flex>
    </Flex>
  );
};

const fetchPoem = async ([url, keyword]: [string, string]) => {
  const response = await fetch(newUrl(url), {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: keyword }),
  });
  const data: ApiRes<GetPoemRes> = await response.json();
  if ("error_code" in data) {
    throw new Error(data.error_msg);
  } else {
    return data.poem[0].content.split("\t");
  }
};

const ShowLines = ({ data }: { data: string[] }) => {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    const reversed = [...data].reverse();
    const tick = setInterval(() => {
      const s = reversed.pop();
      if (!s) {
        clearInterval(tick);
      } else {
        setLines((old) => [...old, s]);
      }
    }, 500);
  }, [data]);
  return (
    <>
      {lines.map((txt, id) => (
        <Text key={id}>{txt}</Text>
      ))}
    </>
  );
};

const PoemMessage = ({ keyword }: { keyword: string }) => {
  const { data, error, isLoading } = useSWR(["/api/poem", keyword], fetchPoem);

  if (isLoading) {
    return (
      <AiMessage>
        <BeatLoader size={6} />
      </AiMessage>
    );
  } else if (!data) {
    return (
      <AiMessage>
        <Text color="red">出错了😢！{error}</Text>
      </AiMessage>
    );
  } else {
    return (
      <AiMessage>
        <ShowLines data={data} />
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
        return (
          <Box key={id} mb="3">
            <Message msg={item} />
          </Box>
        );
      })}
      <AlwaysScrollToBottom />
    </Flex>
  );
};
