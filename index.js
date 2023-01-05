'use strict';

import { createElement } from './modules/createElement.js';

const wrapper = document.querySelector('.wrapper');
const fragment = document.createDocumentFragment();
const main = createElement(fragment, 'main', ['page-main']);
const list = createElement(main, 'ul', ['books-list']);

function createHeader(fragment) {
  const header = createElement(fragment, 'header', ['page-header']);
  createElement(header, 'img', ['page-header__logo'], '', {'src': './assets/svg/logo.svg'});
}

function createCart(fragment) {
  const cart = createElement(fragment, 'aside', ['page-aside', 'cart']);
  createElement(cart, 'h2', ['title', 'cart-title'], 'Your cart');
  createElement(cart, 'p', ['cart-total'], 'Total: $0.00');
}

createHeader(fragment);
createCart(fragment);
wrapper.append(fragment);

function createModal(event, card) {
  const item = event.target.closest('li');
  const modal = createElement(item, 'div', ['modal']);
  createElement(modal, 'h2', ['modal-title'], card.title);
  createElement(modal, 'p', ['modal-text'], card.description);
  const closeIconWrapper = createElement(modal, 'img', ['modal-close'], '', {'src': './assets/svg/close.svg'});
  closeIconWrapper.addEventListener('click', toggleModal);
}

function closeAllOpenModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach((element) => {
    if (element.classList.contains('modal--open')) {
      element.classList.remove('modal--open');
    }
  });
}

function toggleModal(event) {
  const item = event.target.closest('li');
  const modal = item.querySelector('.modal');
  modal.classList.toggle('modal--open');
}

function openModal(event, card) {
  createModal(event, card);
  closeAllOpenModals();
  toggleModal(event);
}

function dragStartHandler(event, card) {
  event.dataTransfer.setData('text', JSON.stringify(card));
  event.effectAllowed = 'copy';
}

function dragEndHandler(event) {
  event.dataTransfer.clearData();
}

function createCard(card) {
  const bookItem = createElement(list, 'li', ['book-item'], '',
  {
    'data-id': `${card.id}`,
    'draggable': 'true'
  });
  createElement(bookItem, 'img', ['book-img'], '', {'src': `${card.imageLink}`});
  createElement(bookItem, 'h3', ['book-title'], card.title);
  createElement(bookItem, 'p', ['book-author'], card.author);
  createElement(bookItem, 'p', ['book-price'], `USD$${card.price}.00`);
  const btnWrapper = createElement(bookItem, 'div', ['book-btn-wrapper']);
  const btnAddToBag = createElement(
    btnWrapper,
    'button',
    ['btn', 'btn--main'],
    'Add to bag'
  );
  const btnSnowMore = createElement(
    btnWrapper,
    'button',
    ['btn', 'btn--main', 'btn--more'],
    'Show more'
  );
  btnSnowMore.addEventListener('click', (event) =>
    openModal(event, card)
  );
  btnAddToBag.addEventListener('click', () =>
    addToBag(card)
  );
  bookItem.addEventListener('dragstart', (event) =>
    dragStartHandler(event, card)
  );
  bookItem.addEventListener('dragend', dragEndHandler);
}

fetch('assets/books.json')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.forEach((book) => createCard(book));
  });


let booksInCart = [];

function removeConfirmButton() {
  const confirmBtn = document.querySelector('.cart-btn');
  confirmBtn.remove();
}

function removeBook(event, card) {
  const currentBook = booksInCart.find((element) => element.id === card.id);
  currentBook.totalPrice = 0;
  updateTotal(booksInCart);
  booksInCart = booksInCart.filter((element) => element !== currentBook);
  const item = event.target.closest('.cart-item');
  item.remove();

  if (!booksInCart.length) {
    removeConfirmButton();
  }
}

function createConfirmButton() {
  const cart = document.querySelector('.cart');
  createElement(
    cart,
    'a',
    ['btn', 'cart-btn'],
    'Confirm order',
    {
      'href': 'form.html'
    }
  );
}

function updateTotal(booksInCart) {
  let sum = 0;
  const totalPrice = document.querySelector('.cart-total');
  booksInCart.forEach((book) => (sum += book.totalPrice));
  totalPrice.textContent = `Total: $${sum}.00`;
}

function updateQuantity(booksInCart, card) {
  const bookInCart = booksInCart.find((element) => element.id === card.id);
  const currentBook = document.querySelector(`.cart-item[data-id='${card.id}'`);
  const qty = currentBook.querySelector('.cart-qty');
  const price = currentBook.querySelector('.cart-price');
  qty.textContent = `QTY: ${bookInCart.count}`;
  price.textContent = `$${bookInCart.totalPrice}.00`;
}

function createBagElement(card) {
  const bag = document.querySelector('.cart');
  const item = createElement(bag, 'div', ['cart-item'], '', {'data-id': `${card.id}`});
  createElement(item, 'img', ['cart-img'], '', {'src': `${card.imageLink}`});
  const inner = createElement(item, 'div', ['cart-inner']);
  createElement(inner, 'h3', ['cart-book-title'], card.title);
  createElement(inner, 'p', ['cart-author'], card.author);
  createElement(inner, 'p', ['cart-qty'], `QTY: ${card.count}`);
  createElement(inner, 'p', ['cart-price'], `$${card.price}.00`);
  const closeIconWrapper = createElement(item, 'img', ['cart-close'], '', {'src': './assets/svg/close.svg'});
  closeIconWrapper.addEventListener('click', (event) =>
    removeBook(event, card)
  );
}

function addToBag(card) {
  if (!booksInCart.length) {
    createConfirmButton();
  }

  const bookInCart = booksInCart.find((element) => element.id === card.id);
  const newBook = { ...card, count: 1, totalPrice: card.price };

  if (bookInCart) {
    const bookPrice = bookInCart.price;
    bookInCart.count++;
    bookInCart.totalPrice += bookPrice;
    updateQuantity(booksInCart, card);
    updateTotal(booksInCart);
  } else {
    booksInCart.push(newBook);
    createBagElement(newBook);
    updateTotal(booksInCart);
  }
}


const cart = document.querySelector('.cart');

function dragOverHandler(event) {
  event.preventDefault();
}

function dropHandler(event) {
  event.preventDefault();
  const bagCard = event.dataTransfer.getData('text');
  addToBag(JSON.parse(bagCard));
}

cart.addEventListener('dragover', dragOverHandler);
cart.addEventListener('drop', dropHandler);