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
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response=await fetch(`http://localhost:8080/edustay/properties/search?location=${encodeURIComponent(location)}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if(!response.ok){
      throw new Error(`Failed to fetch properties: ${response.status}`);
    }
    const data=await response.json();
    return data;
  } catch (error) {
    console.error("Properties fetch error:", error);
    throw error;
  }
}

export const getAllProperties = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch('http://localhost:8080/edustay/properties', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Properties fetch error:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('http://localhost:8080/api/auth/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to update profile');
  }
}

export const addProperty = async (propertyData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('http://localhost:8080/edustay/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(propertyData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to add property');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchOwner = async (id) =>{
  try{
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`http://localhost:8080/edustay/properties/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch owner');
      }
      const data=await response.json();
      return data;
  }
  catch(error){
      console.error("Failed to fetch owner:", error);
      throw error;
  }
}

export const getOwnerProperties = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Get user profile to get owner ID
    const profileResponse = await fetch('http://localhost:8080/api/auth/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!profileResponse.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    const profile = await profileResponse.json();
    console.log('User profile:', profile);
    
    // Get all properties and filter by owner
    const allProperties = await getAllProperties();
    console.log('All properties:', allProperties);
    
    const ownerProperties = allProperties.filter(property => {
      console.log('Checking property:', property, 'against user ID:', profile.id);
      return property.ownerId === profile.id || 
             property.userId === profile.id ||
             property.owner?.id === profile.id ||
             property.user?.id === profile.id;
    });
    
    console.log('Owner properties:', ownerProperties);
    return ownerProperties;
  } catch (error) {
    console.error('Failed to fetch owner properties:', error);
    throw error;
  }
};

export const updateProperty = async (propertyId, propertyData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`http://localhost:8080/edustay/properties/${propertyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(propertyData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update property');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to update property:', error);
    throw error;
  }
};

export const deleteProperty = async (propertyId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`http://localhost:8080/edustay/properties/${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete property');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete property:', error);
    throw error;
  }
};

