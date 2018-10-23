/*
	风险
*/

import React, { Component } from 'react';
import Highcharts from 'react-highcharts';

import Common from '@/js/utils/common';
import TabScore from '@/js/component/tab/score';

import '@/lib/semantic/dist/semantic.min.css';
import '@/css/app/fiveelement/risk.css';

import peachBar from '@/img/analysis/peach.png';
import quotes from '@/img/analysis/quotes.png';

class risk extends Component{

	constructor(props){
		super(props);
		this.weight = this.props.data.Weights[4];
		this.score = 0;
		this.riskDiscountRate = 0;
		this.assessDes = "";
		this.liabilityWithInterestRateTrendRange = {0:{name:"降低",score:2,des:"经营风险大幅下降"},10:{name:"降低",score:1,des:"经营风险下降"},20:{name:"降低",score:0.5,des:"经营风险小幅下降"},40:{name:"上升",score:0,des:"经营风险提升"},999:{name:"上升",score:0,des:"经营风险大幅提升"}}; //+20
		this.liabilityWithInterestRateRange = {5:{name:"无负债",score:8,des:"无财务风险"},30:{name:"低负债",score:6,des:"财务风险极低"},60:{name:"可控负债",score:4,des:"财务风险处于可控区间"},90:{name:"高负债",score:2,des:"财务方面具有风险"},999:{name:"风险负债",score:0,des:"财务风险高"}};
		this.liabilityWithInterestRateScoreRange = {0:{name:"0",score:20,des:"财务风险极高"},2:{name:"1-2",score:16,des:"财务风险高"},4:{name:"3-4",score:14,des:"财务风险高"},6:{name:"5-6",score:11,des:"财务风险可控"},8:{name:"7-8",score:10,des:"财务风险低"},10:{name:"9-10",score:9,des:"财务风险极低"}};
	}

	//生成报表配置
	makeChartConfig(){
		let config = {
            chart: {
                height:360,
				type: 'line'
			},
			title: {
				text: ''
			},
			// subtitle: {
			// 	text: '数据来源: leo.com'
			// },
			xAxis: {
				categories: this.props.data.Years,
			},
			yAxis: {
				min: 0,
				title: {
					text: ''
				},
				labels: {
					format: '{value}%',
				}
			},
			plotOptions: {
				line: {
					dataLabels: {
						// 开启数据标签
						enabled: true          
					},
					// 关闭鼠标跟踪，对应的提示框、点击事件会失效
					enableMouseTracking: false
				}
			},
			series: [{
				name: '有息负债率',
				data: this.props.data.LiabilityWithInterestRates,
				tooltip: {
					valueSuffix: '%'
				}
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

    //获取近几年平均收益
    getRoeAvg(years){
		if(!years){
			years = this.props.data.ROES.length;
		}
		let roeAvg = 0;
		let self = this;
		let i = 0;
		this.props.data.ROES.forEach(function(roe,index){
			i++;
			if(i<=self.props.data.ROES.length-years){
				return
			}
			roeAvg += roe;
    	});
    	roeAvg=roeAvg/years;
	    roeAvg=roeAvg.toFixed(2);
	    return parseFloat(roeAvg)
    }

    //获取近几年平均roe波动率
    getVolatilityRateAvg(years){
		if(!years){
			years = this.props.data.ROEVolatilitys.length;
		}
		let volatilityAvg = 0;
		let self = this;
		let i = 0;
		this.props.data.ROEVolatilitys.forEach(function(volatility,index){
			i++;
			if(i<=self.props.data.ROEVolatilitys.length-years){
				return
			}
			volatilityAvg += volatility;
    	});
    	volatilityAvg=volatilityAvg/years;
	    volatilityAvg=volatilityAvg.toFixed(2);
	    return parseFloat(volatilityAvg)
    }

    //获取近几年有息负债率
    getLiabilityWithInterestRate(years){
    	let y = this.props.data.LiabilityWithInterestRates.length;
    	let liabilityWithInterestRate = this.props.data.LiabilityWithInterestRates[y-1]-this.props.data.LiabilityWithInterestRates[y-years]
    	liabilityWithInterestRate=liabilityWithInterestRate.toFixed(2);
	    return parseFloat(liabilityWithInterestRate);
    }

    //分析结果
	renderAnalysis(){
		this.score = 0;
		let liabilityWithInterestRate5 = this.getLiabilityWithInterestRate(5);
		let rangeIndex = Common.getRange(this.liabilityWithInterestRateTrendRange, liabilityWithInterestRate5+20);
		let liabilityWithInterestRateTrend = this.liabilityWithInterestRateTrendRange[rangeIndex];
		this.score += liabilityWithInterestRateTrend.score;
		liabilityWithInterestRate5=Math.abs(liabilityWithInterestRate5);
		let content = "近5年有息负债率"+liabilityWithInterestRateTrend.name+liabilityWithInterestRate5;
        content += "%，"+liabilityWithInterestRateTrend.des;
        let y = this.props.data.LiabilityWithInterestRates.length;
    	let liabilityWithInterestRate1 = this.props.data.LiabilityWithInterestRates[y-1]
    	rangeIndex = Common.getRange(this.liabilityWithInterestRateRange, liabilityWithInterestRate1);
		let liabilityWithInterestRate = this.liabilityWithInterestRateRange[rangeIndex];
		this.score += liabilityWithInterestRate.score;
		let convertScore = Common.convertToPercent(this.score,this.weight,2);
    	content += "，去年有息负债率"+liabilityWithInterestRate1+"%，"+liabilityWithInterestRate.des+"。从目前的有息负债率及趋势判断我们给予"+convertScore+"分的评分！"
        //风险贴现率
		rangeIndex = Common.getRange(this.liabilityWithInterestRateScoreRange,this.score,0);
		this.riskDiscountRate = this.liabilityWithInterestRateScoreRange[rangeIndex].score;
        //评估描述
        this.assessDes += "目前的有息负债率为"+liabilityWithInterestRate1+"%，";
        this.assessDes += liabilityWithInterestRate.des+",";
        this.assessDes += "取"+this.riskDiscountRate+"%的风险贴现率，";
        return (
            <div className="analysis-bar" style={{backgroundImage:"url("+peachBar+")"}}>
                <div className="ui container">
                    <img src={quotes} className="analysis-symbol" alt="" />
                    <div className="analysis-title">风险解析:<br />{content}</div>
                    <div className="analysis-score">评分:<span className="analysis-score-v">{convertScore}</span><span className="analysis-score-a">分</span></div>
                </div>
            </div>
        );
    }

	render(){
        this.assessDes = "";
		let renderChart = this.renderChart();
		let analysisResult = this.renderAnalysis();
		let convertScore = Common.convertToPercent(this.score,this.weight,2);
		this.props.onCollectInfo(this.score,convertScore,{riskDiscountRate:this.riskDiscountRate,des_risk:this.assessDes});
		return (
            <div className="bg-color-white">
                <div className="ui container risk-container">
					<TabScore name="风险" value={convertScore} type="risk" />
					<div className="charts-size">
					   {renderChart}
                    </div>
	      	    </div>
	      	    {analysisResult}
            </div>
		);
	}
}

export default risk;