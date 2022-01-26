var arr = [3, 4, 1, 2];
function bubbleSort (arr) {
  var max = arr.length - 1;
  for (var j = 0; j < max; j++) {
    // 声明一个变量，作为标志位
    var done = true;
    for (var i = 0; i < max - j; i++) {
      if (arr[i] > arr[i + 1]) {
        var temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        done = false;
      }
    }
    if (done) {
      break;
    }
  }
  return arr;
}
let res = bubbleSort(arr);
console.log(res);

function bubbleSort2(arr){
    let max = arr.length-1
    for(let j=0;j<max;j++){
        let done = true
        for(let i=0;i<max-j;i++){
            if(arr[i]>arr[i+1]){
                let temp = arr[i]
                arr[i]=arr[i+1]
                arr[i+1]=temp
                done = false
            }
        }
        if(done)break
    }
    return arr
}
console.log(bubbleSort2([1,3,2,5]));

function bubbleSort3(arr){
    let max = arr.length-1
    for(let i=0;i<max-1;i++){
        let done = true
        for(let j=0;j<max-i;j++){
            if(arr[j]>arr[j+1]){
                let temp = arr[j+1]
                arr[j+1]=arr[j]
                arr[j]=temp
                done = false
            }
        }
        if(done)break
    }
}

function bbs(arr){
    const len = arr.length-1
    for(let i =0;i<len;i++){
        let done = true
        for(let j=0;j<len - i;j++){
            if(arr[j]>arr[j+1]){
                let temp = arr[j+1]
                arr[j+1]= arr[j]
                arr[j]=temp
                done = false
            }
        }
        if(done)break
    }
}


function bbs(arr) {
    const len = arr.length - 1
    for(let i=0;i<len;i++){
        let done = true
        for(let j=0;j<len - i;j++){
            if(arr[j]>arr[j+1]){
                let temp = arr[j+1]
                arr[j+1]= arr[j]
                arr[j]=temp
                done = false
            }
        }
        if(done)break
    }
}