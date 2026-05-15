import {months} from "./variables.js";

function getEstimatedPayment(salary, capacity) {
  return formatPrice(salary * Math.max(0.5, capacity));
}

function getMonth(month) {
  return months.indexOf(month);
}

function getAge(date) {
  const dateNow = new Date();
  let years = dateNow.getFullYear() - (new Date(date)).getFullYear();
  let m = dateNow.getMonth() - (new Date(date)).getMonth();
  if (m < 0 || (m === 0 && dateNow.getDate() < (new Date(date)).getDate())) {
    years--;
  }
  return years;
}

function formatPrice(number, symbol = '$') {
  return `${symbol} ` + Number(number).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 *
 * @param domElement
 * @param data Object with template for modal
 */
function openModal(domElement, data) {
  domElement.addEventListener('click', (e) => {
    generateModal(data);
  });
}

function generateModal(data) {
  const modal = document.querySelector(`#modal`);
  const genButtons = data.buttons.map(btn => ({
    id: crypto.randomUUID(),
    ...btn
  }));
  const text = !!data.body.strongText
    ? data.body.text.split(data.body.strongText).join(`<strong>${data.body.strongText}</strong>`)
    : data.body.text;

  const generateButtons = (acc, btn) => {
    return acc + `<button id="${btn.id}" class="modal__btn ${btn.btnColor}">${btn.btnName}</button>`;
  }
  modal.innerHTML = `
    <div class="modal__window">
    <div class="modal__head">
      <div class="modal__title">${data.title}</div>
      <button id="close-modal-btn" class="close-modal__btn">×</button>
    </div>
    <div class="modal__body">
      <div class="modal__text">
        ${text}
      </div>
    </div>
    <div class="modal__footer">
      ${genButtons.reduce(generateButtons, '')}
    </div>
  </div>
`;
  const closeModalBtn = document.querySelector('.close-modal__btn');
  closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('modal-open')
  });
  genButtons.forEach(btn => {
    document.getElementById(btn.id).addEventListener('click', () => {
      !!btn.fn ? btn.fn() : null;
      modal.classList.remove('modal-open');
    });
  })
  modal.classList.add('modal-open');
}

export {getEstimatedPayment, getAge, formatPrice, openModal, getMonth};