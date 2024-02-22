class tipoHabitacion {
    constructor(nombre, descripcion, nombrePublico, precio) {
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.nombrePublico = nombrePublico;
      this.precio = Number(precio);
      this.imagenes = [];
    }
  }

export default tipoHabitacion;