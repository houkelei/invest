import React, { Component } from 'react';
import '@/lib/semantic/dist/semantic.min.css';

import Common from '@/js/utils/common';

import '@/css/app/grade/grade.css';

import logo from '@/img/app/grade/logo.png';
import selectedimg from '@/img/app/grade/selectedimg.png';
import cover1 from '@/img/app/enterprise/cover1.png';
import cover2 from '@/img/app/enterprise/cover2.png';
import cover3 from '@/img/app/enterprise/cover3.png';

class grade extends Component{

	constructor(props){
		super(props);
		this.level = "D";
		this.scoreRange = {40:{name:"D"},60:{name:"C"},80:{name:"B"},95:{name:"A"},999:{name:"S"}};
	}

	loadLevel(){
		let lastScore = this.props.data.lastScore;
		let rangeIndex = Common.getRange(this.scoreRange, lastScore);
		let levels = ["S","A","B","C","D"];
		let colors = ["bcc0fe","6c75eb","594fd4","4a42ac","3d3790"];
		let levelName = this.scoreRange[rangeIndex].name;
		this.level = levelName;
		return (
			<div className="grade-levelcontainer">
				{
					colors.map((v,i) => (
			        	<div key={i} className="grade-level" style={{
			        		backgroundColor:"#"+v,color:"#"+(levels[i]===levelName?"fff":"000949")
			        	}}>{levels[i]}{
			        		levels[i]===levelName?<img className="grade-selectedimg" alt="" src={selectedimg} />:""
			        	}</div>
		        	))
		        }
			</div>
		);
	}

	loadFooter(){
		return (
			<div className="grade-footer">
				<img src={cover1} className="grade-cover1" alt="" />
				<img src={cover2} className="grade-cover2" alt="" />
				<img src={cover3} className="grade-cover3" alt="" />
			</div>
		);
	}

	render(){
		let levels = this.loadLevel();
		let footer = this.loadFooter();
		let lastScore = this.props.data.lastScore;
		return (
			<div>
				<div className="ui container grade-container">
					<div className="grade-title">结合估值5要素及当前趋势，给予{this.props.data.stockName}</div>
					<br/><br/>
					<div className="ui two column center grid">
						<div className="column grade-column" >
							<div className="grade-score"><span className="grade-a-score">{lastScore}</span><br/><span className="grade-a-word">总得分</span></div>
						</div>
						<div className="column grade-column">
							{levels}
						</div>
					</div>
					{footer}
					<br /><br /><br /><br /><br />
		      	</div>
				<div className="grade-logobg">
					<div className="grade-topBar" style={{backgroundImage:"url("+logo+")"}}></div>
				</div>
	      	</div>
		);
	}
}

export default grade;