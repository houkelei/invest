import React, { Component } from 'react';
import Highcharts from 'react-highcharts';
import $ from 'jquery';

import config from '@/js/config/config';

import '@/lib/semantic/dist/semantic.min.css';
import '@/css/app/enterprise/enterprise.css';

import logowhite from '@/img/app/enterprise/logowhite.png';
import header from '@/img/app/enterprise/header.png';
import namebg from '@/img/app/enterprise/namebg.png';
import constitute from '@/img/app/enterprise/constitute.png';

class enterprise extends Component{

	constructor(props){
		super(props);
		this.state = {
			data : {}
		};
	}

	componentWillMount() {
		let url = config.getWebUrl();
		let enterpriseID = this.props.data.enterpriseid;
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
                height:360,
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

	title1(){
		return (
			<div className="ui container">
				<div className="ui three column center grid enterprise-container-title">
					<div className="column">
						<img src={logowhite} alt="" className="enterprise-bg-logo" style={{left:"-72px",top:"0px"}} />
					</div>
					<div className="column">
					</div>
					<div className="column">
						<img src={logowhite} alt="" className="enterprise-bg-logo" style={{left:"0px",top:"0px"}} />
					</div>
				</div>
	      	</div>
		);
	}

	title(){
		return (
			<div className="enterprise-container-title" style={{backgroundImage:"url("+header+")"}}>
				<div style={{float:"left",width:"100px"}}>
					<img src={logowhite} alt="" className="enterprise-bg-logo" style={{left:"-72px",top:"0px"}} />
				</div>
				<div style={{float:"right"}}>
					<img src={logowhite} alt="" className="enterprise-bg-logo" style={{left:"80px",top:"120px"}} />
				</div>
	      	</div>
		);
	}

	content2(){
		let config = this.makeChartConfig();
		return (
			<div className="enterprise-bg">
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

	content(){
		// let config = this.makeChartConfig();
		return (
			<div className="enterprise-bg">
				<div className="ui container enterprise-container">
					<div className="ui center grid">
						<div className="eight wide column" style={{"paddingLeft":"0px"}}>
							<div className="enterprise-namebg" style={{backgroundImage:"url("+namebg+")"}}>
				    			<div className="title-name">{this.state.data.stockName}</div>
				    			<div className="title-code">{this.state.data.stockCode}</div>
				    		</div>
				    		<div className="enterprise-info">
				    			<div className="enterprise-key">·所属行业:</div><div className="enterprise-value">{this.state.data.theirTrade}</div>
				    			<div className="enterprise-key">·总股本:</div><div className="enterprise-value">{this.state.data.TotalEquity}亿</div>
				    			<div className="enterprise-key">·当前股价:</div><div className="enterprise-value">{this.state.data.shares}元</div>
				    			<div className="enterprise-key">·总市值:</div><div className="enterprise-value">{this.state.data.marketValue}亿</div>
				    			<div className="enterprise-key">·当前日期:</div><div className="enterprise-value">{this.state.data.nowTime}</div>
				    		</div>
						</div>
						<div className="eight wide column" style={{"paddingLeft":"0px"}}>
							<div className="enterprise-constitute" style={{backgroundImage:"url("+constitute+")"}}>
								<div className="enterprise-constitute-title"><span style={{fontWeight:"bold"}}>——主营构成——</span></div>
								<br />
								{
									this.state.data.constitute.map((item,i)=>(
										<div key={i}>
											<div className="enterprise-constitute-key">● {item.name}</div>
											<div className="enterprise-constitute-value">{item.y}%</div>
										</div>
									))
								}
				    		</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	render(){
		let data = {
			weights:this.state.data.Weights,
			stockName:this.state.data.stockName,
			shares:this.state.data.shares
		}
		this.props.onCollectEnterprise(data);
		return (
			<div>
				{this.title()}
				{this.content()}
			</div>
		);
	}
}

export default enterprise;