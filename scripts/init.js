/*********** CONSTANTS **************/
const monthes = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"];
const years = [2025, 2026, 2027];
/*********** INIT MENU BAR **********/
const pMonth = document.getElementById("p-month");
const pYear = document.getElementById("p-year");
const realYear = new Date().getFullYear();
const realMonth = new Date().getMonth();
pMonth.insertAdjacentHTML("beforeend", monthes.reduce((acc, month, ind) => {
  return acc + `<option value="${ind}" ${ind === realMonth ? 'selected' : ''}>${month}</option>`;
}, ''));
pYear.insertAdjacentHTML("beforeend", years.reduce((acc, year) => {
  return acc + `<option value="${year}" ${year === realYear ? 'selected' : ''}>${year}</option>`;
}, ''));
/************* INIT STATE ************/
let stateStr = localStorage.getItem("state");
let state = {
  ...(!!stateStr ? JSON.parse(stateStr) : {}),
}
console.log(state);
/*********** RENDER ***********/

function render() {

}

export {state, render};

