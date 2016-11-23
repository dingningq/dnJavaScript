/**
 * Created by jh on 2016/9/5.
 */

function sum(){
    var total=null;
    for(var i=0;i<arguments.length;i++){
        var cur=arguments[i];
        total+=cur;
    }
    return total;
}

module.exports.sum=sum;