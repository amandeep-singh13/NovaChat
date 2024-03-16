import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import React from "react";
const UserBadgeItem = ({ user, handleFunction}) => {
  return (
    <Box display="flex-row" gap={4}
      className="rounded-md"
      px={3}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="purple"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.username}
      {/* {admin === user._id && <span> (Admin)</span>} */}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;