"use client";
import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";
import { useTeloContext } from "@/app/context/TeloDocProvider";
import { storage } from "@/firebase/config";
import { ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

const CarouselImagenesTelo = () => {
  const { teloDoc } = useTeloContext();
  const [imagenes, setImagenes] = useState([]);

  //construir un array de objetos con las imagenes, el objeto contiene original y thumbnail, ambos contienen el link a la imagen
  useEffect(() => {
    async function getImagenes() {
      if (teloDoc?.imagenes) {
        try {
          const images = await Promise.all(
            teloDoc.imagenes.map(async (imagen) => {
              const imagenRef = ref(storage, imagen);
              const downloadUrl = await getDownloadURL(imagenRef);
              return {
                original: downloadUrl,
                originalWidth: 500,
                originalHeight: 500,
                originalClass: "max-h-[500px] object-cover",
              };
            })
          );
          setImagenes(images);
        } catch (error) {
          console.log(error);
          setImagenes([]);
        }
      } else {
        setImagenes([]);
      }
    }
    getImagenes();
  }, [teloDoc]);

  if (!teloDoc) return null;

  return (
    <>
      {imagenes.length > 0 ? (
        <ImageGallery
          items={imagenes}
          showThumbnails={false}
          showFullscreenButton={false}
          showPlayButton={false}
          showBullets={true}
          infinite={false}
        />
      ) : (
        <div className="text-center ">
          <p>Aún no has cargado imágenes del telo</p>
        </div>
      )}
    </>
  );
};

export default CarouselImagenesTelo;
