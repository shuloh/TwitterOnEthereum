import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import Tweets from "./Tweets";
const appTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});
const App: React.FC = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <Tweets />
    </ThemeProvider>
  );
};

export default App;
