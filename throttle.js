function throttle(cb,delay) {
    let timer = 0
    return function(){
        clearTimeout(timer)
        timer = setTimeout(cb,delay)
    }
}