import React, { Component } from 'react';

import Highcharts from 'react-highcharts';
import Common from '@/js/utils/common';
import selectedimg from '@/img/app/summarize/selectedimg.png';

import '@/lib/semantic/dist/semantic.min.css';
import '@/css/app/summarize/summarize.css';

import titlebgShort from '@/img/common/titlebgShort.png';

class summarize extends Component{

	constructor(props){
		super(props);
		this.scoreRange = {40:{name:"D"},60:{name:"C"},80:{name:"B"},95:{name:"A"},999:{name:"S"}};
		this.state={
			lastScore:0,
		};
	}

	componentDidMount(){
        this.props.onRef(this);
    }

	show(){
		this.setState({lastScore:this.props.data.lastScore});
	}

	//生成报表配置
	makeChartConfig(){
		let scores = this.props.data.scores;
		if(!scores){
			return null
		}
		let v1=scores[0],v2=scores[1],v3=scores[2],v4=scores[3],v5=scores[4];
		let data = [
			['增长速度',v1],
			['增长效率',v2],
			['ROE',v3],
			['风险',v4],
			['增长空间',v5],
			['估值',this.props.data.assessScore],
		];
		let config = {
			chart: {
                height:360,
				spacing : [40, 0 , 40, 0],
                backgroundColor: 'rgba(0,0,0,0)',
			},
			title: {
				floating:true,
				text: "<span class='summarize-score' style='color:#5b5879;'>"+this.state.lastScore+"<br></span><span class='summarize-score-word' style='color:#5b5879'> 加权总分</span>",
				y:170,
				x:-13
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					},
					point: {
						events: {
							mouseOver: function(e) {
							}
						}
					},
				}
			},
			series: [{
				type: 'pie',
				innerSize: '80%',
				name: '市场份额',
				data: data
			}]
        };
        return config;
	}

	loadLevel(){
		let lastScore = this.state.lastScore;
		if(!lastScore){
			return
		}
		let rangeIndex = Common.getRange(this.scoreRange, lastScore);
		let levels = ["S","A","B","C","D"];
		let colors = ["bcc0fe","6c75eb","594fd4","4a42ac","3d3790"];
		let levelName = this.scoreRange[rangeIndex].name;
		return (
			<div>
				<div className="summarize-invert-des">投资价值:{levelName}</div>
				<br />
				{
					colors.map((v,i) => (
			        	<div key={i} className="summarize-level" style={{
			        		backgroundColor:"#"+v,color:"#"+(levels[i]===levelName?"fff":"000949")
			        	}}>{levels[i]}{
			        		levels[i]===levelName?<img className="summarize-selectedimg" alt="" src={selectedimg} />:""
			        	}</div>
		        	))
		        }
			</div>
		);
	}

	render(){
		let config = this.makeChartConfig();
		if(config==null){
			return <div></div>
		}
		return (
			<div className="summarize-bg"> 
				<div className="ui container summarize-container">
					<br />
					<div className="fiveelementscore-title" style={{backgroundImage:"url("+titlebgShort+")"}}>综述</div>
					<div className="ui grid">
						<div className="twelve wide column" style={{padding:"0px"}}>
							<Highcharts config={config}></Highcharts>
						</div>
						<div className="four wide column" style={{padding:"0px",paddingLeft:"8px"}}>
							<br /><br />
							{this.loadLevel()}
						</div>
					</div>
					
				</div>
			</div>
		);
	}

}

export default summarize;