import { bindDiceRollerFormListener } from './dice-roller.js';
import {
  bindInitiativeFormListener,
  bindRemoveFromInitiativeButtonEventListener,
  renderInitiativeOrder,
} from './initiative.js';

(() => {
  bindInitiativeFormListener();
  bindRemoveFromInitiativeButtonEventListener();
  renderInitiativeOrder();

  bindDiceRollerFormListener();
})();
