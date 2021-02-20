/**
 * 页面路由
 * @author
 * @create
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Buy from '../pages/buy/buy.tsx';
import Burn from '../pages/burn/burn.tsx';
import Mine from '../pages/mine/mine.tsx';
import Management from '../pages/management/management.tsx';

export class PagesRouter extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/buy" component={Buy} />
                <Route exact path="/burn" component={Burn} />
                <Route exact path="/mine" component={Mine} />
                <Route
                    exact
                    path="/admin_v1/management"
                    component={Management}
                />
            </Switch>
        );
    }
}
