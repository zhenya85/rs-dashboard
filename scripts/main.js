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

/************** NAVIGATION ACTIONS **************/
const navButtons = document.querySelectorAll('.navigation__btn');
const wDashboard = document.querySelectorAll('.dashboard__wrapper');
navButtons.forEach(btn=>{
  btn.addEventListener('click', (e) => {
    document.querySelector('.active').classList.remove('active');
    e.target.classList.add('active');
    document.querySelector('.dashboard_active').classList.remove('dashboard_active');
    wDashboard.forEach(dItem=>{
      if(dItem.dataset.type === e.target.dataset.type){
        dItem.classList.add('dashboard_active');
      }
    })
  });
});