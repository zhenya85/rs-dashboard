import {JOB_POSITIONS} from "./variables.js";

const addProject = {
  id: "new-project",
  title: "New project",
  fields: [
    {
      label: "Project Name *",
      fieldType: "text",
      inputId: "pnId",
      placeholder: "Name",
      vFieldID: "pnValidId",
      limitText: 5
    },
    {
      label: "Company *",
      fieldType: "text",
      inputId: "companyId",
      placeholder: "Company",
      vFieldID: "companyValidId",
      limitText: 3
    },
    {
      label: "Budget *",
      fieldType: "number",
      stepNumber: 0.01,
      inputId: "budgetId",
      placeholder: "0.00",
      vFieldID: "bdValidId",
    },
    {
      label: "Capacity (rates) *",
      fieldType: "number",
      stepNumber: 1,
      inputId: "capId",
      placeholder: "1",
      vFieldID: "capValidId",
    },
  ],
  addBtnId: "addProjectBtn",
}
const addEmployee = {
  id: "new-employee",
  title: "New employee",
  fields: [
    {
      label: "Name *",
      fieldType: "text",
      inputId: "nameId",
      placeholder: "Name",
      vFieldID: "nameValidId",
      limitText: 3
    },
    {
      label: "Surname *",
      fieldType: "text",
      inputId: "surnameId",
      placeholder: "Surname",
      vFieldID: "surnameValidId",
      limitText: 3
    },
    {
      label: "Date of birth *",
      fieldType: "date",
      inputId: "budgetId",
      limitYear: 18,
      placeholder: "",
      vFieldID: "budgetValidId",
    },
    {
      label: "Job title *",
      fieldType: "select",
      selectOptions: ["Select...", ...JOB_POSITIONS],
      inputId: "jobId",
      placeholder: "",
      vFieldID: "jobValidId",
    },
    {
      label: "Salary *",
      fieldType: "number",
      inputId: "salaryId",
      placeholder: "0.00",
      vFieldID: "salaryValidId",
    },
  ],
  addBtnId: "addEmployeeBtn",
}

export {addProject, addEmployee};