import {getAge, formatPrice, getEstimatedPayment, openModal, MODAL_BUTTONS_COLOR} from './other-functions.js';

/*********** TODO: CONSTANTS **************/
let state = {};
const JOB_POSITIONS = ["Junior", "Middle", "Senior", "Lead", "Architect", "BO"];
const RENDER_TYPES = {
  "All": "all",
  "Header": "header",
  "OpenPage": "openPage",
  "Employees": "employees",
  "Projects": "projects",
  "DashboardInfo": "dashboardInfo",
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
function updateDashboardInfo() {
  const allProjects = document.getElementById("dashboard-all-projects");
  const allBudget=document.getElementById("dashboard-all-projects-budget");
  const allEmployees = document.getElementById("dashboard-employees");
  const fot = document.getElementById("dashboard-fot");
  const estimateIncome = document.getElementById("dashboard-estimate-income");
  allProjects.innerHTML = state.projects.length;
  allBudget.innerHTML = formatPrice(state.projects.reduce((summ, project)=>{
    return summ+Number(project.budget);
  },0));
  allEmployees.innerHTML = state.employees.length;
  fot.innerHTML = formatPrice(0);
  estimateIncome.innerHTML= formatPrice(0);
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

function getProjects() {
  const projectsDashboard = document.getElementById("projects-dashboard");
  const tBody = projectsDashboard.querySelector("tbody");
  const emptyProjectsTemplate = `
    <tr class="empty__positions">
      <td colspan="7">
        <div class="empty__icon">📁</div>
        <div class="empty__description">
          There are no projects yet. Be the first to add one!
        </div>
      </td>
    </tr>
  `;
  const projects = state.projects.reduce((acc, projectItem) => {
    const {id, project, company, budget, capacity} = projectItem;
    let temp = `
      <tr id="${id}" class="project__position">
        <td class="project__company">${company}</td>
        <td class="project__project">${project}</td>
        <td class="project__budget">${formatPrice(budget)}</td>
        <td class="project__capacity">
          <div>${formatPrice(0,"")}/${capacity}</div>
          <div class="progress">
            <div id="project-progress-line" class="p-line" style="width: ${showCapacityProgressLine(capacity)}%"></div>
          </div>
        </td>
        <td class="project__employees">
          <button class="project__employees-btn">Show (${0})</button>
        </td>
        <td class="project__income">${formatPrice(0)}</td>
        <td class="project__actions">
          <button class="project__actions_remove" title="Vocation">Delete</button>
        </td>
      </tr>
    `;
    return acc + temp;
  }, "");
  tBody.innerHTML = projects.length ? projects : emptyProjectsTemplate;
  document.querySelectorAll(`.project__actions_remove`)
    .forEach(btn=>btn.addEventListener("click", removePosition));
  render(RENDER_TYPES.DashboardInfo);
}
function showCapacityProgressLine(capacity) {
  return 0;
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
  document.querySelectorAll(`.employee__actions_remove`)
    .forEach(btn=>btn.addEventListener("click", removePosition));
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
function removePosition(e) {
  const typeClass = e.target.classList.value.split("__")[0];
  const parentElementId = e.target.closest(`.${typeClass}__position`).id;
  const dataModal = {
    title: "Delete",
    body: {
      text: 'Delete the Phoenix Portal project ? All assignments will be removed.',
      strongText: 'Phoenix Portal'
    },
    buttons: [
      {
        id: 'md-cancel',
        btnColor: MODAL_BUTTONS_COLOR.Gray,
        btnName: 'Cancel',
      },
      {
        id: 'md-rem',
        btnColor: MODAL_BUTTONS_COLOR.Red,
        btnName: 'Remove',
        fn: () => {
          saveState({[typeClass+'s']: state[typeClass+'s'].filter(item => item.id !== parentElementId)});
          render(RENDER_TYPES[typeClass+'s']);
        }
      }
    ]
  }
  openModal(parentElementId, dataModal);

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
    getProjects();
  }
  if (section === RENDER_TYPES.Employees || section === RENDER_TYPES.All) {
    getEmployees();
  }
  if (section === RENDER_TYPES.DashboardInfo || section === RENDER_TYPES.All) {
    updateDashboardInfo();
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

