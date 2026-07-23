class ActualizarPlanilla {

    constructor(repository){
        this.repository = repository;
    }

    async execute(id, productos){

        const planilla = await this.repository.findById(id);

        if(!planilla){
            throw new Error("Planilla no encontrada.");
        }

        if(planilla.estado==="CERRADA"){
            throw new Error("La planilla ya fue cerrada.");
        }

        return await this.repository.actualizar(id, productos);

    }

}

module.exports = ActualizarPlanilla;