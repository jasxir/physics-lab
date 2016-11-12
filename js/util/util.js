var merge = {
    "left" : function (m1, m2, result) {
        var key;
        result = result || {};
        
        for (key in m1) {
            result[key] = m1[key];
        }
        
        if (m2) {
            for (key in m2) {
                result[key] = m2[key];
                /*value = result[key];
                if(value === undefined) {
                }*/
            }
        }
        return result;
    }
};