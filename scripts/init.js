/*********** TODO: CONSTANTS **************/
let state = {};
const RENDER_TYPES = {
  "All": "all",
  "Header": "header",
  "OpenPage": "openPage",
  "Employees": "employees",
  "Projects": "projects"
}
const TYPE_OF_WINDOW={
  "Projects": "projects",
  "Employees": "employees"
}
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
/************* TODO: INIT STATE ************/
saveState({
  selectedMonth: monthes[realMonth],
  selectedYear: realYear,
  openPage: TYPE_OF_WINDOW.Projects,
  filters: {
    projects: {},
    employees: {}
  },
  employees: [],
  projects: []
});
render();


/************* TODO: ALL Functions ************/


function updateHeader() {
  const periodInfo = document.getElementById("period-info");
  periodInfo.innerText = `${state?.selectedMonth}, ${state?.selectedYear}`
}

function openPage() {
  document.querySelector(".active").classList.remove("active");
  const navBtn = document.querySelectorAll(".navigation__btn");
  navBtn.forEach(btn => {
    if(state.openPage === btn.dataset.type) {
      btn.classList.add("active");
    }
  })
}

function saveState(data) {
  localStorage.setItem("state", JSON.stringify({
    ...state,
    ...data
  }));
}

function loadState() {
  let stateStr = localStorage.getItem("state");
  return ({
    ...(!!stateStr ? JSON.parse(stateStr) : {}),
  })
}
/*********** TODO: RENDER ***********/
function render(section = RENDER_TYPES.All) {
  state = {
    ...state,
    ...loadState()
  };
  if (section === RENDER_TYPES.Header || section === RENDER_TYPES.All) {
    updateHeader();
  }
  if (section === RENDER_TYPES.OpenPage || section === RENDER_TYPES.All) {
    openPage();
  }
  if (section === RENDER_TYPES.Projects || section === RENDER_TYPES.All) {}
  if (section === RENDER_TYPES.Employees || section === RENDER_TYPES.All) {}

}

export {state, render, saveState, RENDER_TYPES, monthes, TYPE_OF_WINDOW};

