export const RegisterUser = async (userData)=>{
    try {
            const response = await fetch("http://localhost:8080/api/auth/users/register",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });
            const data=await response.json();
            if(!response.ok){
                const message = data && (data.error || data.message) ? (data.error || data.message) : `Request failed with status ${response.status}`;
                throw new Error(message);
            }
    }
    catch (error) {
        console.log("error",error.message);
        throw error;
    }
};

export const LoginUser = async (credentials) => {
  try {
    const response = await fetch("http://localhost:8080/api/auth/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Login failed");
    }

    return data.token || null;

  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

export const getAllUsers=async(token)=>{
  try {
    const response = await fetch("http://localhost:8080/api/auth/users", {
      method: "GET"});
      if(!response.ok){
        throw new Error("failed to fetch users");
      }
      const data=await response.json();
      return data;
  } catch (error) {
    throw new Error("failed to fetch users");
  }
};

export const getPropertiesAsPerLocations=async(location)=>{
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response=await fetch(`http://localhost:8080/edustay/properties/search?location=${location}`, {
      headers: headers
    });
    
    if(!response.ok){
      throw new Error("failed to fetch properties");
    }
    const data=await response.json();
    return data;
  } catch (error) {
    throw new Error("failed to fetch properties");
  }
}