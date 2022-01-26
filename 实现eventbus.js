class eventBus{
    constructor(){
        this.res={
            // key:[]
        }
    }
    on(key,cb){
        // this.res.forEach((item)=>{
        //     // 已经注册过
        //     if(Object.keys(item)[0] == key){
        //         item.key.push(cb)
        //     }else{
        //     // 尚未注册
        //         const target = {
        //         }
        //         target[key]=[cb]
        //         this.res.push(target)
        //     }
        // })

        const keyList = Object.keys(this.res)
        if(keyList.includes(key)){
            this.res[key].push(cb)
        }else{
            this.res[key] = [cb]
        }

        // Array.isArray(this.res[key]){

        // } 

        // if(this.res[key]){

        // }

        
    }
    off(key,cb){
        this.res.forEach((item)=>{
            if((item.key == key)&&cb){
                this.res.splice(arr.findIndex(key),1)
            }else if(!cb){
                this.res
            }
        })
    }
    emit(key,val){
        this.res.forEach((item)=>{
            if(Object.keys(item) == key){
                return item.key.forEach((cb)=>{
                    cb(val)
                })
            } 
        })
    }
}