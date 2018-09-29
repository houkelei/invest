import React, { Component } from 'react';
import '@/lib/semantic/dist/semantic.min.css';

import Enterprise from './app/enterprise/enterprise';
import FiveElementScore from './app/fiveelementscore/fiveelementscore';
import AssessScore from './app/assessscore/assessscore';
import Summarize from './app/summarize/summarize';
// import Weight from './app/weight';
import FiveElement from './app/fiveelement/fiveelement';
import Assess from './app/assess/assess';
import Trend from './app/trend/trend';
import Grade from './app/grade/grade';

class main extends Component{

	constructor(props){
		super(props);
        this.data={};
	}

	onCollectEnterprise(data){
		this.data.weights=data.weights;
		this.data.stockName=data.stockName;
	}

	onCollectFiveElement(scores,scoreTrims,info){
		this.data.scores=scores;
		this.data.scoreTrims=scoreTrims;
		this.data.info=info;
		setTimeout(this.onFiveElementScoreShow.bind(this),1);
	}

	onCollectAssess(assessScore,assessDes){
		this.data.assessScore=assessScore;
		this.data.assessDes=assessDes;
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
		// <Weight data={this.data} />
		return (
			<div>
				<Enterprise onCollectEnterprise={this.onCollectEnterprise.bind(this)} />
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

export default main;