import { db } from '@/firebase/config';
import { collection, getDocs, doc, query } from 'firebase/firestore';

const getHabitacionesEnTelo = async (teloId) => {
  const tipoHabitacionesRef = collection(doc(db, 'telos', teloId), 'tipoHabitaciones');
  const tiposQuerySnapshot = await getDocs(tipoHabitacionesRef);

  const habitaciones = [];

  for (const tipoDoc of tiposQuerySnapshot.docs) {
    const tipoData = tipoDoc.data();
    const habitacionesRef = collection(tipoDoc.ref, 'habitaciones');
    const habitacionesQuery = query(habitacionesRef);
    const habitacionesQuerySnapshot = await getDocs(habitacionesQuery);

    for (const habitacionDoc of habitacionesQuerySnapshot.docs) {
      const habitacionData = habitacionDoc.data();
      habitaciones.push({
        id: habitacionDoc.id,
        numeroHabitacion: habitacionData.numeroHabitacion,
        estado: habitacionData.disponible,
        tipoHabitacion: tipoData.nombre, // Puedes ajustar esto a tu estructura real
      });
    }
  }
  
  return habitaciones;
};

export default getHabitacionesEnTelo;