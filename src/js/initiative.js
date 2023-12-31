const renderInitiativeOrder = (focusOnUpdate = false) => {
  let initiativeOrder = [];
  const rawInitiativeOrder = localStorage.getItem('initiative-order');
  if (rawInitiativeOrder) {
    initiativeOrder = JSON.parse(rawInitiativeOrder);
  }

  const initiativeList = document.querySelector('.cmp-initiative__list');
  if (initiativeList) {
    initiativeList.innerHTML = initiativeOrder
      .map(
        (item) => `
<li value="${item.initiative}">
  <div class="cmp-initiative__list-item">
    <span class="cmp-initiative__name">
      ${item.characterName}
    </span>
    <button type="button" class="cmp-initiative__delete" data-character-name="${item.characterName}" data-initiative="${item.initiative}">
      Delete
    </button>
  </div>
</li>
`,
      )
      .join('');

    if (focusOnUpdate) {
      initiativeList.focus();
    }
  }
};

const resetErrorState = (input) => {
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
};

const clearInput = (input) => {
  input.value = '';
};

const showErrorMessages = (errorList, formName, containerSelector) => {
  const ul = document.createElement('ul');
  ul.id = `${formName}-errors`;
  ul.setAttribute('tabindex', '-1');
  ul.classList.add('cmp-error-list');

  errorList.forEach((error) => {
    const li = document.createElement('li');
    li.id = `${error.fieldName}-field-error`;
    li.textContent = error.message;
    ul.appendChild(li);

    const input = document.querySelector(`[name="${error.fieldName}"]`);
    input?.setAttribute('aria-invalid', 'true');
    input?.setAttribute('aria-describedby', `${error.fieldName}-field-error`);
  });

  const container = document.querySelector(containerSelector);
  container?.prepend(ul);
  ul.focus();
};

const getCurrentInitiativeOrder = () => {
  let initiativeOrder;
  const rawInitiativeOrder = localStorage.getItem('initiative-order');
  if (rawInitiativeOrder) {
    initiativeOrder = JSON.parse(rawInitiativeOrder);
    return initiativeOrder;
  }

  return [];
};

const sortInitiative = (a, b) => {
  if (a.initiative > b.initiative) {
    return -1;
  }

  if (a.initiative < b.initiative) {
    return 1;
  }

  return 0;
};

const setInitiativeOrder = ({ initiative, characterName }) => {
  const initiativeOrder = [
    ...getCurrentInitiativeOrder(),
    {
      initiative,
      characterName,
    },
  ].sort(sortInitiative);

  localStorage.setItem('initiative-order', JSON.stringify(initiativeOrder));
};

const removeFromInitiative = ({ initiative, characterName }) => {
  const initiativeOrder = getCurrentInitiativeOrder();
  const itemToRemoveIndex = initiativeOrder.findIndex(
    (item) =>
      item.initiative === initiative && item.characterName === characterName,
  );
  if (itemToRemoveIndex > -1) {
    initiativeOrder.splice(itemToRemoveIndex, 1);
    localStorage.setItem('initiative-order', JSON.stringify(initiativeOrder));
  }
};

const bindInitiativeFormListener = () => {
  const initiativeForm = document.querySelector('.cmp-initiative__form');
  initiativeForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const errorDescription = document.querySelector('#initiative-form-errors');
    errorDescription?.remove();

    const errorList = [];

    const characterNameInput = event.target.elements['character-name'];
    resetErrorState(characterNameInput);
    const characterName = characterNameInput.value;
    if (!characterName) {
      errorList.push({
        fieldName: 'character-name',
        message: 'Name is required.',
      });
    }

    const initiativeInput = event.target.elements.initiative;
    resetErrorState(initiativeInput);
    const rawInitiative = initiativeInput.value;
    if (!rawInitiative) {
      errorList.push({
        fieldName: 'initiative',
        message: 'Initiative is required and must be a number.',
      });
    }

    const initiative = Number.parseInt(rawInitiative, 10);
    if (rawInitiative && Number.isNaN(initiative)) {
      errorList.push({
        fieldName: 'initiative',
        message: 'Initiative must be a number.',
      });
    }

    if (errorList.length) {
      showErrorMessages(
        errorList,
        'initiative-form',
        '.cmp-initiative__container',
      );
      return;
    }

    setInitiativeOrder({ initiative, characterName });
    clearInput(initiativeInput);
    clearInput(characterNameInput);
    renderInitiativeOrder(true);
  });
};

const bindDeleteButtonEventListener = () => {
  document.addEventListener('click', (event) => {
    if (event.target.matches('.cmp-initiative__delete')) {
      const initiative = Number.parseInt(event.target.dataset.initiative, 10);
      const characterName = event.target.dataset.characterName;
      removeFromInitiative({ initiative, characterName });
      renderInitiativeOrder(true);
    }
  });
};

(() => {
  bindInitiativeFormListener();
  bindDeleteButtonEventListener();
  renderInitiativeOrder();
})();
