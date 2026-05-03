import {getAge, formatPrice, getEstimatedPayment} from './math-functions.js';

/*********** TODO: CONSTANTS **************/
let state = {};
const JOB_POSITIONS = ["Junior", "Middle", "Senior", "Lead", "Architect", "BO"];
const RENDER_TYPES = {
  "All": "all",
  "Header": "header",
  "OpenPage": "openPage",
  "Employees": "employees",
  "Projects": "projects"
}
const TYPE_OF_WINDOW = {
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
if (!localStorage.getItem("state")) {
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
}
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
    if (state.openPage === btn.dataset.type) {
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

function getEmployees() {
  loadState();
  const employeesDashboard = document.getElementById("employees-dashboard");
  const tBody = employeesDashboard.querySelector("tbody");
  const emptyEmployeesTemplate = `
          <tr class="empty__positions">
            <td colspan="9">
              <div class="empty__icon">👥</div>
              <div class="empty__description">
                There are no employees. Add the first one!
              </div>
            </td>
          </tr>
  `;
  const employees = state.employees.reduce((acc, employee) => {
    const {id, name, surname, job, salary, date} = employee;
    let temp = `
      <tr id="${id}" class="employee__position">
        <td class="employee__name">${name}</td>
        <td class="employee__surname">${surname}</td>
        <td class="employee__age">${getAge(date)}</td>
        <td class="employee__job-title">${addJobSelection(job)}</td>
        <td class="employee__salary">${formatPrice(salary)}</td>
        <td class="employee__pay">${getEstimatedPayment(salary, 0)}</td>
        <td class="employee__project">
          <button class="employee__project-btn">-</button>  
        </td>
        <td class="employee__income">${formatPrice(0)}</td>
        <td class="employee__actions">
          <button title="Vocation">📅</button>
          <button title="Vocation">Assign</button>
          <button class="employee__actions_remove" title="Vocation">×</button>
        </td>
      </tr>
    `;
    return acc + temp;
  }, "");
  tBody.innerHTML = employees.length ? employees : emptyEmployeesTemplate;
  tBody.querySelectorAll('.employee__position')
    .forEach(employee => {
      employee.querySelector('.employee-job-selection').addEventListener('change', changeSelectStatus);
    });
}

function addJobSelection(selectedJob) {
  let template = `<select class="employee-job-selection">`;
  template += JOB_POSITIONS.reduce((acc, job) => {
    acc += `<option value="${job}" ${job === selectedJob ? 'selected' : ''}>${job}</option>`;
    return acc;
  }, '');
  template += '</select>';
  return template;
}

function changeSelectStatus(e) {
  const mainSection = e.target.closest('.dashboard__wrapper');
  const parentEmployee = e.target.closest('.employee__position');
  saveState({[mainSection.dataset.type]: state[mainSection.dataset.type].map(emp => {
      if(emp.id === parentEmployee.id) {
        return {...emp, job: e.target.value}
      }
      return emp;
    })});
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
  if (section === RENDER_TYPES.Projects || section === RENDER_TYPES.All) {
  }
  if (section === RENDER_TYPES.Employees || section === RENDER_TYPES.All) {
    getEmployees();
  }

}

export {
  state,
  render,
  saveState,
  RENDER_TYPES,
  monthes,
  TYPE_OF_WINDOW,
  JOB_POSITIONS
};

