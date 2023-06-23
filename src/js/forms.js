export const resetErrorState = (input) => {
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
};

export const clearInput = (input) => {
  input.value = '';
};

export const showErrorMessages = (errorList, formName, containerSelector) => {
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
