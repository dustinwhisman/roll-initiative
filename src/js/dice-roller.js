import { resetErrorState, showErrorMessages } from './forms.js';

const diceSpecRegex = /^\s*(\d*d\d+\s*(?:[+-]\s*\d*\s*)*\s*)+$/;

export const bindDiceRollerFormListener = () => {
  const diceRollerForm = document.querySelector('.cmp-dice-roller__form');
  diceRollerForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const errorDescription = document.querySelector('#dice-roller-form-errors');
    errorDescription?.remove();

    const errorList = [];

    const diceSpecInput = event.target.elements['dice-spec'];
    resetErrorState(diceSpecInput);
    const diceSpec = diceSpecInput.value;
    if (!diceSpec) {
      errorList.push({
        fieldName: 'dice-spec',
        message: 'The Dice field is required.',
      });
    }

    const isValid = diceSpecRegex.test(diceSpec);
    if (diceSpec && !isValid) {
      errorList.push({
        fieldName: 'dice-spec',
        message:
          'The Dice field must be formatted with a valid dice notation. For example, "1d20+5" would mean rolling one twenty-sided die and adding 5.',
      });
    }

    if (errorList.length) {
      showErrorMessages(
        errorList,
        'dice-roller-form',
        '.cmp-dice-roller__container',
      );
      return;
    }
  });
};
