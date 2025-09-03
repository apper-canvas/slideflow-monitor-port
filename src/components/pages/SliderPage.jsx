import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { imageService } from "@/services/api/imageService";
import ImageSlider from "@/components/organisms/ImageSlider";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
const SliderPage = () => {
const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadImages = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await imageService.getAll();
      setImages(data);
      
      if (data.length > 0) {
        toast.success(`Loaded ${data.length} images successfully`);
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load images");
      console.error("Error loading images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadImages();
  }, [isAuthenticated, navigate]);
  // Show loading state
  if (loading) {
    return <Loading />;
  }

  // Show error state
  if (error) {
    return <Error message={error} onRetry={loadImages} />;
  }

  // Show empty state
  if (!images || images.length === 0) {
    return <Empty onAction={loadImages} />;
  }

  // Show main slider
  return <ImageSlider images={images} />;
};

export default SliderPage;