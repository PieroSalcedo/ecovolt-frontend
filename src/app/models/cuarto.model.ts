export class Cuarto {
    idRoom?: number;
    name?: string;
    floorNumber?: number;
    areaSqm?: number;
    orientation?: string;
    
    // IDs para el registro (Request)
    idHome?: number;
    idRoomType?: number;

    // Nombres para la tabla (Response)
    homeAddress?: string; 
    roomTypeName?: string;
}