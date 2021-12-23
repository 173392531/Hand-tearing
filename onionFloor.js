const middleware = []
let mw1 = async function (ctx, next) {
    console.log("next前，第一个中间件")
    await next()
    console.log("next后，第一个中间件")
}
let mw2 = async function (ctx, next) {
    console.log("next前，第二个中间件")
    await next()
    console.log("next后，第二个中间件")
}
let mw3 = async function (ctx, next) {
    console.log("第三个中间件，没有next了")
}


function use(mw) {
    middleware.push(mw)
}

use(mw1)
use(mw2)
use(mw3)

let fn = function (ctx) {
    return dispatch(0)

    function dispatch(i) {
        let currentMW = middleware[i]
        if(!currentMW) {
            return
        }
        return currentMW(ctx, dispatch.bind(null, i + 1))
    }
}

fn()