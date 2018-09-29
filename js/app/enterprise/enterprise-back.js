import React, { Component } from 'react';
import Highcharts from 'react-highcharts';
import $ from 'jquery';

import config from '@/js/config/config';

import '@/lib/semantic/dist/semantic.min.css';
import '@/css/app/enterprise/enterprise.css';

import topBar from '@/img/title/topBar.png';
import wrench from '@/img/title/wrench.png';

class enterprise extends Component{

	constructor(props){
		super(props);
		this.state = {
			data : {}
		};
	}

	componentWillMount() {
		let url = config.getWebUrl();
		let enterpriseID = 1;
		let args = {
            mode:'Enterprise',
            func:'ShowEnterprise',
            args:enterpriseID
        };
		let self = this;
		$.ajax({ 
			type : "post",
			url : url,
			data : args,
			async : false,
			success : function(data){
				self.setState ({
					data : data
				});
			} 
        });
	}

	//生成报表配置
	makeChartConfig(){
		let config = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: '主营构成'
            },
            subtitle: {
                text: 'Source: leo.com'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                        style: {
                            color: 'black'
                        },
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                name: 'Share',
                data: this.state.data.constitute
            }]
        };
        return config;
	}

	title(){
		return (
			<div>
				<div className="ui container title-logo">logo</div>
				<div className="title-topBar" style={{backgroundImage:"url("+topBar+")"}}>
					<div className="ui container title-container">
			      		<div>
			      			<div className="title-name">{this.state.data.stockName}</div>
				      		<img src={wrench} className="title-wrench" alt="" />
				      		<div className="title-info">{this.state.data.theirTrade}</div>
				      		<div className="title-code">{this.state.data.stockCode}</div>
			      		</div>
		      		</div>
				</div>
	      	</div>
		);
	}

	render(){
		let data = {
			weights:this.state.data.Weights,
			stockName:this.state.data.stockName
		}
		this.props.onCollectEnterprise(data);
		let config = this.makeChartConfig();
		return (
			<div>
			{this.title()}
			<div className="ui container enterprise-container">
				<table className="ui compact celled unstackable table">
				 	<thead>
				 		<tr className="center aligned">
				 			<th>股票名称</th><th>股票代码</th><th>所属行业</th><th>总股本</th><th>当前股价</th><th>总市值</th><th>当前日期</th>
				 		</tr>
				 	</thead>
					<tbody>
						<tr className="center aligned">
						  <td>{this.state.data.stockName}</td>
						  <td>{this.state.data.stockCode}</td>
						  <td>{this.state.data.theirTrade}</td>
						  <td>{this.state.data.TotalEquity}</td>
						  <td>{this.state.data.shares}</td>
						  <td>{this.state.data.marketValue}</td>
						  <td>{this.state.data.nowTime}</td>
						</tr>
					</tbody>
				</table>
				<Highcharts config={config}></Highcharts>
			</div>
			</div>
		);
	}
}

export default enterprise;