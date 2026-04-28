import {monthes, render, saveState,RENDER_TYPES} from './init.js';
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