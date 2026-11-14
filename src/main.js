
import { fetchEmployees } from "./js/api.js";
import { displayEmployees } from "./js/employees.js";
import {
  getSavedEmployees,
  saveEmployees
} from "./js/storage.js";

let allEmployees = [];
let showFavoritesOnly = false;

async function loadEmployees() {
  const employeeList = document.getElementById("employee-list");

  employeeList.innerHTML = '<div class="loader"></div><p>Loading employees...</p>';

  try {
    allEmployees = getSavedEmployees();

    if (allEmployees.length === 0) {
      allEmployees = await fetchEmployees();
      saveEmployees(allEmployees);
    }

    const departmentFilter = document.getElementById("department-filter");

    if (departmentFilter.options.length === 1) {
      const departments = [
        ...new Set(allEmployees.map(employee => employee.department))
      ];

      departments.forEach(department => {
        const option = document.createElement("option");
        option.value = department;
        option.textContent = department;
        departmentFilter.appendChild(option);
      });
    }

    displayEmployees(allEmployees);
  } catch (error) {
    employeeList.innerHTML = `
      <div class="error-message">
        <h3>Oops! Something went wrong.</h3>
        <p>Unable to load employees. Please check your internet connection.</p>
        <button id="retry-btn">Try Again</button>
      </div>
    `;

    document.getElementById("retry-btn")
      .addEventListener("click", loadEmployees);
  }
}

function filterEmployees() {
  const search = document.getElementById("search-input").value.toLowerCase();
  const department = document.getElementById("department-filter").value;
  const sort = document.getElementById("sort-select").value;

  const favorites = JSON.parse(
    localStorage.getItem("employeeFavorites")
  ) || [];

  let filtered = allEmployees.filter(employee => {
    const matchesName = employee.name.toLowerCase().includes(search);
    const matchesDepartment =
      department === "all" || employee.department === department;
    const matchesFavorite =
      !showFavoritesOnly || favorites.includes(employee.id);

    return matchesName && matchesDepartment && matchesFavorite;
  });

  filtered.sort((a, b) =>
    sort === "name-asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  displayEmployees(filtered);
}

function setupEvents() {
  document.getElementById("search-input")
    .addEventListener("input", filterEmployees);

  document.getElementById("department-filter")
    .addEventListener("change", filterEmployees);

  document.getElementById("sort-select")
    .addEventListener("change", filterEmployees);

  document.getElementById("favorites-toggle")
    .addEventListener("click", function () {
      showFavoritesOnly = !showFavoritesOnly;

      this.setAttribute("aria-pressed", showFavoritesOnly);
      this.textContent = showFavoritesOnly
        ? "❤️ Show All"
        : "❤️ Show Favorites";

      filterEmployees();
    });

  const themeButton = document.getElementById("theme-toggle");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeButton.textContent = "☀️";
  }

  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeButton.textContent = isDark ? "☀️" : "🌙";
  });
}

setupEvents();
loadEmployees();
