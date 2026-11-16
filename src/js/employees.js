
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
      <article class="employee-card" data-id="${employee.id}" tabindex="0"
        aria-label="View profile of ${employee.name}">
        
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

  // Favorite functionality
  employeeList.querySelectorAll(".favorite-btn").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();

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

  // Employee profile popup
  function openProfile(employee) {
    closeProfile();

    const modal = document.createElement("div");
    modal.className = "profile-modal";
    modal.id = "profile-modal";

    modal.innerHTML = `
      <div class="profile-content" role="dialog"
        aria-modal="true" aria-labelledby="profile-name">

        <button class="close-profile" aria-label="Close profile">&times;</button>

        <img src="${employee.picture}" alt="${employee.name}" />

        <h2 id="profile-name">${employee.name}</h2>
        <p class="profile-department">${employee.department}</p>

        <div class="profile-details">
          <p><strong>Email:</strong> ${employee.email}</p>
          <p><strong>Phone:</strong> ${employee.phone}</p>
          <p><strong>Location:</strong> ${employee.location}</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".close-profile").addEventListener("click", closeProfile);

    modal.addEventListener("click", event => {
      if (event.target === modal) closeProfile();
    });

    document.addEventListener("keydown", handleEscape);
    modal.querySelector(".close-profile").focus();
  }

  function closeProfile() {
    const modal = document.getElementById("profile-modal");

    if (modal) modal.remove();

    document.removeEventListener("keydown", handleEscape);
  }

  function handleEscape(event) {
    if (event.key === "Escape") closeProfile();
  }

  employeeList.querySelectorAll(".employee-card").forEach(card => {
    const showProfile = () => {
      const employee = employees.find(item => item.id === card.dataset.id);
      if (employee) openProfile(employee);
    };

    card.addEventListener("click", showProfile);

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showProfile();
      }
    });
  });
}

