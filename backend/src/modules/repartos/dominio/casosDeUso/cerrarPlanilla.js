class CerrarPlanilla {

    constructor(repository){
        this.repository = repository;
    }

    async execute(id,devoluciones){

        const planilla = await this.repository.findById(id);

        if(!planilla){
            throw new Error("Planilla no encontrada.");
        }

        if(planilla.estado==="CERRADA"){
            throw new Error("La planilla ya está cerrada.");
        }

        return await this.repository.cerrar(id,devoluciones);

    }

}

module.exports = CerrarPlanilla;