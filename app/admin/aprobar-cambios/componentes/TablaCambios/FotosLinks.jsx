"use client";
import { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase/config";

const FotosLink = ({ arrayRefs }) => {
  const [arrayLinks, setArrayLinks] = useState([]);
  const [cargandoImagenes, setCargandoImagenes] = useState(true);

  useEffect(() => {
    async function getImagenesUrls(imagenesarray) {
      const arrayUrlsImagenes = await Promise.all(
        imagenesarray.map(async (imagen) => {
          const url = await getDownloadURL(ref(storage, imagen));
          return url;
        })
      );
      setArrayLinks(arrayUrlsImagenes); // set the arrayUrlsImagenes;
      setCargandoImagenes(false)
    }
    getImagenesUrls(arrayRefs);
  }, [arrayRefs]);

  return (
    <>
      {cargandoImagenes ? (
        <p>Cargando imagenes...</p>
      ) : (
        <ul>
          {arrayLinks.map((link, index) => {
            return (
              <li key={index}>
                <span className="font-semibold">{`Imagen ${index + 1}: `}</span>
                <a
                  className="text-blue-500 hover:text-blue-700 underline"
                  href={link}
                  target="_blank"
                >{`Imagen ${index + 1}`}</a>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default FotosLink;
