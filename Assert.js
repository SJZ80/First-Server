const assert = require('assert')

const a = 2;
const b= 1;
if (a) {

    try {
        
        assert.equal(a,b);
        console.log("son iguales");
        console.log(assert.equal(a,b));


    } catch (error) {
        
        console.log("Diferentes");
        
    }
}