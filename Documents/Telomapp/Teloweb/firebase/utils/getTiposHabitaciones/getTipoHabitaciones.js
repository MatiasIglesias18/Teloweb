// utils/firestore.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

// Función para obtener tipo de habitaciones de un telo con id = teloId, devuelve array de objetos
const getTipoHabitacionesTelo = async (teloId) => {
  const tipoHabitaciones = collection(doc(db, 'telos', teloId), 'tipoHabitaciones');
  const querySnapshot = await getDocs(tipoHabitaciones);
  const tipos = [];

  querySnapshot.forEach((doc) => {
    tipos.push({ id: doc.id, ...doc.data() });
  });

  return tipos;
};
export default getTipoHabitacionesTelo;