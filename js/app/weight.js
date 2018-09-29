import React, { Component } from 'react';
import Circle from 'react-circle';

import '@/lib/semantic/dist/semantic.min.css';
import '@/css/app/weight.css';

class weight extends Component{
	render(){
		// let weights = this.props.data.weights;
		// weights = weights.split("$");
		// let colors = ["#98af57","#61b38a","#9fbbf5","#ea6e75","#ffe14c","#fd9a6b"];
		return (
			<div className="ui container weight-container">
	      	</div>
		);
	}
	render2(){
		let weights = this.props.data.weights;
		weights = weights.split("$");
		let colors = ["#98af57","#61b38a","#9fbbf5","#ea6e75","#ffe14c","#fd9a6b"];
		return (
			<div className="ui container weight-container">
				<div className="ui six column grid weight-grid">
					{
						colors.map((v,i)=>(
							<div key={i} cx="100" className="column weight-icon" style={{paddingLeft:"3px"}}><Circle progress={""+weights[i]} textColor={v} progressColor={v} textStyle={ {fontSize: '7rem'} } /></div>
						))
					}
				  	<div className="column weight-name" style={{color:colors[0]}}>增长速度</div>
				  	<div className="column weight-name" style={{color:colors[1]}}>增长效率</div>
				  	<div className="column weight-name" style={{color:colors[2]}}>ROE</div>
				  	<div className="column weight-name" style={{color:colors[3]}}>风险</div>
				  	<div className="column weight-name" style={{color:colors[4]}}>增长空间</div>
				  	<div className="column weight-name" style={{color:colors[5]}}>估值分析</div>
				</div>
	      	</div>
		);
	}
}

export default weight;