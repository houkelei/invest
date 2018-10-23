import React, { Component } from 'react';
import '@/lib/semantic/dist/semantic.min.css';

import Enterprise from '@/js/app/enterprise/enterprise';
import FiveElementScore from '@/js/app/fiveelementscore/fiveelementscore';
import AssessScore from '@/js/app/assessscore/assessscore';
import Summarize from '@/js/app/summarize/summarize';
import FiveElement from '@/js/app/fiveelement/fiveelement';
import Assess from '@/js/app/assess/assess';
import Trend from '@/js/app/trend/trend';
import Grade from '@/js/app/grade/grade';

class enterpriseshow extends Component{

	constructor(props){
		super(props);
		var data = JSON.parse(this.props.match.params.data);
		var {id,mode} = data;
        this.data={
        	enterpriseid:id,
        	mode:mode
        };
	}

	onCollectEnterprise(data){
		this.data.weights=data.weights;
		this.data.stockName=data.stockName;
		this.data.shares=data.shares;
	}

	onCollectFiveElement(scores,scoreTrims,info){
		this.data.scores=scores;
		this.data.scoreTrims=scoreTrims;
		this.data.info=info;
		setTimeout(this.onFiveElementScoreShow.bind(this),1);
	}

	onCollectAssess(assessScore,assessDes,analysisResult){
		this.data.assessScore=assessScore;
		this.data.assessDes=assessDes;
		this.data.analysisResult=analysisResult;
		setTimeout(this.onAssessScoreShow.bind(this),1);
	}

	onCollectTrend(lastScore){
		this.data.lastScore=lastScore;
		setTimeout(this.onSummarizeShow.bind(this),1);
	}

	onFiveElementScoreRef = (ref) => {
        this.fiveElementScoreChild = ref
    }

	onFiveElementScoreShow(){
		this.fiveElementScoreChild.show(this.data);
	}

	onAssessScoreRef = (ref) => {
        this.asessScoreChild = ref
    }

	onAssessScoreShow(){
		this.asessScoreChild.show(this.data);
	}

	onSummarizeRef = (ref) => {
        this.summarizeChild = ref
    }

	onSummarizeShow(){
		this.summarizeChild.show(this.data);
	}


	render(){
		return (
			<div>
				<Enterprise data={this.data} onCollectEnterprise={this.onCollectEnterprise.bind(this)} />
				<FiveElementScore data={this.data} onRef={this.onFiveElementScoreRef} />
				<AssessScore data={this.data} onRef={this.onAssessScoreRef} />
				<Summarize data={this.data} onRef={this.onSummarizeRef} />
				<FiveElement data={this.data} onCollectFiveElement={this.onCollectFiveElement.bind(this)} />
				<Assess data={this.data} onCollectAssess={this.onCollectAssess.bind(this)} />
				<Trend data={this.data} onCollectTrend={this.onCollectTrend.bind(this)} />
				<Grade data={this.data} />
			</div>
		)
	}

}

export default enterpriseshow;