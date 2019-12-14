// tslint:disable interface-name

import { CSSReset, Flex, theme, ThemeProvider } from '@chakra-ui/core';
import * as React from 'react';

interface Props {
  children: object;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Flex align="center" justify="center">
        {children}
      </Flex>
    </ThemeProvider>
  );
};

export { Layout };
