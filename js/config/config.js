/*
	配置类
*/

import configJson from './config.json';

class config {
    
	//获取weburl
	static getWebUrl(){
        return configJson.weburl
    }

}

export default config;