// 手写 bind 函数
Function.prototype.bind = function () {
    var self = this,                        // 保存原函数
    context = [].shift.call(arguments), // 保存需要绑定的this上下文
    args = [].slice.call(arguments);    // 剩余的参数转为数组
    return function () {                    // 返回一个新函数
        self.apply(context,[].concat.call(args, [].slice.call(arguments)));
    }
}

Function.prototype.Bind = function(){
    var that = this
    context = [].shift.call(arguments)
    args = [].slice.call(arguments)
    return function (){
        that.apply(context,[].concat.call(args,[].slice.call(arguments)))
    }
}

Function.prototype.bind2 = function(){
    var that = this
    ctx = [].shift.call(arguments)
    args = [].slice.call(arguments)
    return function(){
        that.apply(ctx,[].concat.call(args,[].slice.call(arguments)))
    }
}