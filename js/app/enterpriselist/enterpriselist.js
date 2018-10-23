import React, { Component } from 'react';
import $ from 'jquery';
import { Link,withRouter } from 'react-router-dom'

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

import config from '@/js/config/config';

import '@/lib/semantic/dist/semantic.min.css';
import '@/css/app/enterpriselist/enterpriselist.css';

class enterpriselist extends Component{

	constructor(props){
		super(props);
		this.enterprises="";
	}

	componentWillMount() {
		let url = config.getWebUrl();
		let args = {
            mode:'EnterpriseList',
            func:'GetEnterpriseList',
            args:""
        };
		let self = this;
		$.ajax({ 
			type : "post",
			url : url,
			data : args,
			async : false,
			success : function(data){
				self.enterprises=data.Enterprises;
			} 
        });
	}

	handle(e){
	}

	edit(e,linkAddr){
		e.preventDefault();
		this.props.history.push(linkAddr);
	}

	release(e){
		e.preventDefault();
		let self = $(e.target);
		if(self.html()==="发布"){
			self.html("已发布")
		}else{
			self.html("发布")
		}
	}

	delete(e,name){
		e.preventDefault();
		confirmAlert({
	      	title: '删除财报',
	      	message: '确定要删除 "'+name+'" 的财报吗！',
	      	buttons: [
		        {
		          	label: '确定',
		          	onClick: () => alert('录数据不容易啊')
		        },
		        {
		          	label: '取消',
		        }
	      	]
	    })
	}

	createRow(enterprise,i){
		let arr = enterprise.split("$");
		let id = arr[0];
		let name = arr[1];
		let releaseTime = arr[2];//2018年10月1日
		let data = JSON.stringify({id:id,mode:"S"});
		let linkAddr = `/enterpriseshow/${data}`;
		data = JSON.stringify({id:id,mode:"E"});
		let linkAddrEdit = `/enterpriseshow/${data}`;
		let img = <img alt="" src={require('@/img/app/enterpriselist/img_'+id+'.png')} className="enterpriselist-img" />;
		return (
			<div key={i} style={{padding:"10px"}}>
				<Link to={linkAddr} onClick={(e)=>{this.handle(e)}} >
					<div className="enterpriselist-left">
						{name}
						<br />
						<span className="enterpriselist-data">{releaseTime}</span>
						<br />
						<div onClick={(e)=>{this.edit(e,linkAddrEdit)}} className="enterpriselist-admin" >编辑</div>
						<div onClick={(e)=>{this.release(e)}} className="enterpriselist-admin" >发布</div>
						<div onClick={(e)=>{this.delete(e,name)}} className="enterpriselist-admin" >删除</div>
					</div>
					<div className="enterpriselist-right">
						{img}
					</div>
				</Link>
				<br />
				<div className="enterpriselist-h"></div>
			</div>
		);
	}

	render(){
		let enterprises = this.enterprises.split("|");
		return (
			<div className="ui container enterpriselist-container">
				{
					enterprises.map((enterprise,i)=>(
						 this.createRow(enterprise,i)
					))
				}
			</div>
		);
	}

}

export default withRouter(enterpriselist);