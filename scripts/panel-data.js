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
    },
    {
      label: "Company *",
      fieldType: "text",
      inputId: "companyId",
      placeholder: "Company",
      vFieldID: "companyValidId",
    },
    {
      label: "Budget *",
      fieldType: "number",
      inputId: "budgetId",
      placeholder: "0.00",
      vFieldID: "bdValidId",
    },
    {
      label: "Capacity (rates) *",
      fieldType: "number",
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
    },
    {
      label: "Surname *",
      fieldType: "text",
      inputId: "surnameId",
      placeholder: "Surname",
      vFieldID: "surnameValidId",
    },
    {
      label: "Date of birth *",
      fieldType: "date",
      inputId: "budgetId",
      placeholder: "",
      vFieldID: "budgetValidId",
    },
    {
      label: "Job title *",
      fieldType: "select",
      selectOptions: ["Select...", "Junior", "Middle", "Senior", "Lead", "Architect","BO"],
      inputId: "jobId",
      placeholder: "",
      vFieldID: "jobValidId",
    },
    {
      label: "Salary *",
      fieldType: "text",
      inputId: "salaryId",
      placeholder: "0.00",
      vFieldID: "salaryValidId",
    },
  ],
  addBtnId: "addEmployeeBtn",
}

export {addProject, addEmployee};