import React, { Component } from 'react';

import '@/lib/semantic/dist/semantic.min.css';
import '@/css/app/assessscore/assessscore.css';

import selected from '@/img/app/assessscore/selected.png';
import scoreImg from '@/img/app/assessscore/score.png';
import titlebgShort from '@/img/common/titlebgShort.png';

class assessscore extends Component{

	constructor(props){
		super(props);
		this.state={
			assessDes:0,
		};
	}

	componentDidMount(){
        this.props.onRef(this);
    }

	show(){
		this.setState({assessDes:this.props.data.assessDes});
	}

	render(){
		let assessDes = this.props.data.assessDes;
		let evaluates = ["严重高估","高估","合理","低估","严重低估"];
		let colors = ["dc807e","6c75eb","594fd4","4a42aa","3d3790"];
		return (
			<div className="ui container assessscore-container">
				<br />
				<br />
				<div className="fiveelementscore-title" style={{backgroundImage:"url("+titlebgShort+")"}}>估值评分</div>
				<br /><br /><br /><br />
				<div className="assessscore-tabs">
					{
						evaluates.map((item,i)=>(
							<div key={i} className="assessscore-tab" style={{backgroundColor:"#"+colors[i],color:(assessDes===item?"#fcff00":"white"),fontSize:(assessDes===item?"28px":"26px")}}>
								{item}
								{assessDes===item?<img className="assessscore-selectedimg" alt="" src={selected} />:""}
								{assessDes===item?<div className="assessscore-scoreImg" style={{backgroundImage:"url("+scoreImg+")"}}>{this.props.data.assessScore}<span className="assessscore-score-word">分</span></div>:""}
							</div>
						))
					}
					
				</div>
			</div>
		);
	}

}

export default assessscore;