/*
	公共方法
*/

class common {

	//获取区间
	static getRange(jsonInfo,condition,intervalType){
        intervalType = intervalType===undefined?1:intervalType;
        var rangeIndex
        if(intervalType===1){ //开区间
            for(var k in jsonInfo){
                if(condition<k){
                    rangeIndex = k
                    break
                }
            }
        }else{ //闭区间
            for(var kk in jsonInfo){
                if(condition<=kk){
                    rangeIndex = kk
                    break
                }
            }
        }
        return rangeIndex
    }

    //获取某个区间的中间值
    static getMiddleValue(jsonInfo,key){
        key = parseInt(key,10);
        let middleValue = 0;
        let previousRangeIndex = this.getPreviousRange(jsonInfo,key);
        previousRangeIndex = parseInt(previousRangeIndex,10);
        if(previousRangeIndex){
            middleValue = (key+previousRangeIndex)/2;
        }else{
            middleValue = key/2;
        }
        return middleValue;
    }

    //获取上一区间
    static getPreviousRange(jsonInfo,key){
        var rangeIndex;
        for(var k in jsonInfo){
            if(k>=key){
                break;
            }
            rangeIndex = k;
        }
        return rangeIndex;
    }

    //计算表达式的值
    static evil(fn) {
        var Fn = Function;  //一个变量指向Function，防止有些前端编译工具报错
        return new Fn('return ' + fn)();
    }

    //获取类名
    static getObjectClass(obj) {
        if (obj && obj.constructor && obj.constructor.toString()) {
           /*
            * for browsers which have name property in the constructor
            * of the object,such as chrome 
            */
            if(obj.constructor.name) {
                return obj.constructor.name;
            }
            var str = obj.constructor.toString();
           /*
            * executed if the return of object.constructor.toString() is 
            * "[object objectClass]"
            */
            var arr
            if(str.charAt(0) === '[')
            {
                arr = str.match(/\[\w+\s*(\w+)\]/);
            } else {
             /*
              * executed if the return of object.constructor.toString() is 
              * "function objectClass () {}"
              * for IE Firefox
              */
                arr = str.match(/function\s*(\w+)/);
            }
            if (arr && arr.length === 2) {
                return arr[1];
            }
        }
        return undefined; 
    }

    //获取json长度
    static getJsonLength(jsonData){
        var jsonLength = 0;
        for(var item in jsonData){
            item = typeof(item);
            jsonLength++;
        }
        return jsonLength;
    }

    //将数值转化成百分比
    static convertToPercent(v,ratio,keepFew){
        if(keepFew!==undefined){
            return parseFloat((v/(ratio/100)).toFixed(keepFew));
        }
        return v/(ratio/100);
    }

    //合并json数据
    static mergeJsonData(dst,src){
        for (var obj in src) {
            dst[obj] = src[obj];
        }
        return dst;
    }

    //计算数字数组的和
    static sum(arr){
        var result = 0;
        for(var i = 0; i < arr.length; i++) {
            result += arr[i];
        }
        return result;
    }

}

export default common;






