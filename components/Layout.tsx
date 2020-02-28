import { CSSReset, Flex, theme, ThemeProvider } from '@chakra-ui/core';
import * as React from 'react';

interface Props {
  children: object;
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
