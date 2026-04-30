import {monthes, render, saveState, RENDER_TYPES} from './init.js';
import {addProject, addEmployee} from './panel-data.js';

/*************** MAIN MENU *************/
const menuBar = document.getElementById('menu-bar');
const btnOpenMenu = document.getElementById('open-menu-btn');
const btnCloseMenu = document.getElementById('menu-close');

btnOpenMenu.addEventListener('click', () => {
  menuBar.classList.add('menu_open');
});
btnCloseMenu.addEventListener('click', () => {
  menuBar.classList.remove('menu_open');

});

/************** SET PERIOD OF TIME **************/
const pMonth = document.getElementById('p-month');
const pYear = document.getElementById('p-year');

pMonth.addEventListener('change', setPeriod);
pYear.addEventListener('change', setPeriod);

function setPeriod() {
  const periodOfTime = {
    selectedMonth: monthes[pMonth.value],
    selectedYear: pYear.value,
  }
  saveState(periodOfTime);
  render(RENDER_TYPES.Header);
}

/************** NAVIGATION ACTIONS **************/
const navButtons = document.querySelectorAll('.navigation__btn');
const wDashboard = document.querySelectorAll('.dashboard__wrapper');
navButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelector('.active').classList.remove('active');
    e.target.classList.add('active');
    document.querySelector('.dashboard_active').classList.remove('dashboard_active');
    wDashboard.forEach(dItem => {
      if (dItem.dataset.type === e.target.dataset.type) {
        dItem.classList.add('dashboard_active');
      }
    })
  });
});

/************** ADD PANEL **************/
document.querySelectorAll('.panel-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    openAddPanel(btn.dataset.type);
  })
})
function openAddPanel(typeTmp) {
  document.getElementById('p-background').classList.add('pb_active');
  document.getElementById('add-panel').classList.add('ad-panel_active');

  const template = typeTmp === 'project' ? addProject : addEmployee;
  const addPanel = document.getElementById('add-panel');
  addPanel.innerHTML = '';
  let panelTmp = '';
  panelTmp += `
  <div class="panel__header">
    <div class="panel__title">${template.title}</div>
    <button class="panel_close pc_button">×</button>
  </div>
  <div id="${template.id}" class="panel__body">
  `;
  template.fields.forEach(field => {
    panelTmp += `
      <div class="field__wrapper">
        <label for="project-name" class="field__title">${field.label}</label>
    `;
    if (field.fieldType !== 'select') {
      panelTmp += `
        <input type="${field.fieldType}" id="${field.inputId}" placeholder="${field.placeholder}" class="field__input">
     `;
    } else if (field.fieldType === 'select') {
      panelTmp += `
        <select id="${field.inputId}" class="field__select">
          ${field.selectOptions.reduce((acc,option)=>{
            return acc + `<option value="${option}">${option}</option>`;
      },'')}
        </select>
      `;
    }
    panelTmp += `
      <div id="${field.vFieldID}" class="field__validation"></div>
      </div>
    `;

  });
  panelTmp += `
    </div>
    <div class="panel__footer">
      <button class="fpanel__button btn-cancel pc_button">Cancel</button>
      <button id="${template.addBtnId}" class="fpanel__button btn-add">Add</button>
  </div>    
  `;
  addPanel.insertAdjacentHTML('beforeend', panelTmp);
  document.querySelectorAll('.pc_button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.pb_active').classList.remove('pb_active');
      document.querySelector('.ad-panel_active').classList.remove('ad-panel_active');
    })
  })

}


/************** FUNCTIONS **************/
function formatPrice(number, symbol = '$') {
  return `${symbol} ` + number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}