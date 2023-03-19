import React, { useState } from "react";
import { Flex, Input, IconButton } from "@chakra-ui/react";
import { BsSendFill } from "react-icons/bs";

export const Footer = ({
  prompt,
  onSend,
}: {
  prompt: string;
  onSend: (msg: string) => void;
}) => {
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    setMsg("");
    onSend(msg);
  };

  return (
    <Flex w="100%" mt="1" mb="5" p="3" px="6">
      <Input
        variant="flushed"
        colorScheme="yellow"
        placeholder={prompt}
        value={msg}
        onChange={(ev) => setMsg(ev.target.value.trim())}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />
      <IconButton
        aria-label="作诗"
        bg="yellow.200"
        _hover={{ bgColor: "yellow.300" }}
        icon={<BsSendFill />}
        isDisabled={msg.length <= 0}
        onClick={handleSend}
      />
    </Flex>
  );
};
