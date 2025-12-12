const API_URL = "http://localhost:5000";

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const getFood = async () => {
  const response = await fetch(`${API_URL}/food`);
  return response.json();
};

export const addFood = async (foodData, token) => {
  const response = await fetch(`${API_URL}/food`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(foodData),
  });
  return response.json();
};

export const updateFood = async (id, foodData, token) => {
  const response = await fetch(`${API_URL}/food/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(foodData),
  });
  return response.json();
};

export const deleteFood = async (id, token) => {
  const response = await fetch(`${API_URL}/food/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
