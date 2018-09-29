/*
	总结
*/

import React, { Component } from 'react';
import $ from 'jquery';
import Highcharts from 'react-highcharts';

import Common from '@/js/utils/common';
import TabScore from '@/js/component/tab/score';
import config from '@/js/config/config';

import '@/lib/semantic/dist/semantic.min.css';
import '@/css/app/fiveelement/risk.css';

import blueBar from '@/img/analysis/blue.png';
import quotes from '@/img/analysis/quotes.png';

class trend extends Component{

	constructor(props){
		super(props);
		this.score = 0;
		this.state = {
            data:{}
        };
        this.marketContrastRange = {0:{name:"跑输大盘"},4:{name:"与大盘涨跌幅基本一致"},999:{name:"跑赢大盘"}}; //+2
	}

	componentWillMount() {
		let url = config.getWebUrl();
		let enterpriseID = 2;
		let args = {
            mode:'SharePrice',
            func:'ShowSharePrice',
            args:enterpriseID
        };
		let self = this;
		$.ajax({ 
			type : "post",
			url : url,
			data : args,
			async : false,
			success : function(data){
				self.analysisData(data);
			} 
        });
	}

	analysisData(data){
		let rows = data.SharePriceData.split("$");
		//数组
		let Cycles=[],RecentChanges=[],SCZSChanges=[],RelativeMarketChanges=[];
		rows.forEach(function(rowStr){
			let row = rowStr.split("|");
			Cycles.push(row[0]);
			let recentChange = parseFloat(row[1],10)
			RecentChanges.push(parseFloat(recentChange.toFixed(2)));
			let SCZSChange = parseFloat(row[2],10)
			SCZSChanges.push(parseFloat(SCZSChange.toFixed(2)));
			let relativeMarketChange = recentChange-SCZSChange
			relativeMarketChange = parseFloat(relativeMarketChange.toFixed(2));
			RelativeMarketChanges.push(relativeMarketChange)
		});
		this.setState({
			data:{
				Cycles:Cycles,
				RecentChanges:RecentChanges,
				SCZSChanges:SCZSChanges,
				RelativeMarketChanges:RelativeMarketChanges
			}
		});
	}

	//生成报表配置
	makeChartConfig(){
		let config = {
            chart: {
                height:360,
		        type: 'column'
		    },
		    title: {
		        text: '股价表现'
		    },
		    xAxis: {
		        categories: this.state.data.Cycles
		    },
			yAxis: {
				title: {
					text: ''
				},
				labels: {
					format: '{value}%',
				}
			},
		    series: [{
		        name: '近期涨跌幅',
		        data: this.state.data.RecentChanges
		    }, {
		        name: '深成指数涨跌幅',
		        data: this.state.data.SCZSChanges
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

    //获取状态
    getChangeStatus(recentChange){
    	if(recentChange<0){
    		return "下跌";
		}else if(recentChange===0){
			return "横盘";
		}else{
			return "上涨";
		}
    }

    //分析结果
	renderAnalysis(){
		let relativeMarketChanges = this.state.data.RelativeMarketChanges;
		let relativeMarketChange24 = relativeMarketChanges[4];
		let rangeIndex24 = Common.getRange(this.marketContrastRange,relativeMarketChange24);
		let content = "过去2年"+this.marketContrastRange[rangeIndex24].name+relativeMarketChange24+"%，";
		let relativeMarketChange3 = relativeMarketChanges[1];
		let rangeIndex3 = Common.getRange(this.marketContrastRange,relativeMarketChange3);
		content += "最近3个月"+this.marketContrastRange[rangeIndex3].name+relativeMarketChange3+"%，";
		//对比
		let contrast = "";
		if(rangeIndex24===rangeIndex3){
			contrast += "持续"+this.marketContrastRange[rangeIndex3].name;
		}else{
			contrast += "由"+this.marketContrastRange[rangeIndex24].name+"切换为"+this.marketContrastRange[rangeIndex3].name;
		}
		content += contrast+"，";
		let recentChange24 = this.state.data.RecentChanges[4];
		let changeStatus24 = this.getChangeStatus(recentChange24);
		content += "过去2年累计"+changeStatus24+recentChange24+"%，";
       	let recentChange3 = this.state.data.RecentChanges[1];
		let changeStatus3 = this.getChangeStatus(recentChange3);
		content += "最近3个月累计"+changeStatus3+Math.abs(recentChange3)+"%，";
		//对比
		if(changeStatus24===changeStatus3){
			contrast = "保持"+changeStatus24;
		}else{
			contrast = "由"+changeStatus24+"转换为"+changeStatus3;
		}
		content += contrast+"，";
		content += "就目前趋势判断，股价处于短期、中期、长期移动平均线之上，短期穿越中期，短期上涨概率高，中长期没有明显趋势倾向，震荡调整概率高。";
        return (
            <div className="analysis-bar" style={{backgroundImage:"url("+blueBar+")",height:"360px"}}>
                <div className="ui container">
                    <img src={quotes} className="analysis-symbol" alt="" />
                    <div className="analysis-title">总结解析:<br />{content}</div>
                    <div className="analysis-score" style={{paddingTop:"84px"}}>评分:<span className="analysis-score-v">{this.score}</span><span className="analysis-score-a">分</span></div>
                </div>
            </div>
        );
    }

	render(){
		if(!this.state.data.Cycles || !this.props.data.scores || !this.props.data.assessScore){
			return <div></div>;
		}
		this.score = Common.sum(this.props.data.scores)+this.props.data.assessScore;
		let renderChart = this.renderChart();
		let analysisResult = this.renderAnalysis();
		this.props.onCollectTrend(this.score);
		return (
            <div className="bg-color-white" style={{display:"none"}}>
                <div className="ui container risk-container">
					<TabScore name="总结" value={this.score} />
					<div className="charts-size">
					   {renderChart}
                    </div>
	      	    </div>
	      	    {analysisResult}
            </div>
		);
	}
}

export default trend;