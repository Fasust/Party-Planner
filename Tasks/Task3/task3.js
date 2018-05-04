/************************************************************************
 * Task 3.1
 ************************************************************************/
for (var x = 0; x < 10; x++) {
    console.log(x);
    setTimeout(function () {
        console.log("The number is " +x);
        }, 1000);
}

/* Gedachte ausgabe:
0
The number is 0
wait 1 second
1
The number is 1
...
*/