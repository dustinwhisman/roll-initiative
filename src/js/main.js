import {
  bindInitiativeFormListener,
  bindRemoveFromInitiativeButtonEventListener,
  renderInitiativeOrder,
} from './initiative.js';

(() => {
  bindInitiativeFormListener();
  bindRemoveFromInitiativeButtonEventListener();
  renderInitiativeOrder();
})();
