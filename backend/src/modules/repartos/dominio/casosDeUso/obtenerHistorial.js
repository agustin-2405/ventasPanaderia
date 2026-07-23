class ObtenerHistorial {

    constructor(repository){
        this.repository = repository;
    }

    async execute(repartidorId){

        return await this.repository.obtenerHistorial(repartidorId);

    }

}

module.exports = ObtenerHistorial;