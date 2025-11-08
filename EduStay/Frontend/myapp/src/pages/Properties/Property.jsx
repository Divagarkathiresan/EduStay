import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getPropertiesAsPerLocations } from "../../utils/api";
import { Link } from "react-router-dom";
import "./Property.css";

const AuthenticatedImage = ({ src, alt }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080${src}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const blob = await response.blob();
                    setImageSrc(URL.createObjectURL(blob));
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            }
        };
        if (src) fetchImage();
    }, [src]);

    if (error) {
        return <div className="no-image-placeholder"><span>Image Not Available</span></div>;
    }

    return imageSrc ? <img src={imageSrc} alt={alt} /> : <div>Loading...</div>;
};

const ImageGallery = ({ imageUrls, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = JSON.parse(imageUrls || '[]');

    if (images.length === 0) {
        return <div className="no-image-placeholder"><span>No Images Available</span></div>;
    }

    return (
        <div className="image-gallery">
            <AuthenticatedImage src={images[currentIndex]} alt={title} />
            {images.length > 1 && (
                <div className="image-nav">
                    <button onClick={() => setCurrentIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}>‹</button>
                    <span>{currentIndex + 1} / {images.length}</span>
                    <button onClick={() => setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}>›</button>
                </div>
            )}
        </div>
    );
};

export default function Property() {
    const { location } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);

    const handleWhatsAppContact = (property) => {
        const phoneNumber = property.ownerPhone || property.owner.phone || '1234567890';
        const message = `Hi! I am interested in your property "${property.title || 'Property'}" in ${property.location || location}. The rent is ₹${property.rent || '15,000'}/month. Could you please provide more details?`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                
                const response = await getPropertiesAsPerLocations(location);
                console.log('Properties response:', response);
                setProperties(response);
                
                const minPrice = searchParams.get('minPrice');
                const maxPrice = searchParams.get('maxPrice');
                
                let filtered = response;
                if (minPrice || maxPrice) {
                    filtered = response.filter(property => {
                        const rent = property.rent || 15000;
                        const min = minPrice ? parseInt(minPrice) : 0;
                        const max = maxPrice ? parseInt(maxPrice) : Infinity;
                        return rent >= min && rent <= max;
                    });
                }
                setFilteredProperties(filtered);
            } catch (error) {
                console.error("Failed to fetch properties:", error);
            }
        })();
    }, [location, searchParams, navigate]);
    return (
        <div className="property-container">
            <div className="property-header">
                <h1>Properties in {location}</h1>
                <p>{filteredProperties.length} properties found</p>
            </div>

            <div className="properties-section">
                <div className="container">
                    {filteredProperties.length === 0 ? (
                        <div className="no-properties">
                            <h3>No properties found in {location}</h3>
                            <p>Try searching for a different location</p>
                        </div>
                    ) : (
                        <div className="properties-grid">
                            {filteredProperties.map((property, index) => (
                                <div key={index} className="property-card">
                                    <div className="property-images">
                                        {property.imageUrls ? (
                                            <ImageGallery imageUrls={property.imageUrls} title={property.title} />
                                        ) : (
                                            <div className="no-image-placeholder">
                                                <span>No Image Available</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="property-content">
                                        <h3>{property.title || `Property ${index + 1}`}</h3>
                                        <p><strong>Location:</strong> {property.location || location}</p>
                                        <p><strong>Price:</strong> ₹{property.rent || '15,000'}/month</p>
                                        <p><strong>Description:</strong> {property.description || 'Comfortable student accommodation with all amenities'}</p>
                                        {property.amenities && (
                                            <p><strong>Amenities:</strong> {property.amenities}</p>
                                        )}
                                        <div className="property-actions">
                                            <button className="view-btn" onClick={() => handleWhatsAppContact(property)}>Contact Owner</button>
                                            <Link to={`/contact-owner/${property.ownerId || property.id}`}><button className="contact-btn">Owner Details</button></Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}