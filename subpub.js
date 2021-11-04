class Sub{
    constructor(val){
        this.val=val
    }
    update(cb){
        this.val=cb(this.val)
        console.log(this.val)
    }
}
class Pub{
    constructor(){
        this.deps=[]
    }
    addDep(dep){
        this.deps.push(dep)
    }
    publish(dep){
        this.deps.forEach(item => item==dep && item.notify())
    }

}
class Dep{
    constructor(cb){
        this.subs=[]
        this.callback=cb
    }
    addSub(sub){
        this.subs.push(sub)
        return this
    }
    notify(){
        this.subs.forEach(item => item.update(this.callback))
    }
}
let dep1= new Dep(item => item * item)
dep1.addSub(new Sub(1)).addSub(new Sub(2)).addSub(new Sub(3))
let pub=new Pub()
pub.addDep(dep1)
pub.publish(dep1)