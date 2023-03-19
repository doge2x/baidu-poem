import { Flex, Text } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Flex w="100%" p="3" my="1" justify="center">
      <Text fontSize="lg" fontWeight="bold">
        智能作诗
      </Text>
    </Flex>
  );
};
