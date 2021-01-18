import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import AddEvent from '../events/AddEvent'
import SeeEvent from '../events/SeeEvent'
import Accueil from '../Accueil'
import UpdateEvent from '../events/UpdateEvent'
import AllEvents from '../events/AllEvents'
import MessgeError from '../MessageError'
import Login from '../users/Login'
import PrivateRoute from './PrivateRoute'
import Register from '../users/Register'
import CreatedEvents from '../events/CreatedEvents'

const AppRouter = () => {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register} />
                    <PrivateRoute path="/" exact component={Accueil} />
                    <PrivateRoute path="/allEvents" component={AllEvents} />
                    <PrivateRoute path="/createdEvents" component={CreatedEvents} />
                    <PrivateRoute path="/addEvent" component={AddEvent} />
                    <PrivateRoute path="/updateEvent/:eventId" component={UpdateEvent} />
                    <PrivateRoute path="/seeEvent/:eventId" component={SeeEvent} />
                    <PrivateRoute component={MessgeError} />
                </Switch>
            </Router>
        </div>
    );
}

export default AppRouter;
