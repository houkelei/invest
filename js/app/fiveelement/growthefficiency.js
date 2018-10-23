/*
	增长效率-现金流
*/

import React, { Component } from 'react';
import Highcharts from 'react-highcharts';

import Common from '@/js/utils/common';
import TabScore from '@/js/component/tab/score';
import Block from '@/js/component/block';

import '@/lib/semantic/dist/semantic.min.css';
import '@/css/app/fiveelement/growthefficiency.css';

import cyanBar from '@/img/analysis/cyan.png';
import quotes from '@/img/analysis/quotes.png';

class growthefficiency extends Component{

	constructor(props){
		super(props);
		this.weight = this.props.data.Weights[2];
		this.investRetributionGateAvg = 0;
		this.manageQualityAvg = 0;
		this.boundaryInvestRetributionGateAvg = 0;
		this.score = 0;
		this.investRateRange = {0:{name:"过度",score:0,des:"投入资本过高，存在风险"},25:{name:"稳健",score:0,des:"稳步扩张"},9999:{name:"不足",score:0,des:"投入资本不足"}}; //*10,+20
		this.manageQualityRange = {10:{name:"不足",score:1},15:{name:"充足",score:3},9999:{name:"非常充足",score:5}}; //*10
		this.boundaryInvestRetributionGateRange = {0:{name:"无收益",score:1,des:"无盈利能力"},10:{name:"低收益",score:2,des:"盈利能力低"},20:{name:"中收益",score:3,des:"盈利能力良好"},30:{name:"中高收益",score:4,des:"盈利能力强"},999:{name:"高收益",score:5,des:"盈利能力极强"}};
		this.financingRatioRange = {3:{name:"极低",score:1,des:"净资产通过利润积累，经营业务可续性强"},10:{name:"很低",score:2,des:"净资产通过利润积累，经营业务可续性强"},30:{name:"低",score:3,des:"净资产通过利润积累，需少量筹资获取资金"},60:{name:"过高",score:4,des:"现金流质量有一定水分，净资产质量一般"},999:{name:"很高",score:5,des:"现金流不足，净资产质量不足"}};
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
				title: {
					text: ''
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
				name: '净利润',
				data: this.props.data.NetMargins,
			}, {
				name: '经营现金流净额',
				data: this.props.data.ManageCashNetAmounts,
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

    //经营质量描述
    manageQualityDes(){
    	let manageQualityAvg = 0
    	if (this.props.data.ManageCashNetAmounts) {
    		let self = this;
    		this.props.data.ManageCashNetAmounts.forEach(function(manageCashNetAmount,index){
    			let netMargin=self.props.data.NetMargins[index];
	    		manageQualityAvg+=manageCashNetAmount/netMargin;
	    	});
	    	manageQualityAvg=manageQualityAvg/self.props.data.ManageCashNetAmounts.length;
    	}
    	manageQualityAvg=manageQualityAvg.toFixed(2);
    	this.manageQualityAvg=manageQualityAvg;
    	return (
    		<Block lineNumber='3' bgColor='c1eeda'>
    			经营质量<br/>
				经营性现金流净额/净利润<br/>
				近5年均值：{manageQualityAvg}
    		</Block>
    	);
    }

    //投资率回报描述
    investRetributionGateDes(){
    	let investRetributionGateAvg = 0;
    	if (this.props.data.InvestCashNetAmounts) {
    		let self = this;
    		this.props.data.InvestCashNetAmounts.forEach(function(investCashNetAmount,index){
    			let netMargin=self.props.data.NetMargins[index];
	    		investRetributionGateAvg+=investCashNetAmount/netMargin;
	    	});
	    	investRetributionGateAvg=investRetributionGateAvg/self.props.data.InvestCashNetAmounts.length;
    	}
    	investRetributionGateAvg=investRetributionGateAvg.toFixed(2);
    	this.investRetributionGateAvg=investRetributionGateAvg;
    	return (
    		<Block lineNumber='3' bgColor='c1eeda'>
    			投资回报率<br/>
				投资性现金流净额/净利润<br/>
				近5年均值：{investRetributionGateAvg}
    		</Block>
    	);
    }

    //边际投资回报率描述
    boundaryInvestRetributionGateDes(){
    	let netMarginGrowthRateAvg = 0
    	if (this.props.data.NetMarginGrowthRates) {
    		let self = this;
    		this.props.data.NetMarginGrowthRates.forEach(function(netMarginGrowthRate,index){
	    		netMarginGrowthRateAvg+=netMarginGrowthRate;
	    	});
	    	netMarginGrowthRateAvg=netMarginGrowthRateAvg/self.props.data.NetMarginGrowthRates.length;
	    }
	    netMarginGrowthRateAvg=netMarginGrowthRateAvg.toFixed(2);
	    let boundaryInvestRetributionGateAvg = Math.abs(netMarginGrowthRateAvg/this.investRetributionGateAvg);
	    boundaryInvestRetributionGateAvg=boundaryInvestRetributionGateAvg.toFixed(2);
	    this.boundaryInvestRetributionGateAvg = boundaryInvestRetributionGateAvg;
    	return (
    		<Block lineNumber='3' bgColor='c1eeda'>
    			边际投资回报率<br/>
				净利润增速/投资回报率<br/>
				近5年均值：{boundaryInvestRetributionGateAvg}%<br/>
    		</Block>
    	);
    }

    //描述
    description(){
    	return (
    		<div className="ui center grid">
				<div className="five wide column">
		    		{this.manageQualityDes()}
				</div>
				<div className="six wide column">
					{this.investRetributionGateDes()}
				</div>
				<div className="five wide column">
					{this.boundaryInvestRetributionGateDes()}
				</div>
			</div>
    	);
    }

    //获取资产额度近5年平均值
    getFinancingRatioAvg(){
    	let financingRatioAvg = 0;
    	if (this.props.data.FinancingAmounts) {
    		let self = this;
    		let count = 0;
    		this.props.data.FinancingAmounts.forEach(function(financingAmount,index){
    			if(financingAmount>0){
    				count++;
    				let netAsset = self.props.data.NetAssets[index];
    				financingRatioAvg += financingAmount/netAsset;
    			}
	    	});
	    	financingRatioAvg=financingRatioAvg/count;
	    }
	    financingRatioAvg=financingRatioAvg.toFixed(2);
	    return financingRatioAvg*100
    }



    //分析结果
	renderAnalysis(){
        this.score = 0;
        let rangeIndex = Common.getRange(this.manageQualityRange, this.manageQualityAvg*10);
        let content = "近5年经营性现金流"+ this.manageQualityRange[rangeIndex].name;
        this.score+=this.manageQualityRange[rangeIndex].score;
        rangeIndex = Common.getRange(this.investRateRange, this.investRetributionGateAvg*10+20);
        content += "，投资率"+this.investRateRange[rangeIndex].name+"，"+this.investRateRange[rangeIndex].des;
        rangeIndex = Common.getRange(this.boundaryInvestRetributionGateRange, this.boundaryInvestRetributionGateAvg);
        content += "。边际投入资本回报率"+this.boundaryInvestRetributionGateAvg+"%，处于"+this.boundaryInvestRetributionGateRange[rangeIndex].name+"区间，"+this.boundaryInvestRetributionGateRange[rangeIndex].des;
        this.score+=this.boundaryInvestRetributionGateRange[rangeIndex].score;
        let convertScore = Common.convertToPercent(this.score,this.weight,2);
        rangeIndex = Common.getRange(this.financingRatioRange, this.getFinancingRatioAvg());
        let financingTxt = "没有筹资行为"
        if(this.props.data.InvestCount>0){
        	financingTxt = "有"+this.props.data.InvestCount+"次筹资行为";
        }
        content += "，近5年"+financingTxt+"，筹资额度"+this.financingRatioRange[rangeIndex].name+"，"+this.financingRatioRange[rangeIndex].des+"。";
        return (
            <div className="analysis-bar" style={{backgroundImage:"url("+cyanBar+")"}}>
                <div className="ui container">
                    <img src={quotes} className="symbol" alt="" />
                    <div className="analysis-title">增长效率解析:<br />{content}</div>
                    <div className="analysis-score">评分:<span className="analysis-score-v">{convertScore}</span><span className="analysis-score-a">分</span></div>
                </div>
            </div>
        );
    }

	render(){
		let renderChart = this.renderChart();
		let description = this.description();
		let analysisResult = this.renderAnalysis();
		let convertScore = Common.convertToPercent(this.score,this.weight,2);
		this.props.onCollectInfo(this.score,convertScore);
		return (
            <div className="bg-color-white">
                <div className="ui container">
					<TabScore name="增长效率" value={convertScore} type="growthefficiency" />
					<div className="charts-size">
					   {renderChart}
                    </div>
					{description}
					<br/>
	      	    </div>
	      	    {analysisResult}
            </div>
		);
	}
}

export default growthefficiency;