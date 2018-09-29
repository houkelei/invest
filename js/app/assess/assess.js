/*
	估值
*/

import React, { Component } from 'react';
import Highcharts from 'react-highcharts';

import Common from '@/js/utils/common';
import TabScore from '@/js/component/tab/score';
import Block from '@/js/component/block';

import '@/lib/semantic/dist/semantic.min.css';
import '@/css/app/assess/assess.css';

import orangeBar from '@/img/analysis/orange.png';
import quotes from '@/img/analysis/quotes.png';

class assess extends Component{

	constructor(props){
		super(props);
		this.weight = 35;
		this.elements=["增长速度","增长效率","ROE","风险","增长空间"];
		this.elementsScore=[];
		this.investRetributionGateAvg = 0;
		this.manageQualityAvg = 0;
		this.boundaryInvestRetributionGateAvg = 0;
		this.score = 0;
        this.assessDes = 0;
		this.rationalPriceToBook = 0;
        this.relativeDiscount = 0;
		this.relativeDiscountRange = {0:{name:"严重高估",score:5},3:{name:"高估",score:15},7:{name:"合理",score:25},10:{name:"低估",score:30},999:{name:"严重低估",score:35}}; //*10,+5
	}

	//生成报表配置
	makeChartConfig(){
		let config = {
            chart: {
                height:360,
				type: 'column'
			},
			title: {
				text: '评分'
			},
			subtitle: {
				text: '数据来源: leo.com'
			},
			xAxis: {
				categories: this.elements,
				crosshair: true
			},
			yAxis: {
				min: 0,
				title: {
					text: ''
				}
			},
			tooltip: {
				// head + 每个 point + footer 拼接成完整的 table
				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
				footerFormat: '</table>',
				shared: true,
				useHTML: true
			},
			plotOptions: {
				column: {
					borderWidth: 0,
					dataLabels: {
						// 开启数据标签
						enabled: true
					},
					// 关闭鼠标跟踪，对应的提示框、点击事件会失效
					enableMouseTracking: false
				}
			},
			series: [{
				name: '评分',
				data: this.props.data.scoreTrims
			}]
        };
        return config;
	}

	//报表
    renderChart(){
        let config = this.makeChartConfig();
        return (
            <Highcharts config={config}></Highcharts>
        );
    }

    blockOne(){
    	let initialRoeAvg2 = this.props.data.info.initialRoeAvg2;
    	return (
    		<Block lineNumber='2' bgColor='ffe4ce'>
    			近2年期初ROE<br/>
				{initialRoeAvg2}%
    		</Block>
    	);
    }

    blockTwo(){
    	let futureNetMarginGrowth = this.props.data.info.futureNetMarginGrowth;
    	return (
    		<Block lineNumber='3' bgColor='ffe4ce'>
    			未来3年净利润<br/>
				增速预测<br/>
				{futureNetMarginGrowth}%
    		</Block>
    	);
    }

    blockThree(){
    	let riskDiscountRate  = this.props.data.info.riskDiscountRate;
    	return (
    		<Block lineNumber='2' bgColor='ffe4ce'>
    			风险贴现率<br/>
				{riskDiscountRate}%
    		</Block>
    	);
    }

    blockFour(){
    	let spaceEfficiencyPremium  = this.props.data.info.spaceEfficiencyPremium;
    	return (
    		<Block lineNumber='2' bgColor='ffe4ce'>
    			空间效率溢价<br/>
				{spaceEfficiencyPremium}%
    		</Block>
    	);
    }

    blockFive(){
    	let initialRoeAvg2 = this.props.data.info.initialRoeAvg2;
    	let futureNetMarginGrowth = this.props.data.info.futureNetMarginGrowth;
    	let riskDiscountRate  = this.props.data.info.riskDiscountRate;
    	let spaceEfficiencyPremium  = this.props.data.info.spaceEfficiencyPremium;
    	let rationalPriceToBook = Math.pow(1+futureNetMarginGrowth/100,3)*(initialRoeAvg2/riskDiscountRate)*(1+spaceEfficiencyPremium/100);
    	rationalPriceToBook = rationalPriceToBook.toFixed(2);
    	this.rationalPriceToBook = rationalPriceToBook;
    	return (
    		<Block lineNumber='2' bgColor='ffe4ce'>
    			合理市净率<br/>
				{rationalPriceToBook}
    		</Block>
    	);
    }

    blockSix(){
    	let currentPriceToBook = this.props.data.info.currentPriceToBook;
    	let relativeDiscount = this.rationalPriceToBook/currentPriceToBook-1;
    	relativeDiscount = (relativeDiscount*100).toFixed(2);
        this.relativeDiscount = relativeDiscount;
    	return (
    		<Block lineNumber='2' bgColor='ffe4ce'>
                {relativeDiscount>0?"相对折价":"相对溢价"}
    			<br/>
				{relativeDiscount}%
    		</Block>
    	);
    }

    //描述
    description(){
    	let column = {"paddingLeft":"0.5em","paddingRight":"0.1em"};
    	return (
    		<div className="ui six column center grid">
				<div className="column" style={column}>
		    		{this.blockOne()}
				</div>
				<div className="column" style={column}>
					{this.blockTwo()}
				</div>
				<div className="column" style={column}>
					{this.blockThree()}
				</div>
				<div className="column" style={column}>
					{this.blockFour()}
				</div>
				<div className="column" style={column}>
					{this.blockFive()}
				</div>
				<div className="column" style={column}>
					{this.blockSix()}
				</div>
			</div>
    	);
    }

    //分析结果
	renderAnalysis(){
        this.score = 0;
        let content = this.props.data.info.des_growthSpeed;
        content += this.props.data.info.des_roe;
        content += this.props.data.info.des_risk;
        content += "公司目前处于行业龙头地位，属于稳健成长型，给予行业龙头10%的溢价，";
        content += "经营性现金流相对净利润非常充足，投资性现金流处于较低区间，增长效率稳定，给予5%的溢价，";
        content += "依据简化估值模型，合理市净率应为"+this.rationalPriceToBook+"倍，";
        let rangeIndex = Common.getRange(this.relativeDiscountRange,this.relativeDiscount/100*10+5);
        content += this.relativeDiscount>0?"相对折价":"相对溢价";
        content += this.relativeDiscount+"%，股价"+this.relativeDiscountRange[rangeIndex].name+"！";
        this.score = this.relativeDiscountRange[rangeIndex].score;
        content += "我们给予"+this.score+"分的加权评分。";
        this.assessDes = this.relativeDiscountRange[rangeIndex].name;
        return (
            <div className="analysis-bar" style={{backgroundImage:"url("+orangeBar+")",height:"450px"}}>
                <div className="ui container">
                    <img src={quotes} className="analysis-symbol" alt="" />
                    <div className="analysis-title">估值解析:<br />{content}</div>
                    <div className="analysis-score" style={{paddingTop:"176px"}}>评分:<span className="analysis-score-v">{this.score}</span><span className="analysis-score-a">分</span></div>
                </div>
            </div>
        );
    }
	
	render(){
		if(!this.props.data.scoreTrims){
            return <div></div>;
        }
		let renderChart = this.renderChart();
		let description = this.description();
		let analysisResult = this.renderAnalysis();
        this.props.onCollectAssess(this.score,this.assessDes);
		return (
            <div className="bg-color-white">
                <div className="ui container">
					<TabScore name="估值" value={this.score} type="assess" />
					<div className="charts-size">
                       {renderChart}
                    </div>
					{description}
	      	    </div>
	      	    <br />
	      	    {analysisResult}
            </div>
		);
	}
}

export default assess;