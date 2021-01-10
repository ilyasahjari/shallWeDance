import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import AddEvent from '../events/AddEvent'
import Accueil from '../Accueil'
import UpdateEvent from '../events/UpdateEvent'
import AllEvents from '../events/AllEvents'
import MessgeError from '../MessageError'

const AppRouter = () => {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/" exact component={Accueil} />
                    <Route path="/allEvents" component={AllEvents} />
                    <Route path="/addEvent" component={AddEvent} />
                    <Route path="/updateEvent/:eventId" component={UpdateEvent} />
                    <Route component={MessgeError} />
                </Switch>
            </Router>
        </div>
    );
}

export default AppRouter;