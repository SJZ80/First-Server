//Decoracor de Clase
function decorador(constructor:Function) {
    
    console.log( constructor );
    
}

@decorador
class Clase {

    constructor(public nombre:string){

       

    }

    getAdress(){

        
    }

}
//let cl:Clase = new Clase("Silvio");
