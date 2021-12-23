const middleWare=[]
let mw1=async (ctx,next)=>{
    console.log('1 begin');
    await next()
    console.log('1 end');
}
let mw2=async (ctx,next)=>{
    console.log('2 begin');
    await next()
    console.log('2 end');
}
let mw3=async (ctx,next)=>{
    console.log('3 end');
}
var use=(mw)=>{
    middleWare.push(mw)
}
use(mw1)
use(mw2)
use(mw3)
let fn=(ctx)=>{
    return dispatch(0)
    function dispatch(i){
        let currentMW=middleWare[i]
        if(!currentMW)return 
        return currentMW(ctx,dispatch.bind(null,i+1))
    }
}
fn()