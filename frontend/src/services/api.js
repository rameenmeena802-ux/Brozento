const API_URL = 'http://localhost:5000/api';

// Backend se products fetch karein
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Backend se settings fetch karein
export const getSettings = async () => {
  try {
    const response = await fetch(`${API_URL}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {};
  }
};