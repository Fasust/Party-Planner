var array = [4, 1];

console.log(sortInteger(array));

function sortInteger(array) {
    if(array[0] > array[1]){  //wenn erste zahl grösser als zweite..

        array[0] += array[1]; //addiere zweite zahl auf erste
        array[1] = array[0] - array[1]; // //setze zweite zahl auf die differnce von der ersten und der zweiten zahl
        array[0] -= array[1]; // ziehe zweite zahl von erster zahl ab
    }
    return array;
}