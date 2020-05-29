import { red } from '@material-ui/core/colors';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

// A custom theme for this app
let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0d47a1',
      light: '#fff'
    },
    secondary: {
      main: '#0277bd',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;