
import { fetchEmployees } from "./js/api.js";
import { displayEmployees } from "./js/employees.js";
import {
  getSavedEmployees,
  saveEmployees
} from "./js/storage.js";

let allEmployees = [];

async function initApp() {
  const employeeList = document.getElementById("employee-list");

  try {
    employeeList.innerHTML = "<p>Loading employees...</p>";

    // Load saved employees first
    allEmployees = getSavedEmployees();

    // Fetch from API only if no saved employees exist
    if (allEmployees.length === 0) {
      allEmployees = await fetchEmployees();
      saveEmployees(allEmployees);
    }

    const departments = [
      ...new Set(allEmployees.map(employee => employee.department))
    ];

    const departmentFilter = document.getElementById("department-filter");

    departments.forEach(department => {
      const option = document.createElement("option");
      option.value = department;
      option.textContent = department;
      departmentFilter.appendChild(option);
    });

    displayEmployees(allEmployees);

    document.getElementById("search-input")
      .addEventListener("input", filterEmployees);

    departmentFilter.addEventListener("change", filterEmployees);

    document.getElementById("sort-select")
      .addEventListener("change", filterEmployees);

  } catch (error) {
    employeeList.innerHTML =
      "<p>Unable to load employees. Please refresh the page.</p>";
  }
}

function filterEmployees() {
  const search = document.getElementById("search-input").value.toLowerCase();
  const department = document.getElementById("department-filter").value;
  const sort = document.getElementById("sort-select").value;

  let filtered = allEmployees.filter(employee => {
    return employee.name.toLowerCase().includes(search) &&
      (department === "all" || employee.department === department);
  });

  filtered.sort((a, b) =>
    sort === "name-asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  displayEmployees(filtered);
}

initApp();
