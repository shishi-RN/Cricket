import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
if (module.hot) {
  module.hot.accept();
}
import mudstone from './assets/fonts/mudstone.otf';

const mudstoneFont = `@font-face {
  src: url(${mudstone});
  font-family: 'mudstone';
}`;

// Create stylesheet
const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
  style.styleSheet.cssText = regularFontStyles;
} else {
  style.appendChild(document.createTextNode(mudstoneFont));
}

// Inject stylesheet
document.head.appendChild(style);
AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});
