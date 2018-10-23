import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import '@/lib/semantic/dist/semantic.min.css';

import EnterpriseList from '@/js/app/enterpriselist/enterpriselist';
import EnterpriseShow from '@/js/app/enterpriseshow/enterpriseshow';

class main extends Component{

	render(){
		return (
			<Router>
				<div>
					<Route exact path="/" component={EnterpriseList} />
					<Route path="/enterpriseshow/:data" component={EnterpriseShow} />
				</div>
			</Router>
		)
	}

}

export default main;