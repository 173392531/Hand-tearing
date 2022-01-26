// 1.给定一个有序(非降序)数组A，可能含有重复元素，
// 求最小的i使得A[i]等于target，不存在则返回-1。
// array =[1,2,3,5,6,7,7,10]target  = 7，
// return  5 target = 8,  return -1.
// 给定一个有序(非降序)数组A，可能含有重复元素，
// 求最小的i使得A[i]等于target，不存在则返回-1。
// array =[1,2,3,5,6,7,7,10]target  = 7，return  5target = 8,  return -1

const getIndex = (arr,target) =>{
    let rightIndex = arr.length -1
    let leftIndex = 0
    let left = arr[leftIndex]
    let right = arr[rightIndex]
    while(rightIndex > leftIndex){
        let midIndex = Math.floor((leftIndex+rightIndex)/2)
        if(arr[midIndex] < target){
            leftIndex = midIndex + 1

        }else if(arr[midIndex] > target){
            rightIndex = midIndex - 1

        }else{
            return midIndex
        }
    }
    return -1
} 

// console.log(getIndex([1,2,3,5,6,7,7,10],8));
// console.log(getIndex([1,2,3,5,6,7,7,10],7));


// for(var i = 0; i < 5; i++) {
//     setTimeout(function() {
//         console.log(new Date(), i)
//     }, 1000);
// }

// console.log(new Date(), i)


// null
// 1s

// 5
// 5
// 5
// 5
// 5

async function getVal(){
    for(var i = 0; i < 5; i++) {
        setTimeout(()=>{
           console.log(new Date(), i)
        }, 1000);
    }
}
async function getDate(){
    await getVal()
    console.log(new Date() + '!!!', i)
}

await getDate()



