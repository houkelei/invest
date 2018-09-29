/*
    增长速度-净利润
*/

import React, { Component } from 'react';
import Highcharts from 'react-highcharts';

import Common from '@/js/utils/common';
import TabScore from '@/js/component/tab/score';

import '@/lib/semantic/dist/semantic.min.css';
import '@/css/app/fiveelement/growthspeed.css';

import greenBar from '@/img/analysis/green.png';
import quotes from '@/img/analysis/quotes.png';

class growthspeed extends Component{

	constructor(props){ 
		super(props);
        this.weight = 15;
        this.score = 0;
        this.assessDes = "";
        this.growthYears = [5,2,1];
        this.volatilityYears = [5,2];
        this.fields = ["年度","归母净利润","增长率","波动率"];
        this.netMarginGrowthRange = {0:{name:"负增长",score:3},10:{name:"低速增长",score:7},20:{name:"中速增长",score:9},30:{name:"中高速增长",score:11},50:{name:"高速增长",score:13},999:{name:"爆发式增长",score:15}};
        this.netMarginVolatilityRange = {15:{name:"低波动率",score:15,des:"利润收益非常稳定"},25:{name:"中低波动率",score:13,des:"利润收益稳定"},35:{name:"中波动率",score:10,des:"利润收益不稳定"},999:{name:"高波动率",score:7,des:"利润收益很不稳定"}};
        //未来净利润增录
        this.futureNetMarginGrowth = 0;
        //净利润分析
        this.netMarginAnalysisContent = [];
        //roe分析
        this.roeAnalysisContent = [];
        //增长速度权重
        this.weights = [80,20];
        //增长速度分数
        this.growupSpeedScores = [];
    }

	//生成报表配置
	makeChartConfig(){
		let config = {
            chart: {
                height:360,
                zoomType: 'xy',
                backgroundColor: 'rgba(0,0,0,0)',
            },
            title: {
                text: ''
            },
            // subtitle: {
            //     text: 'Source: leo.com'
            // },
            xAxis: [{
                categories: this.props.data.Years,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                min: -40,
                title: {
                    text: '增长率',
                    style: {
                        color: "#3a3a3f",
                    }
                },
                labels: {
                    format: '{value} %',
                    style: {
                        color: "#3a3a3f",
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: '归母净利润 (亿)',
                    style: {
                        color: "#70ace9",
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: "#70ace9",
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            plotOptions: {
                spline: {
                    lineWidth: 4,
                    states: {
                        hover: {
                            lineWidth: 5
                        }
                    },
                    marker: {
                        enabled: false
                    },
                }
            },
            series: [{
                name: '归母净利润',
                type: 'column',
                yAxis: 1,
                data: this.props.data.GMNetMargins,
                tooltip: {
                    valueSuffix: '亿'
                }

            }, {
                name: '增长率',
                type: 'line',
                data: this.props.data.GMNetMarginGrowthRates,
                tooltip: {
                    valueSuffix: '%'
                }
            }]
        };
        return config;
	}

    //表
    renderTable(){
        return (
            <table className="ui compact celled unstackable table text-center">
                {this.renderThead()}
                {this.renderTbody()}
            </table>
        );
    }

	//表头
	renderThead(){
		return (
			<thead>
				<tr className="center aligned thead">
					{
						this.fields.map((field,i) => (
							<th key={i} style={{color:'#676667'}}>{field}</th>
						))
					}
				</tr>
			</thead>
		);
	}

	//表内容
	renderTbody(){
		return (
			<tbody>
				{
					this.props.data.Years.map((year,i) => (
						<tr className="center aligned tbody" key={i}>
							<td>{year}</td>
							{
								this.props.data.GMNetMargins[i]>=0 ? <td className="plus">{this.props.data.GMNetMargins[i]}%</td> : <td className="minus">{this.props.data.GMNetMargins[i]}%</td>
							}
							{
								this.props.data.GMNetMarginGrowthRates[i]>=0 ? <td className="plus">{this.props.data.GMNetMarginGrowthRates[i]}%</td> : <td className="minus">{this.props.data.GMNetMarginGrowthRates[i]}%</td>
							}
							{
								this.props.data.GMNetMarginVolatilitys[i]>=0 ? <td className="plus">{this.props.data.GMNetMarginVolatilitys[i]}%</td> : <td className="minus">{this.props.data.GMNetMarginVolatilitys[i]}%</td>
							}
					    </tr>
					))
				}
		  	</tbody>
		);
	}

    //报表
    renderChart(){
        let config = this.makeChartConfig();
        return (
            <Highcharts config={config} ></Highcharts>
        );
    }

    //获取近几年净利润复合增长
    getCompoundGrowth(years){
        var gmNetMargins = this.props.data.GMNetMargins;
        var y = gmNetMargins.length;
        var v = ((Math.pow((gmNetMargins[y-1]/gmNetMargins[y-1-years]),1/years)-1)*100).toFixed(2);
        return parseFloat(v);
    }

    //获取近几年归母净利润波动率
    getVolatilityRateAvg(years){
        if(!years){
            years = this.props.data.GMNetMarginVolatilitys.length;
        }
        let self = this;
        let res = 0;
        let i = 0;
        this.props.data.GMNetMarginVolatilitys.forEach(function(gmNetMarginVolatility,index){
            i++;
            if(i<=self.props.data.GMNetMarginVolatilitys.length-years){
                return
            }
            res += gmNetMarginVolatility;
        });
        res=res/years;
        res=res.toFixed(2);
        return parseFloat(res);
    }

	//分析结果
	renderAnalysis(){
        this.score = 0;
        let compoundGrowth5 = this.getCompoundGrowth(5);
        let compoundGrowth2 = this.getCompoundGrowth(2);
        var content = "净利润近5年复合增长"+compoundGrowth5+"%，过去2年净利润复合增长"+compoundGrowth2+"%，";
        let rangeIndex = 0;
        let rangeIndexA = Common.getRange(this.netMarginGrowthRange, compoundGrowth5);
        let rangeIndexB = Common.getRange(this.netMarginGrowthRange, compoundGrowth2);
        //未来3年净利润增速
        this.futureNetMarginGrowth = Common.getMiddleValue(this.netMarginGrowthRange,rangeIndexB);
        rangeIndex = rangeIndexA===rangeIndexB?rangeIndexA:rangeIndexB;
        this.score += this.netMarginGrowthRange[rangeIndex].score*this.weights[0]/100;
        let des = "";
        if(rangeIndexA===rangeIndexB){
            des = "净利润增速保持"+this.netMarginGrowthRange[rangeIndex].name+"，";
        }else{
            des = "净利润增速由"+this.netMarginGrowthRange[rangeIndexA].name+"切换为"+this.netMarginGrowthRange[rangeIndexB].name+"，";
        }
        content += des;
        //评估描述
        this.assessDes += des;
        this.assessDes += "以"+this.netMarginGrowthRange[rangeIndexB].name+"区间为样本，";
        this.assessDes += "我们取中间值"+this.futureNetMarginGrowth+"%作为未来3年的净利润增速。";
        let volatilityRateAvg5 = this.getVolatilityRateAvg(5);
        let volatilityRateAvg2 = this.getVolatilityRateAvg(2);
        rangeIndexA = Common.getRange(this.netMarginVolatilityRange, volatilityRateAvg5);
        rangeIndexB = Common.getRange(this.netMarginVolatilityRange, volatilityRateAvg2);
        rangeIndex = rangeIndexA===rangeIndexB?rangeIndexA:rangeIndexB;
        this.score += this.netMarginVolatilityRange[rangeIndex].score*this.weights[1]/100
        if(rangeIndexA===rangeIndexB){
            content += "净利润增速保持"+this.netMarginVolatilityRange[rangeIndex].name;
        }else{
            content += "净利润增速由"+this.netMarginVolatilityRange[rangeIndexA].name+"切换为"+this.netMarginVolatilityRange[rangeIndexB].name;
        }
        content += "，"+this.netMarginVolatilityRange[rangeIndex].des;
        content += "。以"+this.netMarginVolatilityRange[rangeIndexB].name+"作为未来的增长区间，我们给予"+this.score+"分的加权评分。";
        return (
            <div className="analysis-bar" style={{backgroundImage:"url("+greenBar+")"}}>
                <div className="ui container">
                    <img src={quotes} className="analysis-bsymbol" alt="" />
                    <div className="analysis-title">增长速度解析:<br />{content}</div>
                    <div className="analysis-score">评分:<span className="analysis-score-v">{this.score}</span><span className="analysis-score-a">分</span></div>
                </div>
            </div>
        );
    }

	render(){
        this.assessDes = "";
        // let renderTable = this.renderTable();
        let renderChart = this.renderChart();
        let analysisResult = this.renderAnalysis();
        this.props.onCollectInfo(this.score,Common.convertToPercent(this.score,this.weight,2),{futureNetMarginGrowth:this.futureNetMarginGrowth,des_growthSpeed:this.assessDes});
		return (
            <div className="bg-color-green">
                <br /><br />
                <div className="ui container">
					<TabScore name="增长速度" value={this.score} type="growthspeed" />
                    <div className="charts-size">
					   {renderChart}
                    </div>
	      	    </div>
                {analysisResult}
            </div>
		);
	}
}

export default growthspeed;