import React, { Fragment } from "react";
import { connect } from "react-redux";
import api from "../../apiurl";
import { Select, Spin, Empty } from 'antd';
import querystring from 'querystring';
import { tokenConfig } from "./../../actions/accounts/usermanagement/auth";
import { store } from '../../index.js';

const { Option } = Select;

let timeout;

function fetch(value, callback) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    //currentValue = value;

    function fake() {
        const str = querystring.encode({
            code: 'utf-8',
            q: value,
        });
        api
            .get(`http://127.0.0.1:8000/api/v1/users/?${str}`, tokenConfig(store.getState))
            .then(res => {
                const data = [];
                res.data.results.forEach(r => {
                    data.push({
                        value: r["username"],
                        text: r["username"],
                    });
                });
                callback(data);
            });
    }

    timeout = setTimeout(fake, 300);
}

export class SearchSelectUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: undefined,
            fetching: false
        };
        
    }
    componentDidMount = () =>{
        if(this.props.selectedUser){
            this.setState({value : this.props.selectedUser});
        }
    }
    handleSearch = value => {
        if (value) {
            this.setState({ fetching: true });
            fetch(value, data => {
                this.setState({ data });
                this.setState({ fetching: false });
            });
        } else {
            this.setState({ data: [] });
        }

    };

    handleChange = value => {
        this.setState({ value });
        if(this.props.getSelectedUser){
            this.props.getSelectedUser(value);
        }
    };

    render() {
        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
        return (
            <Select
                showSearch
                value={this.state.value}
                placeholder="Type username to search"
                defaultActiveFirstOption={true}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                notFoundContent={this.state.fetching ? <Spin size="small" /> : <Empty />}
            >
                {options}
            </Select>
        );
    }
}