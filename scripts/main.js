import {getAge} from './math-functions.js';
import {monthes, render, saveState, RENDER_TYPES, state, TYPE_OF_WINDOW} from './init.js';
import {addProject, addEmployee} from './panel-data.js';

/*************** TODO: MAIN MENU *************/
const menuBar = document.getElementById('menu-bar');
const btnOpenMenu = document.getElementById('open-menu-btn');
const btnCloseMenu = document.getElementById('menu-close');

btnOpenMenu.addEventListener('click', () => {
  menuBar.classList.add('menu_open');
});
btnCloseMenu.addEventListener('click', () => {
  menuBar.classList.remove('menu_open');

});

/************** TODO: SET PERIOD OF TIME **************/
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

/************** TODO: NAVIGATION ACTIONS **************/
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

/************** TODO: ADD PANEL **************/
document.querySelectorAll('.panel-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    openAddPanel(btn.dataset.type);
  })
})

function openAddPanel(typeTmp) {
  const addPanel = document.getElementById('add-panel');
  document.getElementById('p-background').classList.add('pb_active');
  addPanel.classList.add('ad-panel_active');

  const template = typeTmp === TYPE_OF_WINDOW.Projects ? addProject : addEmployee;
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
        <div class="field__title">${field.label}</div>
    `;
    if (field.fieldType === 'number') {
      panelTmp += `
        <input type="number" id="${field.inputId}" min="0" step="${field.stepNumber}" placeholder="${field.placeholder}" class="field__input add-field">
     `;
    } else if (field.fieldType !== 'select') {
      panelTmp += `
        <input type="${field.fieldType}" id="${field.inputId}" placeholder="${field.placeholder}" class="field__input add-field">
     `;
    } else if (field.fieldType === 'select') {
      panelTmp += `
        <select id="${field.inputId}" class="field__select add-field">
          ${field.selectOptions.reduce((acc, option) => {
        return acc + `<option value="${option}">${option}</option>`;
      }, '')}
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
      <button id="${template.addBtnId}" class="fpanel__button btn-add" data-type="${typeTmp}">Add</button>
  </div>    
  `;
  addPanel.insertAdjacentHTML('beforeend', panelTmp);
  initClosePanelButtons();
  initAddButton(template);

}

function initClosePanelButtons() {
  document.querySelectorAll('.pc_button').forEach(btn => btn.addEventListener('click', closePanel));
}

function closePanel() {
  document.getElementById('p-background').classList.remove('pb_active');
  document.getElementById('add-panel').classList.remove('ad-panel_active');
}

function initAddButton(template) {
  const addButton = document.getElementById(template.addBtnId);
  addButton.addEventListener('click', (e) => {
    const formValid = checkValidForm(template);
    if (formValid) {
      addNewTempToProjectsOrEmployees(template);
      closePanel();
    }
  });

  function addNewTempToProjectsOrEmployees(template) {
    const categoryType = template.id.split('-')[1] + 's';
    const newData = template.fields.reduce((acc, option) => {
      let fieldName = option.label.split(' ')[0].toLowerCase();
      acc[fieldName] = `${document.getElementById(option.inputId).value}`;
      return acc;
    }, {id: `${template.id.split('-')[1].slice(0,3)}-${crypto.randomUUID()}`});
    saveState({
      [categoryType]: [...state[categoryType], newData]
    });
    render(RENDER_TYPES[categoryType]);
  }

  function checkValidForm(template) {
    const parentSection = document.getElementById(template.id);
    return template.fields.reduce((acc, field) => {
      let validate;
      const block = parentSection.querySelector(`#${field.inputId}`);
      const validationField = parentSection.querySelector(`#${field.vFieldID}`);
      if (field.fieldType === 'select') {
        validate = block.value !== 'Select...';
        validationField.innerHTML = `The field must not be empty.`;
      } else if (field.fieldType === 'date') {
        if (!block.value.trim()) {
          validate = false;
          validationField.innerHTML = `The field must not be empty.`;
        } else if (getAge(block.value) < field.limitYear) {
          validate = false;
          validationField.innerHTML = `Age from ${field.limitYear} years old.`;
        } else {
          validate = true;
        }
      } else if (field.fieldType === 'number') {
        if (!block.value.trim()) {
          validate = false;
          validationField.innerHTML = `The field must not be empty.`;
        } else {
          validate = true;
        }
      } else {
        if (block.value.trim().length < field.limitText) {
          validate = false;
          validationField.innerHTML = `Must be at least ${field.limitText} characters long.`;
        } else {
          validate = true;
        }
      }
      validationField.classList[!validate ? 'add' : 'remove']('field__validation_visible');
      block.classList.remove('field_red');
      block.classList.remove('field_green');
      block.classList.add(`${validate ? 'field_green' : 'field_red'}`);
      return acc && validate;
    }, true);
  }

}
