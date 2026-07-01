import { Opcion } from "../models/opcion.model";

export class JwtDTO {
    token?: string;
    type?: string;
    idUser?: number;
    login?: string;
    fullName?: string;
    roles?: string[];
    opciones?: Opcion[]; // IMPORTANTE: Para el menú dinámico de tu BD
}