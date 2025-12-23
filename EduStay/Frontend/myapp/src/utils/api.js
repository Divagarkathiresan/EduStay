import { API_BASE_URL } from "../config";

// --------------------------
// REGISTER
// --------------------------
export const RegisterUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const text = await response.text();
        try {
            const json = JSON.parse(text);
            throw new Error(Object.values(json).join("\n"));
        } catch {
            throw new Error(text || "Registration failed");
        }
    }

    return await response.json();
};

// --------------------------
// LOGIN
// --------------------------
export const LoginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        try {
            const data = await response.json();
            throw new Error(data.error || "Login failed");
        } catch {
            throw new Error(`Server error: ${response.status}`);
        }
    }

    const data = await response.json();
    return data.token || null;
};

// --------------------------
// GET ALL USERS
// --------------------------
export const getAllUsers = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch users");

    return await response.json();
};

// --------------------------
// SEARCH PROPERTIES
// --------------------------
export const getPropertiesAsPerLocations = async (
    district,
    minPrice,
    maxPrice,
    type
) => {
    const token = localStorage.getItem("token");

    const params = new URLSearchParams();
    if (district) params.append("district", district);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (type) params.append("type", type);

    const res = await fetch(
        `${API_BASE_URL}/edustay/properties/search?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) throw new Error("Failed to fetch properties");

    return await res.json();
};

// --------------------------
// GET ALL PROPERTIES
// --------------------------
export const getAllProperties = async () => {
    // const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/edustay/properties`, {
        // headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch properties");

    return await res.json();
};

// --------------------------
// GET PROPERTY BY ID
// --------------------------
export const fetchOwner = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/edustay/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch property");
    return await res.json();
};

// --------------------------
// UPDATE PROFILE
// --------------------------
export const updateProfile = async (profileData) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/api/auth/users/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
    });

    if (!res.ok) throw new Error("Failed to update profile");

    return await res.json();
};

// --------------------------
// EXPORT API
// --------------------------
export const api = {
    login: LoginUser,
    register: RegisterUser,
    getAllProperties,
    searchProperties: getPropertiesAsPerLocations,
    getPropertyById: fetchOwner,
    updateProfile,
    getProfile: async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/auth/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
    },
};
