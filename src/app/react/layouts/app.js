import routes from './../../routes'
import { Route, Switch } from "react-router-dom"
import React, { Component, Fragment } from "react"
import { withCookies, Cookies } from 'react-cookie'
import { instanceOf } from 'prop-types';

class SSR extends Component {
    asyncBootstrap(){
        if(this.props.ssr){
            //Get action from action creator
            if(typeof this.props.route.prefetch === 'undefined') {return true}
            const prefetchAction  = this.props.route.prefetch()
            const dispatch  = this.props.dispatch
            return dispatch(prefetchAction).then(() => {return true}).catch((err) => {console.log(err); return false;})
        } else {
            return true
        }
    }

    render(){
        let Component = this.props.route.component;
        return <Component  {...this.props} {...this.state}/>
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo:{}
        };
    }
    componentWillMount(){
        let userInfo = this.props.cookies.get('userInfo');
        if(typeof userInfo !== 'undefined'){
            this.setState({
                userInfo: userInfo
            })
        }
    }
    render(){
        const reactRoute = routes.map((route, index) => (
            <Route exact key={index} path={route.path} render={ (routeProps) => (
                <SSR {...this.props} {...this.state} {...routeProps} route={route}/>
            )}/>
        ));

        return(
             <Switch>
                 {reactRoute}
             </Switch>
        )
    }
}

App.propTypes = {
    cookies: instanceOf(Cookies).isRequired
};

export default (withCookies(App));
