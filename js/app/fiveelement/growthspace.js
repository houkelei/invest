/*
	增长空间
*/

import React, { Component } from 'react';
import Highcharts from 'react-highcharts';

import Common from '@/js/utils/common';
import TabScore from '@/js/component/tab/score';

import '@/lib/semantic/dist/semantic.min.css';

import yellowBar from '@/img/analysis/yellow.png';
import quotes from '@/img/analysis/quotes.png';

class growthspace extends Component{

	constructor(props){
		super(props);
		this.weight = 10;
		this.score = 0;
		this.liabilityWithInterestRateTrendRange = {0:{name:"降低",score:5,des:"经营风险大幅下降"},10:{name:"降低",score:4,des:"经营风险下降"},30:{name:"稳定",score:3,des:"经营风险可控"},50:{name:"上升",score:2,des:"经营风险提升"},999:{name:"上升",score:1,des:"经营风险大幅提升"}}; //+20
		this.liabilityWithInterestRateRange = {5:{name:"无负债",score:5,des:"无财务风险"},30:{name:"低负债",score:4,des:"财务风险极低"},60:{name:"可控负债",score:3,des:"财务风险处于可控区间"},90:{name:"高负债",score:2,des:"财务方面具有风险"},999:{name:"风险负债",score:1,des:"财务风险高"}};
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

    //分析结果
	renderAnalysis(){
		this.score = 0;
		let content = "通过行业渗透率及发展预测，估值对比的方式进行解析，手打。";
        return (
            <div className="analysis-bar" style={{backgroundImage:"url("+yellowBar+")"}}>
                <div className="ui container">
                    <img src={quotes} className="analysis-symbol" alt="" />
                    <div className="analysis-title">增长空间解析:<br />{content}</div>
                    <div className="analysis-score">评分:<span className="analysis-score-v">{this.score}</span><span className="analysis-score-a">分</span></div>
                </div>
            </div>
        );
    }

	render(){
		let analysisResult = this.renderAnalysis();
		let spaceEfficiencyPremium = this.props.data.GrowthSpacePremium+this.props.data.GrowthEfficiencyPremium;
		this.props.onCollectInfo(this.score,Common.convertToPercent(this.score,this.weight,2),{spaceEfficiencyPremium:spaceEfficiencyPremium});
		return (
            <div className="bg-color-green">
                <div className="ui container">
					<TabScore name="增长空间" value={this.score} type="growthspace"  />
	      	    </div>
	      	    <br />
	      	    {analysisResult}
            </div>
		);
	}
}

export default growthspace;