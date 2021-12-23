class Pub{
    constructor(){
        this.targetDep =[]
    }
    pubEvent(depOr, cb){
        this.targetDep.forEach(dep=>{
            dep.depContent.forEach(sub=>{
                sub.goEvent(cb)
            })
        })
    }
    addDep(dep){
        this.targetDep.push(dep)
    }
}
class Sub{
    constructor(id){
        this.id = id
    }
    goEvent(cb){
        cb()
    }
}
class Dep{
    constructor(){
        this.depContent = []
    }
    addSub(sub){
        this.depContent.push(sub)
        return this
    }
}

const dep = new Dep()

const sub1 = new Sub('12344a')
const sub2 = new Sub('12344b')
const sub3 = new Sub('12344n')

dep.addSub(sub1).addSub(sub2).addSub(sub3)

const pub = new Pub()
pub.addDep(dep)
pub.pubEvent(dep, ()=>console.log(222))