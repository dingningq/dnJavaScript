/**
 * Created by jh on 2016/6/23.
 */
var utils = {

    listToArray: function (likeAry) {
        var ary = [];
        try {
            ary = Array.prototype.slice.call(likeAry);
        } catch (e) {
            for (var i = 0; i < likeAry.length; i++) {
                ary[ary.length] = likeAry[i];
            }
        }
        return ary;
    },

    jsonParse: function (str) {
        //var val=null;
        //try{
        //    val=JSON.parse(str);
        //}catch(e){
        //    val=eval("("+str+")");
        //}
        //return val;

        return "JSON"in window ? JSON.parse(str) : eval("(" + str + ")");
    }
}