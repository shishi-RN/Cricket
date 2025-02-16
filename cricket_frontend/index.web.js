import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
if (module.hot) {
  module.hot.accept();
}
import mudstone from './assets/fonts/mudstone.otf';
import lean from './assets/fonts/Lean.otf';
import rajhadhanisemif from './assets/fonts/rajdhani-semi.ttf';
import rajhadhaniboldf from './assets/fonts/rajdhani-bold.ttf';
const mudstoneFont = `@font-face {
  src: url(${mudstone});
  font-family: 'mudstone';
}`;
const leanFont = `@font-face {
  src: url(${lean});
  font-family: 'lean';
}`;
const rajhadhanisemi = `@font-face {
  src: url(${rajhadhanisemif});
  font-family: 'rajhadhanisemi';
}`;
const rajhadhanibold = `@font-face {
  src: url(${rajhadhaniboldf});
  font-family: 'rajhadhanibold';
}`;
// Create stylesheet
const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
  style.styleSheet.cssText = regularFontStyles;
} else {
  style.appendChild(document.createTextNode(mudstoneFont));
  style.appendChild(document.createTextNode(leanFont));
  style.appendChild(document.createTextNode(rajhadhanisemi));
  style.appendChild(document.createTextNode(rajhadhanibold));
}

// Inject stylesheet
document.head.appendChild(style);
AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});
