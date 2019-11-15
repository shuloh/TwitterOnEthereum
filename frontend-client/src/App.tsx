import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Home from './Home';
import { Web3Provider, LoadingProvider } from './Store';

const appTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});
const App: React.FC = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <LoadingProvider>
        <Web3Provider>
          <Home />
        </Web3Provider>
      </LoadingProvider>
    </ThemeProvider>
  );
};

export default App;
