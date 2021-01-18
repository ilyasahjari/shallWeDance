import React, {useState, useEffect} from 'react'
import {Redirect, Route} from 'react-router-dom'
import Accueil from '../Accueil'
import { getCurrentUser } from '../services/auth.service'


const PrivateRoute = ({ component: Component, ...rest }) => {

    return (
        <Route
            {...rest}
            render={props =>
                getCurrentUser() ? (
                    <div>
                        <Accueil/>
                        <Component {...props} />
                    </div>
                ) : (
                        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                    )
            }
        />
    )
}

export default PrivateRoute;
