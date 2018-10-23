/*
	估值
*/

import React, { Component } from 'react';
import Highcharts from 'react-highcharts';
import $ from 'jquery';

import config from '@/js/config/config';
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
				text: ''
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
				{Math.abs(relativeDiscount)}%
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

    //保存
    save(){
        let url = config.getWebUrl();
        let content = this.props.data.info.enterpriseID+","+$('#txtSpaceEfficiency').val()+","+$('#txtSpacePremium').val()+","+$('#txtEfficiencyPremium').val();
        let args = {
            mode:'Enterprise',
            func:'UpdateAssess',
            args:content
        };
        $.ajax({ 
            type : "post",
            url : url,
            data : args,
            async : false,
            success : function(data){
                if(data.Status==="200"){
                    window.location.reload()
                }
            } 
        });
    }

    //分析结果
	renderAnalysis(){
        this.score = 0;
        let content = this.props.data.info.des_growthSpeed;
        content += this.props.data.info.des_roe;
        content += this.props.data.info.des_risk;
        let rangeIndex = Common.getRange(this.relativeDiscountRange,this.relativeDiscount/100*10+5);
        this.score = this.relativeDiscountRange[rangeIndex].score;
        this.assessDes = this.relativeDiscountRange[rangeIndex].name;
        let spaceEfficiencyDes = this.props.data.info.spaceEfficiencyDes;
        if(this.props.data.mode==="E"){
            let growthSpacePremium  = this.props.data.info.growthSpacePremium;
            let growthEfficiencyPremium  = this.props.data.info.growthEfficiencyPremium;
            return (
                <div className="analysis-bar" style={{backgroundImage:"url("+orangeBar+")",height:"450px"}}>
                    <div className="ui container">
                        <div className="ui grid assess-grid">
                            <div className="three wide column" style={{paddingRight:"0px"}}>
                                空间效率:
                            </div>
                            <div className="thirteen wide column">
                                <textarea id="txtSpaceEfficiency" style={{width:"470px",height:"120px"}} defaultValue={spaceEfficiencyDes}></textarea>
                            </div>
                            <div className="three wide column">
                                空间溢价:
                            </div>
                            <div className="five wide column">
                                <textarea id="txtSpacePremium" style={{width:"100px",height:"34px"}} defaultValue={growthSpacePremium}></textarea>%
                            </div>
                            <div className="three wide column">
                                效率溢价:
                            </div>
                            <div className="five wide column">
                                <textarea id="txtEfficiencyPremium" style={{width:"100px",height:"34px"}} defaultValue={growthEfficiencyPremium}></textarea>%
                            </div>
                            <div className="three wide column">
                            </div>
                            <div className="thirteen wide column">
                                <input type="button" value="保存" onClick={this.save.bind(this)} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }else{
            content += spaceEfficiencyDes;
            content += "依据简化估值模型，合理市净率应为"+this.rationalPriceToBook+"倍，";
            content += "相对当前"+this.props.data.info.currentPriceToBook+"倍市净率"
            // content += this.relativeDiscount>0?"折价":"溢价";
            content += "潜在"+(this.relativeDiscount>0?"上涨":"下跌")+"空间";
            content += Math.abs(this.relativeDiscount)+"%，当前股价"+this.relativeDiscountRange[rangeIndex].name+"！";
            let rationalShares = this.rationalPriceToBook/this.props.data.info.currentPriceToBook*this.props.data.shares
            rationalShares = rationalShares.toFixed(2);
            let leftV = rationalShares*0.95
            leftV = leftV.toFixed(2)
            let rightV = rationalShares*1.05
            rightV = rightV.toFixed(2)
            content += "合理股价应在"+leftV+"-"+rightV+"区间。";
            let convertScore = Common.convertToPercent(this.score,this.weight,2);
            // content += "我们给予"+convertScore+"分的评分。";
            return (
                <div className="analysis-bar" style={{backgroundImage:"url("+orangeBar+")",height:"450px"}}>
                    <div className="ui container">
                        <img src={quotes} className="analysis-symbol" alt="" />
                        <div className="analysis-title">总结:<br />{content}我们给予<span id="spTrendScore1">{convertScore}</span>分的评分。</div>
                        <div className="analysis-score" style={{paddingTop:"176px"}}>评分:<span id="spTrendScore2" className="analysis-score-v">{convertScore}</span><span className="analysis-score-a">分</span></div>
                    </div>
                </div>
            );
        }
    }
	
	render(){
		if(!this.props.data.scoreTrims){
            return <div></div>;
        }
		let renderChart = this.renderChart();
		let description = this.description();
		let analysisResult = this.renderAnalysis();
        this.props.onCollectAssess(this.score,this.assessDes,analysisResult);
        let convertScore = Common.convertToPercent(this.score,this.weight,2);
		return (
            <div className="bg-color-white">
                <div className="ui container">
					<TabScore name="估值" value={convertScore} type="assess" />
					<div className="charts-size">
                       {renderChart}
                    </div>
					{description}
	      	    </div>
	      	    <br />
            </div>
		);
	}
}

export default assess;