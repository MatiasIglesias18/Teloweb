class telo {
    constructor(uid, nombre, descripcion, direccion, geopoint, habilitado, operador, servicios) {
      this.uid = uid;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.direccion = direccion;
      this.fechaCreacion = new Date();
      this.geopoint = geopoint;
      this.habilitado = habilitado;
      this.habitacionesDisponibles = 0;
      this.habitacionesReservadas = 0;
      this.habitacionesTotales = 0;
      this.operador = operador;
      this.ratingPromedio = 7;
      this.servicios = servicios;
    }
  }

export default telo;