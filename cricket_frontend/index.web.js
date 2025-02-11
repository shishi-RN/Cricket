import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
if (module.hot) {
  module.hot.accept();
}
import mudstone from './assets/fonts/mudstone.otf';
import lean from './assets/fonts/Lean.otf';
const mudstoneFont = `@font-face {
  src: url(${mudstone});
  font-family: 'mudstone';
}`;
const leanFont = `@font-face {
  src: url(${lean});
  font-family: 'lean';
}`;

// Create stylesheet
const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
  style.styleSheet.cssText = regularFontStyles;
} else {
  style.appendChild(document.createTextNode(mudstoneFont));
  style.appendChild(document.createTextNode(leanFont));
}

// Inject stylesheet
document.head.appendChild(style);
AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});
