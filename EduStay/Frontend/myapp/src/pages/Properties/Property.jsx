// pages/Properties/Property.jsx
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
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080${src}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const blob = await response.blob();
                    setImageSrc(URL.createObjectURL(blob));
                } else {
                    setError(true);
                }
            } catch {
                setError(true);
            }
        };

        if (src) fetchImage();
    }, [src]);

    if (error) return <div className="no-image-placeholder"><span>Image Not Available</span></div>;
    return imageSrc ? <img src={imageSrc} alt={alt} /> : <div>Loading...</div>;
};

const ImageGallery = ({ imageUrls, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    let images = [];
    try {
        images = JSON.parse(imageUrls || "[]");
    } catch {
        images = [];
    }

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
    const { district } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleWhatsAppContact = (property) => {
        const phoneNumber = property.owner?.phone || "1234567890";
        const message = `Hi! I am interested in your property "${property.title}" located at ${property.areaName}, ${property.district}, ${property.state}. Rent is ₹${property.rent}. Please provide more details.`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                // Read query params (min/max are required in your UI)
                const minPrice = searchParams.get("minPrice");
                const maxPrice = searchParams.get("maxPrice");
                const type = searchParams.get("type") || "";

                // Call API with all params
                const response = await getPropertiesAsPerLocations(district, minPrice, maxPrice, type);
                console.log("Properties response:", response);
                setProperties(response || []);

                // Additional client-side filtering (defensive; server should have filtered)
                let filtered = response || [];

                // Price filtering — because min/max required in UI, parse them
                const min = minPrice ? parseInt(minPrice, 10) : 0;
                const max = maxPrice ? parseInt(maxPrice, 10) : Infinity;

                filtered = filtered.filter(p => {
                    const rent = Number(p.rent || 0);
                    return rent >= min && rent <= max;
                });

                // Type filtering (case-insensitive)
                if (type && type.trim() !== "") {
                    const t = type.toLowerCase();
                    filtered = filtered.filter(p => (p.propertyType || "").toLowerCase() === t);
                }

                setFilteredProperties(filtered);
            } catch (error) {
                console.error("Failed to fetch properties:", error);
                setFilteredProperties([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [district, searchParams, navigate]);

    if (loading) {
        return (
            <div className="property-container">
                <div className="property-header">
                    <h1>Properties in {district}</h1>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="property-container">
            <div className="property-header">
                <h1>Properties in {district}</h1>
                <p>{filteredProperties.length} properties found</p>
            </div>

            <div className="properties-section">
                <div className="container">
                    {filteredProperties.length === 0 ? (
                        <div className="no-properties">
                            <h3>No properties found in {district}</h3>
                            <p>Try searching with different filters</p>
                        </div>
                    ) : (
                        <div className="properties-grid">
                            {filteredProperties.map((property, index) => (
                                <div key={index} className="property-card">
                                    <div className="property-images">
                                        <ImageGallery imageUrls={property.imageUrls} title={property.title} />
                                    </div>

                                    <div className="property-content">
                                        <h3>{property.title}</h3>

                                        <p><strong>Type:</strong> {property.propertyType}</p>

                                        <p>
                                            <strong>Location:</strong>
                                            {property.areaName}, {property.district}, {property.state} - {property.pincode}
                                        </p>

                                        <p><strong>Price:</strong> ₹{property.rent}/month</p>

                                        <p><strong>Description:</strong> {property.description}</p>

                                        {property.amenities && (
                                            <p><strong>Amenities:</strong> {property.amenities}</p>
                                        )}

                                        <div className="property-actions">
                                            <button className="view-btn" onClick={() => handleWhatsAppContact(property)}>
                                                Contact Owner
                                            </button>

                                            <Link to={`/contact-owner/${property.owner?.id}`}>
                                                <button className="contact-btn">Owner Details</button>
                                            </Link>
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
