import React, { Component } from 'react';

import '@/css/component/block.css';

class block extends Component{

	render(){
		let className = "block-block threeline";
		if(parseInt(this.props.lineNumber,10)===2){
			className = "block-block twoline";
		}
		let bgColor = "c2edda";
		if(this.props.bgColor){
			bgColor = this.props.bgColor;
		}
		return (
            <div className={className} style={{backgroundColor:"#"+bgColor}} >
            	{this.props.children}
            </div>
        );
	}

}

export default block;