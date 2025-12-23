import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { getPropertiesAsPerLocations } from "../../utils/api";
import "./Property.css";

/* ===========================
   CloudImage Component
=========================== */
const CloudImage = ({ src, alt }) => {
    if (!src) {
        return (
            <div className="no-image-placeholder">
                <span>No Image Available</span>
            </div>
        );
    }
    return <img src={src} alt={alt} className="property-image" />;
};

/* ===========================
   Image Gallery
=========================== */
const ImageGallery = ({ imageUrls, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    let images = [];
    try {
        images = JSON.parse(imageUrls || "[]");
    } catch {
        images = [];
    }

    if (!Array.isArray(images) || images.length === 0) {
        return (
            <div className="no-image-placeholder">
                <span>No Images Available</span>
            </div>
        );
    }

    return (
        <div className="image-gallery">
            <CloudImage src={images[currentIndex]} alt={title} />

            {images.length > 1 && (
                <div className="image-nav">
                    <button
                        onClick={() =>
                            setCurrentIndex(prev =>
                                prev > 0 ? prev - 1 : images.length - 1
                            )
                        }
                    >
                        ‹
                    </button>

                    <span>
                        {currentIndex + 1} / {images.length}
                    </span>

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

/* ===========================
   Property Page
=========================== */
export default function Property() {
    const { district } = useParams();
    const [searchParams] = useSearchParams();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleWhatsAppContact = (property) => {
        const phoneNumber = property?.owner?.phone || "1234567890";
        const message = `Hi! I am interested in your property "${property?.title}". Rent is ₹${property?.rent}.`;
        window.open(
            `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    };

    useEffect(() => {
        (async () => {
            try {
                const minPrice = searchParams.get("minPrice");
                const maxPrice = searchParams.get("maxPrice");
                const type = searchParams.get("type") || "";

                const response = await getPropertiesAsPerLocations(
                    district,
                    minPrice,
                    maxPrice,
                    type
                );

                setProperties(response || []);
            } catch (error) {
                console.error("Error fetching properties:", error);
                setProperties([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [district, searchParams]);

    if (loading) {
        return (
            <div className="property-container">
                <h2>Loading properties...</h2>
            </div>
        );
    }

    return (
        <div className="property-container">
            <h1>Properties in {district}</h1>
            <p>{properties.length} properties found</p>

            <div className="properties-grid">
                {properties.length === 0 ? (
                    <h3>No properties found</h3>
                ) : (
                    properties.map((property, index) => (
                        <div key={index} className="property-card">

                            {/* IMAGE SECTION */}
                            <ImageGallery
                                imageUrls={property?.imageUrls}
                                title={property?.title}
                            />

                            {/* DETAILS SECTION */}
                            <div className="property-content">

                                <h2 className="property-title">
                                    {property?.title || "No Title"}
                                </h2>

                                <p>
                                    <strong>Type:</strong>{" "}
                                    {property?.propertyType || "N/A"}
                                </p>

                                <p>
                                    <strong>Location:</strong>{" "}
                                    {property?.areaName || "N/A"},{" "}
                                    {property?.district || "N/A"},{" "}
                                    {property?.state || "N/A"}
                                    {property?.pincode ? ` - ${property.pincode}` : ""}
                                </p>

                                <p>
                                    <strong>Price:</strong>{" "}
                                    ₹{property?.rent ?? "N/A"}/month
                                </p>

                                {property?.description && (
                                    <p>
                                        <strong>Description:</strong>{" "}
                                        {property.description}
                                    </p>
                                )}

                                {property?.amenities && (
                                    <p>
                                        <strong>Amenities:</strong>{" "}
                                        {property.amenities}
                                    </p>
                                )}

                                <hr />

                                <div className="property-actions">
                                    <button
                                        className="contact-btn"
                                        onClick={() => handleWhatsAppContact(property)}
                                    >
                                        Contact Owner
                                    </button>

                                    <Link to={`/contact-owner/${property?.id}`}>
                                        <button className="view-btn">
                                            Owner Details
                                        </button>
                                    </Link>
                                </div>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
