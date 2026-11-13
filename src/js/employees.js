
import { getFavorites, saveFavorites } from "./storage.js";

export function displayEmployees(employees) {
  const employeeList = document.getElementById("employee-list");
  const employeeCount = document.getElementById("employee-count");

  const favorites = getFavorites();

  employeeCount.textContent = `${employees.length} employees found`;

  if (employees.length === 0) {
    employeeList.innerHTML = "<p>No employees found.</p>";
    return;
  }

  employeeList.innerHTML = employees.map(employee => {
    const isFavorite = favorites.includes(employee.id);

    return `
      <article class="employee-card">
        <button class="favorite-btn" data-id="${employee.id}"
          aria-label="${isFavorite ? "Remove from" : "Add to"} favorites">
          ${isFavorite ? "❤️" : "🤍"}
        </button>

        <img src="${employee.picture}" alt="${employee.name}" />
        <h3>${employee.name}</h3>
        <p>${employee.department}</p>
        <p>${employee.email}</p>
        <p>${employee.phone}</p>
        <p>${employee.location}</p>
      </article>
    `;
  }).join("");

  employeeList.querySelectorAll(".favorite-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      let updatedFavorites = getFavorites();

      if (updatedFavorites.includes(id)) {
        updatedFavorites = updatedFavorites.filter(item => item !== id);
      } else {
        updatedFavorites.push(id);
      }

      saveFavorites(updatedFavorites);
      displayEmployees(employees);
    });
  });
}
