import React, { Component } from 'react';

import '@/lib/semantic/dist/semantic.min.css';
import '@/css/app/fiveelementscore/fiveelementscore.css';

import titlebgLong from '@/img/common/titlebgLong.png';

class fiveelementscore extends Component{

	constructor(props){
		super(props);
		this.state={
			scores:[0,0,0,0,0],
		};
	}

	componentDidMount(){
        this.props.onRef(this);
    }

	show(){
		this.setState({scores:this.props.data.scoreTrims});
	}

	render(){
		let scores = this.state.scores;
		return (
			<div className="fiveelementscore-bg"> 
				<div className="ui container fiveelementscore-container">
					<br /><br />
					<div className="fiveelementscore-title" style={{backgroundImage:"url("+titlebgLong+")"}}>
						估值五要素评分
					</div>
					<br/>
					<div className="fiveelementscore-content">
						<div className="ui column grid">
						  	<div className="three wide column fiveelementscore-key" style={{paddingLeft:"5px"}}>增长速度</div>
						  	<div className="ten wide column fiveelementscore-bar-wide" style={{paddingLeft:"0px",paddingRight:"0px"}}>
						  		<div className="fiveelementscore-bar" style={{width:scores[0]+"%",backgroundColor:(parseInt(scores[0],10)>=50?"#50dc73":"#ef7750")}}></div>
						  	</div>
						  	<div className="three wide column fiveelementscore-val" style={{color:(parseInt(scores[0],10)>=50?"#78e395":"#676767")}}>{scores[0]}分</div>

						  	<div className="three wide column fiveelementscore-key" style={{paddingLeft:"5px"}}>增长效率</div>
						  	<div className="ten wide column fiveelementscore-bar-wide" style={{paddingLeft:"0px",paddingRight:"0px"}}>
						  		<div className="fiveelementscore-bar" style={{width:scores[1]+"%",backgroundColor:(parseInt(scores[1],10)>=50?"#50dc73":"#ef7750")}}></div>
						  	</div>
						  	<div className="three wide column fiveelementscore-val" style={{color:(parseInt(scores[1],10)>=50?"#78e395":"#676767")}} >{scores[1]}分</div>

						  	<div className="three wide column fiveelementscore-key" style={{paddingLeft:"5px"}}>ROE</div>
						  	<div className="ten wide column fiveelementscore-bar-wide" style={{paddingLeft:"0px",paddingRight:"0px"}}>
						  		<div className="fiveelementscore-bar" style={{width:scores[2]+"%",backgroundColor:(parseInt(scores[2],10)>=50?"#50dc73":"#ef7750")}}></div>
						  	</div>
						  	<div className="three wide column fiveelementscore-val" style={{color:(parseInt(scores[2],10)>=50?"#78e395":"#676767")}} >{scores[2]}分</div>

						  	<div className="three wide column fiveelementscore-key" style={{paddingLeft:"5px"}}>风险</div>
						  	<div className="ten wide column fiveelementscore-bar-wide" style={{paddingLeft:"0px",paddingRight:"0px"}}>
						  		<div className="fiveelementscore-bar" style={{width:scores[3]+"%",backgroundColor:(parseInt(scores[3],10)>=50?"#50dc73":"#ef7750")}}></div>
						  	</div>
						  	<div className="three wide column fiveelementscore-val" style={{color:(parseInt(scores[3],10)>=50?"#78e395":"#676767")}} >{scores[3]}分</div>

						  	<div className="three wide column fiveelementscore-key" style={{paddingLeft:"5px"}}>增长空间</div>
						  	<div className="ten wide column fiveelementscore-bar-wide" style={{paddingLeft:"0px",paddingRight:"0px"}}>
						  		<div className="fiveelementscore-bar" style={{width:scores[4]+"%",backgroundColor:(parseInt(scores[4],10)>=50?"#50dc73":"#ef7750")}}></div>
						  	</div>
						  	<div className="three wide column fiveelementscore-val" style={{color:(parseInt(scores[4],10)>=50?"#78e395":"#676767")}}>{scores[4]}分</div>


						  	<div className="three wide column" style={{padding:"0px"}}></div>
						  	<div className="ten wide column fiveelementscore-scale" style={{padding:"0px"}}>
						  		<div className="fiveelementscore-hr-h"></div>
						  	</div>
						  	<div className="three wide column" style={{padding:"0px"}}></div>


						  	<div className="three wide column" ></div>
						  	<div className="one wide column fiveelementscore-scale-val" style={{padding:"0px"}}>0</div>
						  	<div className="one wide column fiveelementscore-scale-val" style={{padding:"0px"}}>10</div>
						  	<div className="one wide column fiveelementscore-scale-val" style={{padding:"0px"}}>20</div>
						  	<div className="one wide column fiveelementscore-scale-val" style={{padding:"0px"}}>30</div>
						  	<div className="one wide column fiveelementscore-scale-val" style={{padding:"0px"}}>40</div>
						  	<div className="one wide column fiveelementscore-scale-val" style={{padding:"0px"}}>
						  		50
								<div className="fiveelementscore-dashed-v"></div>
						  	</div>
						  	<div className="one wide column fiveelementscore-scale-val" style={{padding:"0px"}}>60</div>
						  	<div className="one wide column fiveelementscore-scale-val" style={{padding:"0px"}}>70</div>
						  	<div className="one wide column fiveelementscore-scale-val" style={{padding:"0px"}}>80</div>
						  	<div className="one wide column fiveelementscore-scale-val" style={{padding:"0px"}}>90</div>
						  	<div className="one wide column fiveelementscore-scale-val" style={{padding:"0px"}}>100</div>
						  	<div className="two wide column" ></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

export default fiveelementscore;