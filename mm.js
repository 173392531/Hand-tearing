// # 在一个长度为n的数组里的所有数字都在 0~n-1 范围内。数组中
// # 某些数字是重复的，不知道有几个数字重复，也不知道每个数字重复了几次。
// # 请找出数组中任意一个重复的数字。例如，如果输入长度为7的数组[2,3,2,0,1,5,3]，
// # 那么对应的输出是重复的数字2或者3

const findKey =(arr)=>{
    const len = arr.length
    const max = len -1
    for(let i=0;i<len;i++){
        if(arr[i]>max){
            throw new Error('不能大于最大值')
        }
        if(arr[i] !== i){
            const temp = arr[i]
            const val = arr[temp]
            if(temp == val){
                return temp
            }else{
                arr[temp] = temp 
                arr[i] = val 
                i--
            }
        }
    }
}

console.log(findKey([2,3,1,0,2,5,3]))
console.log(findKey([2,3,4,0,4,5,1]));
console.log(findKey([2,3,1,1,0,5,4]));
console.log(findKey([1,2,4,0,5,4]));


