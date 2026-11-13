
const FAVORITES_KEY = "employeeFavorites";
const EMPLOYEES_KEY = "employees";

export function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

export function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function getSavedEmployees() {
  return JSON.parse(localStorage.getItem(EMPLOYEES_KEY)) || [];
}

export function saveEmployees(employees) {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
}
