function isPromise(obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';  
}

const myPromiseAll = (arr)=>{
    let result = [];
    return new Promise((resolve,reject)=>{
        for(let i = 0;i < arr.length;i++){
            if(isPromise(arr[i])){
                arr[i].then((data)=>{
                    result[i] = data;
                    if(result.length === arr.length){
                        resolve(result)
                    }
                },reject)
            }else{
                result[i] = arr[i];
            }
        }    
    })
}

// const proAll = (arr) => {
//     let res = []
//     return new Promise((resolve) => {
//         for(let i=0;i<arr.length;i++){
//             arr[i].then((data)=>{
//                 res[i]=data
//                 if(res.length === arr.length){
//                     resolve(res)
//                 }
//             })
//         }
//     })
// }

let p1 = new Promise((resolve, reject) => { 
    setTimeout(resolve, 1000, 'one'); 
}); 
let p2 = new Promise((resolve, reject) => { 
    setTimeout(resolve, 2000, 'two'); 
});
let p3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 3000, 'three');
});
let p4 = new Promise((resolve, reject) => {
    setTimeout(resolve, 4000, 'four');
});
let p5 = new Promise((resolve, reject) => {
    reject('reject');
});
  
myPromiseAll([p1, p2, p3, p4, p5]).then(values => { 
    console.log(values);
}, reason => {
    console.log(reason);// reject
});