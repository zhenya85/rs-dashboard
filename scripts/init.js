import * as VARIABLES from "./variables.js";
import {formatPrice, getAge, getEstimatedPayment, getMonth, openModal} from './other-functions.js';

/**************** TODO: SET START PAGE **********/
window.addEventListener('load', () => {
  updateLSState({openPage: VARIABLES.TYPE_OF_WINDOW.Projects});
  render();
});

function updateLSState(data) {
  localStorage.setItem("state", JSON.stringify({
    ...JSON.parse(localStorage.getItem("state")),
    ...data
  }))
}

/*********** TODO: CONSTANTS **************/
let state = {};


/*********** TODO: INIT MENU BAR **********/
const pMonth = document.getElementById("p-month");
const pYear = document.getElementById("p-year");
const realYear = new Date().getFullYear();
const realMonth = new Date().getMonth();
pMonth.insertAdjacentHTML("beforeend", VARIABLES.months.reduce((acc, month, ind) => {
  return acc + `<option value="${ind}" ${ind === realMonth ? 'selected' : ''}>${month}</option>`;
}, ''));
pYear.insertAdjacentHTML("beforeend", VARIABLES.years.reduce((acc, year) => {
  return acc + `<option value="${year}" ${year === realYear ? 'selected' : ''}>${year}</option>`;
}, ''));
/************* TODO: INIT STATE ************/
if (!localStorage.getItem("state")) {
  saveState({
    selectedMonth: VARIABLES.months[realMonth],
    selectedYear: realYear,
    openPage: VARIABLES.TYPE_OF_WINDOW.Projects,
    filters: {
      projects: {},
      employees: {}
    },
    data: []
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
  const allBudget = document.getElementById("dashboard-all-projects-budget");
  const allEmployees = document.getElementById("dashboard-employees");
  const fot = document.getElementById("dashboard-fot");
  const estimateIncome = document.getElementById("dashboard-estimate-income");
  const panelInfoProjects = document.getElementById("panel-info-projects");
  const panelInfoEmployees = document.getElementById("panel-info-employees");
  const realStateData = state.data[`${state.selectedYear}-${getMonth(state.selectedMonth)}`];
  allProjects.innerHTML = realStateData?.projects?.length || 0;
  panelInfoProjects.innerText = realStateData?.projects?.length || 0;
  if (realStateData?.projects?.length) {
    allBudget.innerHTML = formatPrice(realStateData?.projects.reduce((summ, project) => {
      return summ + Number(project.budget);
    }, 0));
  } else {
    allBudget.innerHTML = formatPrice(0);
  }
  allEmployees.innerHTML = realStateData?.employees?.length || 0;
  panelInfoEmployees.innerText = realStateData?.employees?.length || 0;
  fot.innerHTML = formatPrice(0);
  estimateIncome.innerHTML = formatPrice(0);
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

/************ TODO: OPERATIONS WITH STATE **************/
function saveState(data) {
  localStorage.setItem("state", JSON.stringify({
    ...state,
    ...data
  }));
  state = loadState();
}


function loadState() {
  let stateStr = localStorage.getItem("state");
  return ({
    ...(!!stateStr ? JSON.parse(stateStr) : {}),
  })
}

/************* TODO: PROJECTS DASHBOARD *****************/
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
  const projects = state?.data?.find(itemDate => itemDate === `${state.selectedYear}-${getMonth(state.selectedMonth)}`)
    ?.projects?.reduce((acc, projectItem) => {
      const {id, project, company, budget, capacity} = projectItem;
      let temp = `
      <tr id="${id}" class="project__position">
        <td class="project__company">${company}</td>
        <td class="project__name">${project}</td>
        <td class="project__budget">${formatPrice(budget)}</td>
        <td class="project__capacity">
          <div>${formatPrice(0, "")}/${capacity}</div>
          <div class="progress">
            <div id="project-progress-line" class="p-line" style="width: ${showCapacityProgressLine(capacity)}%"></div>
          </div>
        </td>
        <td class="project__employees">
          <button class="project__employees-btn">Show (${0})</button>
        </td>
        <td class="project__income">${formatPrice(0)}</td>
        <td class="project__actions">
          <button id="project__actions_remove" class="project__actions_remove" title="Vocation">Delete</button>
        </td>
      </tr>
    `;
      return acc + temp;
    }, "");
  tBody.innerHTML = projects?.length ? projects : emptyProjectsTemplate;
  document.querySelectorAll(`.project__actions_remove`)
    .forEach(btn => {
      removeProjectPosition(btn)
    });
  render(VARIABLES.RENDER_TYPES.DashboardInfo);
}

function showCapacityProgressLine(capacity) {
  return 0;
}

function removeProjectPosition(currentElement) {
  const typeClass = "project";
  const parentElementId = currentElement.closest(`.project__position`);
  const projectName = parentElementId.querySelector('.project__name');
  const dataModal = {
    title: "Delete",
    body: {
      text: `Delete the ${projectName.innerText} ${typeClass}? All assignments will be removed.`,
      strongText: projectName.innerText
    },
    buttons: [
      {
        id: 'md-cancel',
        btnColor: VARIABLES.MODAL_BUTTONS_COLOR.Gray,
        btnName: 'Cancel',
      },
      {
        id: 'md-rem',
        btnColor: VARIABLES.MODAL_BUTTONS_COLOR.Red,
        btnName: 'Remove',
        fn: () => {
          saveState({
            [typeClass + 's']: state[typeClass + 's'].filter(item => item.id !== parentElementId.id)
          });
          render(VARIABLES.RENDER_TYPES[typeClass + 's']);
        }
      }
    ]
  }
  openModal(currentElement, dataModal);

}

/************* TODO: EMPLOYEES DASHBOARD *****************/
function getEmployees() {
  loadState();
  const realStateData = state.data[`${state.selectedYear}-${getMonth(state.selectedMonth)}`];
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
  const employees = realStateData?.employees.reduce((acc, employee) => {
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
  tBody.innerHTML = employees?.length ? employees : emptyEmployeesTemplate;
  document.querySelectorAll(`.employee__actions_remove`)
    .forEach(btn => removeEmployeePosition(btn));
  tBody.querySelectorAll('.employee__position')
    .forEach(employee => {
      employee.querySelector('.employee-job-selection').addEventListener('change', changeSelectStatus);
    });
}

function addJobSelection(selectedJob) {
  let template = `<select class="employee-job-selection">`;
  template += VARIABLES.JOB_POSITIONS.reduce((acc, job) => {
    acc += `<option value="${job}" ${job === selectedJob ? 'selected' : ''}>${job}</option>`;
    return acc;
  }, '');
  template += '</select>';
  return template;
}

function changeSelectStatus(e) {
  const mainSection = e.target.closest('.dashboard__wrapper');
  const parentEmployee = e.target.closest('.employee__position');
  saveState({
    [mainSection.dataset.type]: state[mainSection.dataset.type].map(emp => {
      if (emp.id === parentEmployee.id) {
        return {...emp, job: e.target.value}
      }
      return emp;
    })
  });
}

function removeEmployeePosition(currentElement) {
  const typeClass = currentElement.classList.value.split("__")[0];
  const parentElementId = currentElement.closest(`.${typeClass}__position`);
  const empoloyeeName = parentElementId.querySelector('.employee__name');
  const dataModal = {
    title: "Delete",
    body: {
      text: `Delete the ${empoloyeeName.innerText} ${typeClass}? All assignments will be removed.`,
      strongText: empoloyeeName.innerText
    },
    buttons: [
      {
        id: 'md-cancel',
        btnColor: VARIABLES.MODAL_BUTTONS_COLOR.Gray,
        btnName: 'Cancel',
      },
      {
        id: 'md-rem',
        btnColor: VARIABLES.MODAL_BUTTONS_COLOR.Red,
        btnName: 'Remove',
        fn: () => {
          saveState({
            [typeClass + 's']: state[typeClass + 's'].filter(item => item.id !== parentElementId.id)
          });
          render(VARIABLES.RENDER_TYPES[typeClass + 's']);
        }
      }
    ]
  }
  // openModal(typeClass + '__actions_remove', dataModal);
  openModal(currentElement, dataModal);

}


/*********** TODO: RENDER ***********/
function render(section = VARIABLES.RENDER_TYPES.All) {
  state = {
    ...state,
    ...loadState()
  };
  if (section === VARIABLES.RENDER_TYPES.Header || section === VARIABLES.RENDER_TYPES.All) {
    updateHeader();
  }
  if (section === VARIABLES.RENDER_TYPES.OpenPage || section === VARIABLES.RENDER_TYPES.All) {
    openPage();
  }
  if (section === VARIABLES.RENDER_TYPES.Projects || section === VARIABLES.RENDER_TYPES.All) {
    getProjects();
  }
  if (section === VARIABLES.RENDER_TYPES.Employees || section === VARIABLES.RENDER_TYPES.All) {
    getEmployees();
  }
  if (section === VARIABLES.RENDER_TYPES.DashboardInfo || section === VARIABLES.RENDER_TYPES.All) {
    updateDashboardInfo();
  }

}

export {
  state,
  render,
  saveState
};

