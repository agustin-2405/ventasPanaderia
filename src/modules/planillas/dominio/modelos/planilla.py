class Planilla(id_planilla, id_repartidor, fecha, items_planilla(producto,cantidad,precio_unitario), total_planilla):
    def __init__(self, id_planilla, id_repartidor, fecha, items_planilla):
        self.id_planilla = id_planilla
        self.id_repartidor = id_repartidor
        self.fecha = fecha
        self.items_planilla = items_planilla

    def calcular_total_planilla(self):
        total = 0
        for item in self.items_planilla:
            total += item.cantidad * item.precio_unitario
        return total