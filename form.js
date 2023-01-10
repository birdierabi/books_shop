'use strict';

import { createElement } from './modules/createElement.js';

const inputFields = document.querySelectorAll('.form-input');
const form = document.querySelector('.form');
const btnSubmit = document.querySelector('.btn--submit');
const overlay = document.querySelector('.overlay');
const main = document.querySelector('.page-main');

function createErrorMessage(target) {
  const item = target.closest('.form-inner');
  const error = item.querySelector('.invalid-text');

  if (!target.checkValidity()) {
    target.style.border = '1px solid #dd526a';

    if (error === null) {
      createElement(item, 'span', ['invalid-text'], 'The field is invalid');
    }
  } else {
    target.style.border = '1px solid #373737';

    if (error !== null) {
      error.remove();
    }
  }
}

function checkDateValidation(target) {
  const currentDate = Date.now();
  const deliveryDate = target.valueAsNumber;

  (deliveryDate > currentDate) ? target.setCustomValidity('') : target.setCustomValidity('Минимальный срок доставки товара: один день от текущей даты');
  target.reportValidity();
}

function checkValidation(event) {
  const target = event.target;

  if (target.id === 'date') {
    checkDateValidation(target);
  }

  createErrorMessage(target); 
}

function enableButton() {
  if (form.checkValidity()) {
    btnSubmit.removeAttribute('disabled');
  }
}

function submitForm() {
  form.submit();
}

function createTotalInfoModal(event) {
  event.preventDefault();

  const formData = new FormData(document.getElementById('form'));
  overlay.classList.add('show');
  const modal = createElement(
    main,
    'div',
    ['total-info'],
    `The order created. The delivery address is ${formData.get(
      'street'
    )} street house ${formData.get('house')} flat ${formData.get(
      'flat'
    )}. Customer ${formData.get('name')} ${formData.get('surname')}.`
  );
  const closeIconWrapper = createElement(modal, 'img', ['modal-close'], '', {'src': './assets/svg/close.svg'});
  closeIconWrapper.addEventListener('click', submitForm);
}

inputFields.forEach((inputField) => inputField.addEventListener('blur', checkValidation));
form.addEventListener('change', enableButton);
form.addEventListener('submit', createTotalInfoModal);