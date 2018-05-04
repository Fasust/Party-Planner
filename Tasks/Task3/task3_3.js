var array = [4, 1];

console.log(sortInteger(array));

function sortInteger(array) {
    if(array[0] > array[1]){
        array[0] += array[1];
        array[1] = array[0] - array[1];
        array[0] -= array[1];
    }
    return array;
}