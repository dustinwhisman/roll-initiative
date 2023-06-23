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

const setInitiativeOrder = ({ initiative, characterName }) => {
  let initiativeOrder;
  const rawInitiativeOrder = localStorage.getItem('initiative-order');
  if (rawInitiativeOrder) {
    initiativeOrder = JSON.parse(rawInitiativeOrder);
    initiativeOrder = [
      ...initiativeOrder,
      {
        initiative,
        characterName,
      },
    ].sort((a, b) => {
      if (a.initiative > b.initiative) {
        return -1;
      }

      if (a.initiative < b.initiative) {
        return 1;
      }

      return 0;
    });
  } else {
    initiativeOrder = [
      {
        initiative,
        characterName,
      },
    ];
  }

  localStorage.setItem('initiative-order', JSON.stringify(initiativeOrder));
};

const bindInitiativeFormListener = () => {
  const initiativeForm = document.querySelector('.cmp-initiative__form');
  initiativeForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const errorDescription = document.querySelector('#initiative-form-errors');
    errorDescription?.remove();

    const errorList = [];

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

    const characterNameInput = event.target.elements['character-name'];
    resetErrorState(characterNameInput);
    const characterName = characterNameInput.value;
    if (!characterName) {
      errorList.push({
        fieldName: 'character-name',
        message: 'Name is required.',
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
    renderInitiativeOrder(true);
  });
};

(() => {
  bindInitiativeFormListener();
  renderInitiativeOrder();
})();
