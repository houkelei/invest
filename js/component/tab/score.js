import React, { Component } from 'react';

import '@/css/component/tab/tab-score.css';

// import icon from '';

class score extends Component{

	constructor(props){
		super(props);
		this.types={
			"assess":"ff996e",
			"growthefficiency":"62b48b",
			"growthspace":"fedf4c",
			"growthspeed":"96b058",
			"risk":"eb7075",
			"roe":"9fbbf5"
		}
	}

	render(){
		let img = <div></div>;
		if (this.props.type){
			img = <img alt="" src={require('@/img/component/tab/'+this.props.type+'.png')} />;
		}
		let color = this.types[this.props.type];
		return (
            <div className="tab-score-tab">
                <div className="tab-score-icon">{img}</div>
                <div className="tab-score-tabname" style={{color:"#"+color}}>{this.props.name}</div>
                <div className="tab-score-tabscore" style={{color:"#"+color}}>{this.props.value}<span className="tab-score-tabscore-a" style={{color:"#"+color}}>分 ></span></div>
                <div className="tab-score-hr" style={{backgroundColor:"#"+color}}></div>
            </div>
        );
	}
}

export default score;