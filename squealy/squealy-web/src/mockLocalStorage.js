//TODO: Write this in ES6

var localStorageMock = (function() {
  var store = {'hidash': '{}'}
  return {
    getItem: function(key) {
      return store[key];
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Define window.$ so that $ is available globally
import $ from 'jquery'
window.$ = $
