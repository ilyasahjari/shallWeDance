import React, {useState, useEffect} from 'react'
import {Redirect, Route} from 'react-router-dom'
import { getCurrentUser } from '../services/auth.service'


const PrivateRoute = ({ component: Component, ...rest }) => {

    return (
        <Route
            {...rest}
            render={props =>
                getCurrentUser() ? (
                    <Component {...props} />
                ) : (
                        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                    )
            }
        />
    )
}

export default PrivateRoute;
