/*
	ROE
*/

import React, { Component } from 'react';
import Highcharts from 'react-highcharts';

import Common from '@/js/utils/common';
import TabScore from '@/js/component/tab/score';

import '@/lib/semantic/dist/semantic.min.css';
import '@/css/app/fiveelement/roe.css';

import blueBar from '@/img/analysis/blue.png';
import quotes from '@/img/analysis/quotes.png';

class roe extends Component{

	constructor(props){
		super(props);
		this.weight = this.props.data.Weights[3];
		this.score = 0;
		this.initialRoeAvg2 = 0;
		this.assessDes = "";
		this.earningsRateRange = {0:{name:"无收益",score:8,des:"无盈利能力"},10:{name:"低收益",score:13,des:"盈利能力低"},20:{name:"中收益",score:16,des:"盈利能力良好"},30:{name:"中高收益",score:18,des:"盈利能力强"},999:{name:"高收益",score:20,des:"盈利能力极强"}};
		this.volatilityRateRange = {8:{name:"低波动率",score:20,des:"经营非常稳健"},15:{name:"中低波动率",score:18,des:"经营稳健"},22:{name:"中波动率",score:15,des:"经营不稳定"},999:{name:"高波动率",score:12,des:"经营非常不稳定"}};
        this.weights = [80,20];
	}

	//生成报表配置
	makeChartConfig(){
		let config = {
            chart: {
                height:360,
				type: 'line',
				backgroundColor: 'rgba(0,0,0,0)',
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
				name: 'ROE',
				data: this.props.data.ROES,
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

    //分析结果
	renderAnalysis(){
		this.score = 0;
		let roeAvg5 = this.getRoeAvg();
		let roeAvg2 = this.getRoeAvg(2);
    	this.initialRoeAvg2 = (roeAvg2/(100-roeAvg2)*100).toFixed(2);
    	//评估描述
    	this.assessDes += "roe我们取近两年期初ROE均值"+this.initialRoeAvg2+"%作为参数。";
        let content = "ROE近5年平均收益为"+roeAvg5+"%，过去2年平均收益为"+roeAvg2+"%，";
        let rangeIndex = 0;
        let rangeIndexA = Common.getRange(this.earningsRateRange, roeAvg5);
        let rangeIndexB = Common.getRange(this.earningsRateRange, roeAvg2);
        rangeIndex = rangeIndexA===rangeIndexB?rangeIndexA:rangeIndexB;
        this.score += this.earningsRateRange[rangeIndex].score*this.weights[0]/100
        if(rangeIndexA===rangeIndexB){
        	content += "ROE保持"+this.earningsRateRange[rangeIndex].name+"，"+this.earningsRateRange[rangeIndex].des
       	}else{
       		content += "ROE由"+this.earningsRateRange[rangeIndexA].name+"切换为"+this.earningsRateRange[rangeIndexB].name+"，"+this.earningsRateRange[rangeIndexB].des
        }
        let volatilityRateAvg5 = this.getVolatilityRateAvg(5)
        let volatilityRateAvg2 = this.getVolatilityRateAvg(2)
        rangeIndexA = Common.getRange(this.volatilityRateRange, volatilityRateAvg5);
        rangeIndexB = Common.getRange(this.volatilityRateRange, volatilityRateAvg2);
        rangeIndex = rangeIndexA===rangeIndexB?rangeIndexA:rangeIndexB;
        this.score += this.volatilityRateRange[rangeIndex].score*this.weights[1]/100;
        this.score = parseFloat(this.score.toFixed(1));
        let convertScore = Common.convertToPercent(this.score,this.weight,2);
        if(rangeIndexA===rangeIndexB){
        	content += "！ROE保持"+this.volatilityRateRange[rangeIndex].name
       	}else{
       		content += "！ROE由"+this.volatilityRateRange[rangeIndexA].name+"切换为"+this.volatilityRateRange[rangeIndexB].name
        }
        content += "，"+this.volatilityRateRange[rangeIndex].des
        content += "。我们给予"+convertScore+"分的评分。"
        return (
            <div className="analysis-bar" style={{backgroundImage:"url("+blueBar+")"}}>
                <div className="ui container">
                    <img src={quotes} className="analysis-symbol" alt="" />
                    <div className="analysis-title">ROE解析:<br />{content}</div>
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
		this.props.onCollectInfo(this.score,convertScore,{initialRoeAvg2:this.initialRoeAvg2,des_roe:this.assessDes});
		return (
            <div className="bg-color-green">
                <div className="ui container">
					<TabScore name="ROE" value={convertScore} type="roe" />
					<div className="charts-size">
					   {renderChart}
                    </div>
	      	    </div>
	      	    {analysisResult}
            </div>
		);
	}
}

export default roe;