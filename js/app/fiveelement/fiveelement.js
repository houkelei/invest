/*
	五要素
*/

import React, { Component } from 'react';

import $ from 'jquery';
import Common from '@/js/utils/common';
import GrowthSpeed from './growthspeed';
import GrowthEfficiency from './growthefficiency';
import Roe from './roe';
import Risk from './risk';
import GrowthSpace from './growthspace';
import config from '@/js/config/config';

class fiveelement extends Component{

	constructor(props){
		super(props);
        this.scores = [];
        this.scoreTrims = [];
        this.info = {};
		this.state = {
            data:{}
        };
	}

	componentWillMount() {
		let url = config.getWebUrl();
		let enterpriseID = 2;
		let args = {
            mode:'Profitability',
            func:'ShowProfitability',
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
		let rows = data.EnterpriseData.split("$");
		//数组
		let Years=[],GMNetMargins=[],GMNetMarginGrowthRates=[],ROES=[],TotalAssetGrowthRates=[];
		let NetAssetGrowthRates=[],OpenIncomeGrowthRates=[],NetMargins=[],NetMarginGrowthRates=[],ManageCashNetAmounts=[];
		let InvestCashNetAmounts=[],FinancingAmounts=[],NetAssets=[],LiabilityWithInterestRates=[],GMNetMarginVolatilitys=[];
		let ROEVolatilitys=[],InvestGates=[];
		rows.forEach(function(rowStr){
			let row = rowStr.split("|");
			Years.push(parseInt(row[0],10));
			GMNetMargins.push(parseFloat(row[1],10));
			GMNetMarginGrowthRates.push(parseFloat(row[2],10));
			ROES.push(parseFloat(row[3],10));	
			TotalAssetGrowthRates.push(parseFloat(row[4],10));

			NetAssetGrowthRates.push(parseFloat(row[5],10));
			OpenIncomeGrowthRates.push(parseFloat(row[6],10));
			NetMargins.push(parseFloat(row[7],10));
			NetMarginGrowthRates.push(parseFloat(row[8],10));
			ManageCashNetAmounts.push(parseFloat(row[9],10));

			InvestCashNetAmounts.push(parseFloat(row[10],10))
			FinancingAmounts.push(parseFloat(row[11],10));
			NetAssets.push(parseFloat(row[12],10));
			LiabilityWithInterestRates.push(parseFloat(row[13],10));
			GMNetMarginVolatilitys.push(parseFloat(row[14],10));

			ROEVolatilitys.push(parseFloat(row[15],10));
			InvestGates.push(parseFloat(row[16],10));
		});
		this.setState({
			data:{
				InvestCount:data.InvestCount,
				GrowthSpacePremium:data.GrowthSpacePremium,
				GrowthEfficiencyPremium:data.GrowthEfficiencyPremium,
				CurrentPriceToBook:data.CurrentPriceToBook,
				Years:Years,
				GMNetMargins:GMNetMargins,
				GMNetMarginGrowthRates:GMNetMarginGrowthRates,
				GMNetMarginVolatilitys:GMNetMarginVolatilitys,
				ROES:ROES,
				ROEVolatilitys:ROEVolatilitys,
				TotalAssetGrowthRates:TotalAssetGrowthRates,
				NetAssetGrowthRates:NetAssetGrowthRates,
				OpenIncomeGrowthRates:OpenIncomeGrowthRates,
				NetMargins:NetMargins,
				NetMarginGrowthRates:NetMarginGrowthRates,
				ManageCashNetAmounts:ManageCashNetAmounts,
				InvestCashNetAmounts:InvestCashNetAmounts,
				InvestGates:InvestGates,
				FinancingAmounts:FinancingAmounts,
				NetAssets:NetAssets,
				LiabilityWithInterestRates:LiabilityWithInterestRates
			}
		});
	}

	onCollectInfo(score,scoreTrim,specificInfo){
		this.scores.push(score);
		this.scoreTrims.push(scoreTrim);
		Common.mergeJsonData(this.info,specificInfo);
		if(this.scores.length>=5){
			Common.mergeJsonData(this.info,{currentPriceToBook:this.state.data.CurrentPriceToBook});
			this.props.onCollectFiveElement(this.scores,this.scoreTrims,this.info);
		}
	}

	render(){
		this.scores = [];
        this.scoreTrims = [];
        this.info = {};
		return (
			<div>
				<GrowthSpeed data={this.state.data} onCollectInfo={this.onCollectInfo.bind(this)} />
				<GrowthEfficiency data={this.state.data} onCollectInfo={this.onCollectInfo.bind(this)} />
				<Roe data={this.state.data} onCollectInfo={this.onCollectInfo.bind(this)} />
				<Risk data={this.state.data} onCollectInfo={this.onCollectInfo.bind(this)} />
				<GrowthSpace data={this.state.data} onCollectInfo={this.onCollectInfo.bind(this)} />
			</div>
		);
	}

}

export default fiveelement;