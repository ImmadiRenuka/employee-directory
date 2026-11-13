
const API_URL = "https://randomuser.me/api/?results=20";

export async function fetchEmployees() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch employee data");
    }

    const data = await response.json();

    return data.results.map((user, index) => ({
      id: user.login.uuid,
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      phone: user.phone,
      picture: user.picture.large,
      location: `${user.location.city}, ${user.location.country}`,
      department: ["Engineering", "HR", "Marketing", "Finance"][index % 4]
    }));

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
