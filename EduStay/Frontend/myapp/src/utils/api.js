//utils/api.js

// --------------------------
// REGISTER
// --------------------------
export const RegisterUser = async (userData) => {
    const response = await fetch("http://localhost:8080/api/auth/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const text = await response.text();

        try {
            const json = JSON.parse(text);
            const messages = Object.values(json).join("\n");
            throw new Error(messages);
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
    try {
        const response = await fetch("http://localhost:8080/api/auth/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            let errorMessage = "Login failed";
            try {
                const data = await response.json();
                errorMessage = data.error || errorMessage;
            } catch {
                errorMessage = `Server error: ${response.status}`;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data.token || null;

    } catch (error) {
        console.error("Login error:", error.message);
        throw error;
    }
};


// --------------------------
// GET ALL USERS (NEEDS TOKEN)
// --------------------------
export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/auth/users", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("failed to fetch users");
        }

        return await response.json();
    } catch (error) {
        throw new Error("failed to fetch users");
    }
};


// --------------------------
// SEARCH PROPERTIES (NEEDS TOKEN)
// --------------------------
// utils/api.js
// (keep your other exports as-is; replace or add this function)

export const getPropertiesAsPerLocations = async (district, minPrice, maxPrice, type) => {
    try {
        const token = localStorage.getItem("token");

        const params = new URLSearchParams();
        if (district) params.append("district", district);
        if (minPrice !== undefined && minPrice !== null) params.append("minPrice", minPrice);
        if (maxPrice !== undefined && maxPrice !== null) params.append("maxPrice", maxPrice);
        if (type) params.append("type", type);

        const response = await fetch(
            `http://localhost:8080/edustay/properties/search?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch properties: " + response.status);
        }

        return await response.json();
    } catch (error) {
        console.error("Properties fetch error:", error);
        throw error;
    }
};



// --------------------------
// GET ALL PROPERTIES (NEEDS TOKEN)
// --------------------------
export const getAllProperties = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/edustay/properties", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch properties: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Properties fetch error:", error);
        throw error;
    }
};


// --------------------------
// UPDATE PROFILE (NEEDS TOKEN)
// --------------------------
export const updateProfile = async (profileData) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/api/auth/users/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });

        if (!response.ok) {
            throw new Error("Failed to update profile");
        }

        return await response.json();
    } catch (error) {
        throw new Error("Failed to update profile");
    }
};


// --------------------------
// ADD PROPERTY (NEEDS TOKEN)
// --------------------------
export const addProperty = async (propertyData) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/edustay/properties", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: propertyData
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to add property");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};


// --------------------------
// GET PROPERTY BY ID (NEEDS TOKEN)
// --------------------------
export const fetchOwner = async (id) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8080/edustay/properties/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch property");
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch property:", error);
        throw error;
    }
};


// --------------------------
// API EXPORTS
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
        const response = await fetch("http://localhost:8080/api/auth/users/profile", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response.json();
    }
};
