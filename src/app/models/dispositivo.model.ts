export class Dispositivo {
    idDevice?: number;
    name?: string;
    serialNumber?: string;
    brand?: string;
    status?: number;
    idHome?: number;   
    idRoom?: number;
    idCategory?: number; // <-- AGREGAR
    roomName?: string;
    categoryName?: string; // <-- AGREGAR
}