/**
 * 全局路由
 * @author
 * @create
 */

import * as React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import DdRoute from './app.layout';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

export class AppRoute extends React.Component {
    render() {
        return (
            <Router history={history}>
                <div style={{ height: '100%' }}>
                    <Switch>
                        <Route
                            path="/"
                            render={() => {
                                return <Redirect to="/buy" />;
                            }}
                            exact={true}
                        />
                        <Route basename="/dd" component={DdRoute} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default AppRoute;
