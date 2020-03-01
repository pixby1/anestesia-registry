import { CSSReset, Flex, theme, ThemeProvider } from '@chakra-ui/core';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Layout = (props: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Flex align="center" justify="center">
        {props.children}
      </Flex>
    </ThemeProvider>
  );
};

export { Layout };
