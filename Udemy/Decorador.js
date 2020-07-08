"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//Decoracor de Clase
function decorador(constructor) {
    console.log(constructor);
}
let Clase = class Clase {
    constructor(nombre) {
        this.nombre = nombre;
    }
    getAdress() {
    }
};
Clase = __decorate([
    decorador
], Clase);
//let cl:Clase = new Clase("Silvio");
