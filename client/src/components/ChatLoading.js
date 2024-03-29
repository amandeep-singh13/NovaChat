import React, { useContext } from 'react';
import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import { ThemeContext } from '../Context/ThemeContext'

function ChatLoading() {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack>
      <Skeleton height="45px" className={`${theme === 'dark' ? 'bg-gray-700' : ''}`} />
      <Skeleton height="45px" className={`${theme === 'dark' ? 'bg-gray-700' : ''}`} />
      <Skeleton height="45px" className={`${theme === 'dark' ? 'bg-gray-700' : ''}`} />
      <Skeleton height="45px" className={`${theme === 'dark' ? 'bg-gray-700' : ''}`} />
      <Skeleton height="45px" className={`${theme === 'dark' ? 'bg-gray-700' : ''}`} />
      <Skeleton height="45px" className={`${theme === 'dark' ? 'bg-gray-700' : ''}`} />
      <Skeleton height="45px" className={`${theme === 'dark' ? 'bg-gray-700' : ''}`} />
      <Skeleton height="45px" className={`${theme === 'dark' ? 'bg-gray-700' : ''}`} />
      <Skeleton height="45px" className={`${theme === 'dark' ? 'bg-gray-700' : ''}`} />
      <Skeleton height="45px" className={`${theme === 'dark' ? 'bg-gray-700' : ''}`} />
      <Skeleton height="45px" className={`${theme === 'dark' ? 'bg-gray-700' : ''}`} />
      <Skeleton height="45px" className={`${theme === 'dark' ? 'bg-gray-700' : ''}`} /> 
    </Stack>
  )
};

export default ChatLoading;
