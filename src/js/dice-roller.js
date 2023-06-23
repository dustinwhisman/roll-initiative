import { resetErrorState, showErrorMessages } from './forms.js';

const diceSpecRegex = /^\s*(\d*d\d+\s*(?:[+-]\s*\d*\s*)*\s*)+$/;

const rollDice = (numberOfDice, numberOfSides, multiplier = 1) => {
  const rollResults = [];

  const dice = Number.parseInt(numberOfDice || '1', 10);
  const sides = Number.parseInt(numberOfSides, 10);
  for (let i = 0; i < dice; i += 1) {
    rollResults.push(Math.ceil(Math.random() * sides) * multiplier);
  }

  return rollResults;
};

const getDiceResults = (diceSpec) => {
  const additiveArguments = diceSpec.split('+');
  let rolls = [];
  let bonuses = 0;
  additiveArguments.forEach((arg) => {
    const subtractiveArguments = arg.split('-');
    if (subtractiveArguments.length > 1) {
      subtractiveArguments.forEach((subArg, index) => {
        const multiplier = index > 0 ? -1 : 1;
        const [numberOfDice, numberOfSides] = subArg.split('d');
        if (numberOfSides == null) {
          bonuses += Number.parseInt(numberOfDice, 10) * multiplier;
        } else {
          rolls = [
            ...rolls,
            ...rollDice(numberOfDice, numberOfSides, multiplier),
          ];
        }
      });
    } else {
      const [numberOfDice, numberOfSides] = arg.split('d');
      if (numberOfSides == null) {
        bonuses += Number.parseInt(numberOfDice, 10);
      } else {
        rolls = [...rolls, ...rollDice(numberOfDice, numberOfSides)];
      }
    }
  });

  return { rolls, bonuses };
};

const renderRoll = ({ rolls, bonuses, diceSpec }) => {
  const resultsElement = document.querySelector('.cmp-dice-roller__result');

  const rollElement = document.createElement('div');
  rollElement.classList.add('cmp-dice-roller__roll');

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  rollElement.innerHTML = `
<span class="cmp-dice-roller__timestamp">${date} ${time}</span>
<span class="cmp-dice-roller__input-value">${diceSpec}: </span>
${rolls
  .map(
    (roll, index) => `
${
  index > 0
    ? `<span class="cmp-dice-roller__operator">${roll < 0 ? '-' : '+'}</span>`
    : ''
}
<span class="cmp-dice-roller__dice">${Math.abs(roll)}</span>
`,
  )
  .join('')}
${
  bonuses
    ? `
<span class="cmp-dice-roller__operator">${bonuses < 0 ? '-' : '+'}</span>
<span class="cmp-dice-roller__bonus">${Math.abs(bonuses)}</span>
`
    : ''
}
<span class="cmp-dice-roller__operator">=</span>
<span class="cmp-dice-roller__bonus">${rolls.reduce(
    (sum, roll) => sum + roll,
    bonuses,
  )}</span>
`;

  resultsElement.prepend(rollElement);
};

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

    const { rolls, bonuses } = getDiceResults(diceSpec);
    renderRoll({ rolls, bonuses, diceSpec });
  });
};
