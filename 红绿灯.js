const red = () => {
    console.log('!红灯亮')
}
const green = () => {
    console.log('!绿灯亮')
}
const yellow = () => {
    console.log('!黄灯亮')
}

function setLight(time,type) {
    return new Promise((resolve,reject) => {
        const timer = setTimeout(()=>{
            if(type === 'red'){
                red()
            }else if (type === 'green'){
                green()
            }else if(type === 'yellow'){
                yellow()
            }
            resolve()
        },time)
    })
}

var task = async() => {
    await setLight(3000,'red')
    await setLight(1000,'green')
    await setLight(2000,'yellow')
    task()
}
task()