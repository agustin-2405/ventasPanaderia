class ObtenerPlanilla {

    constructor(repository){
        this.repository = repository;
    }

    async execute(id){

        const planilla = await this.repository.findById(id);

        if(!planilla){
            throw new Error("Planilla no encontrada.");
        }

        return planilla;
    }

}

module.exports = ObtenerPlanilla;