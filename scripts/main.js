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
const periodInfo = document.getElementById('period-info');