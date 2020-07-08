"use strict";
function prueba(n) {
    var sol = 0;
    for (let i = 0; i < n; i++) {
        sol = sol + i;
        //             console.log(sol);
    }
    return sol;
}
function recursiva(n) {
    let sal;
    if (n == 0) {
        sal = 0;
    }
    else {
        sal = n + recursiva(n - 1);
    }
    return sal;
}
console.log(prueba(5));
console.log(recursiva(5));
