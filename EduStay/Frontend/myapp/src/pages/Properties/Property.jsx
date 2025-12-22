import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { getPropertiesAsPerLocations } from "../../utils/api";
import { API_BASE_URL } from "../../config";
import "./Property.css";

/* 
===========================================
 CloudImage Component (Cloudinary Compatible)
===========================================
*/
const CloudImage = ({ src, alt }) => {
    if (!src) {
        return (
            <div className="no-image-placeholder">
                <span>No Image Available</span>
            </div>
        );
    }

    return <img src={src} alt={alt} />;
};

/* 
===========================================
 ImageGallery (uses Cloudinary URLs directly)
===========================================
*/
const ImageGallery = ({ imageUrls, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    let images = [];
    try {
        images = JSON.parse(imageUrls || "[]");
    } catch {
        images = [];
    }

    if (images.length === 0) {
        return (
            <div className="no-image-placeholder">
                <span>No Images Available</span>
            </div>
        );
    }

    return (
        <div className="image-gallery">
            {/* Display Cloudinary Image */}
            <CloudImage src={images[currentIndex]} alt={title} />

            {images.length > 1 && (
                <div className="image-nav">
                    <button
                        onClick={() =>
                            setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))
                        }
                    >
                        ‹
                    </button>

                    <span>{currentIndex + 1} / {images.length}</span>

                    <button
                        onClick={() =>
                            setCurrentIndex(prev =>
                                prev < images.length - 1 ? prev + 1 : 0
                            )
                        }
                    >
                        ›
                    </button>
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
        const message = `Hi! I am interested in your property "${property.title}" located at ${property.areaName}, ${property.district}, ${property.state}. Rent is ₹${property.rent}.`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return navigate("/login");

                const minPrice = searchParams.get("minPrice");
                const maxPrice = searchParams.get("maxPrice");
                const type = searchParams.get("type") || "";

                const response = await getPropertiesAsPerLocations(
                    district, minPrice, maxPrice, type
                );

                setProperties(response || []);

                let filtered = [...(response || [])];

                const min = minPrice ? parseInt(minPrice, 10) : 0;
                const max = maxPrice ? parseInt(maxPrice, 10) : Infinity;

                filtered = filtered.filter(p => {
                    const rent = Number(p.rent || 0);
                    return rent >= min && rent <= max;
                });

                if (type.trim() !== "") {
                    const t = type.toLowerCase();
                    filtered = filtered.filter(p =>
                        (p.propertyType || "").toLowerCase() === t
                    );
                }

                setFilteredProperties(filtered);
            } catch (err) {
                console.error("Failed to fetch properties:", err);
                setFilteredProperties([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [district, searchParams, navigate]);

    if (loading) {
        return (
            <div className="property-container">
                <h1>Properties in {district}</h1>
                <p>Loading...</p>
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
                        </div>
                    ) : (
                        <div className="properties-grid">
                            {filteredProperties.map((property, index) => (
                                <div key={index} className="property-card">

                                    {/* Image Gallery Section */}
                                    <div className="property-images">
                                        <ImageGallery
                                            imageUrls={property.imageUrls}
                                            title={property.title}
                                        />
                                    </div>

                                    {/* Property Content Section */}
                                    <div className="property-content">
                                        <h3>{property.title}</h3>
                                        <p><strong>Type:</strong> {property.propertyType}</p>
                                        <p><strong>Location:</strong> {property.areaName}, {property.district}, {property.state} - {property.pincode}</p>
                                        <p><strong>Price:</strong> ₹{property.rent}/month</p>
                                        <p><strong>Description:</strong> {property.description}</p>

                                        {property.amenities && (
                                            <p><strong>Amenities:</strong> {property.amenities}</p>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="property-actions">
                                            <button
                                                className="contact-btn"
                                                onClick={() => handleWhatsAppContact(property)}
                                            >
                                                Contact Owner
                                            </button>

                                            <Link to={`/contact-owner/${property.id}`}>
                                                <button className="view-btn">Owner Details</button>
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
