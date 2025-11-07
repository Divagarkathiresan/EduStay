import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOwnerProperties, updateProperty, deleteProperty } from '../../utils/api';
import { showSuccess, showError, showWarning } from '../../utils/toast';
import './PropertyManagement.css';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/auth/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setUserRole(data.role);
      
      if (data.role === 'houseOwner') {
        fetchOwnerProperties();
      } else {
        showError('Only house owners can access this page');
        navigate('/');
      }
    } catch (error) {
      navigate('/login');
    }
  };

  const fetchOwnerProperties = async () => {
    try {
      console.log('Fetching owner properties...');
      const data = await getOwnerProperties();
      console.log('Received properties:', data);
      setProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      showError('Failed to fetch properties: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty({ ...property });
    setNewImages([]);
    setNewImagePreviews([]);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (newImages.length > 0) {
        // Delete old property and create new one with updated images
        await deleteProperty(editingProperty.id);
        
        const formData = new FormData();
        formData.append('title', editingProperty.title);
        formData.append('location', editingProperty.location);
        formData.append('rent', editingProperty.rent);
        formData.append('description', editingProperty.description);
        formData.append('amenities', editingProperty.amenities);
        newImages.forEach(image => {
          formData.append('images', image);
        });
        
        const response = await fetch('http://localhost:8080/edustay/properties', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to update property with new images');
        }
      } else {
        // Update without images using PATCH or available method
        const response = await fetch(`http://localhost:8080/edustay/properties/${editingProperty.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: editingProperty.title,
            location: editingProperty.location,
            rent: editingProperty.rent,
            description: editingProperty.description,
            amenities: editingProperty.amenities
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update property details');
        }
      }
      
      setEditingProperty(null);
      setNewImages([]);
      setNewImagePreviews([]);
      fetchOwnerProperties();
      showSuccess('Property updated successfully!');
    } catch (error) {
      showError('Failed to update property: ' + error.message);
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty(propertyId);
        fetchOwnerProperties();
        showSuccess('Property deleted successfully!');
      } catch (error) {
        showError('Failed to delete property: ' + error.message);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditingProperty(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      showWarning('Maximum 10 images allowed');
      return;
    }
    
    setNewImages(files);
    
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setNewImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    const updatedPreviews = newImagePreviews.filter((_, i) => i !== index);
    setNewImages(updatedImages);
    setNewImagePreviews(updatedPreviews);
  };

  if (userRole !== 'houseOwner') {
    return <div className="loading">Loading...</div>;
  }

  if (loading) return <div className="loading">Loading your properties...</div>;

  return (
    <div className="property-management">
      <div className="management-header">
        <h1>Manage Your Properties</h1>
        <button 
          className="add-property-btn"
          onClick={() => navigate('/add-property')}
        >
          Add New Property
        </button>
      </div>
      
      {properties.length === 0 ? (
        <div className="no-properties">
          <p>You haven't added any properties yet.</p>
          <button 
            className="add-first-property-btn"
            onClick={() => navigate('/add-property')}
          >
            Add Your First Property
          </button>
        </div>
      ) : (
        <div className="properties-list">
          {properties.map(property => (
            <div key={property.id} className="property-item">
              {property.images && property.images.length > 0 && (
                <div className="property-image">
                  <img 
                    src={`http://localhost:8080/edustay/properties/images/${property.images[0]}`} 
                    alt={property.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="property-info">
                <h3>{property.title}</h3>
                <p><strong>Location:</strong> {property.location}</p>
                <p><strong>Rent:</strong> ₹{property.rent}/month</p>
                <p><strong>Description:</strong> {property.description}</p>
                <p><strong>Amenities:</strong> {property.amenities}</p>
                {property.images && property.images.length > 1 && (
                  <p><strong>Images:</strong> {property.images.length} photos</p>
                )}
              </div>
              <div className="property-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(property)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(property.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingProperty && (
        <div className="edit-modal">
          <div className="modal-content">
            <h2>Edit Property</h2>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={editingProperty.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                value={editingProperty.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Rent:</label>
              <input
                type="number"
                value={editingProperty.rent}
                onChange={(e) => handleInputChange('rent', parseFloat(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={editingProperty.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Amenities:</label>
              <input
                type="text"
                value={editingProperty.amenities}
                onChange={(e) => handleInputChange('amenities', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Update Images (Optional):</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="file-input"
              />
              {newImagePreviews.length > 0 && (
                <div className="images-preview">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview">
                      <img src={preview} alt={`New Preview ${index + 1}`} />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={() => removeNewImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="save-btn" onClick={handleUpdate}>
                Save Changes
              </button>
              <button className="cancel-btn" onClick={() => setEditingProperty(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;