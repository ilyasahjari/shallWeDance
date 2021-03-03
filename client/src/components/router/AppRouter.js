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
import UsersProfile from '../profil/UsersProfile'
import CreatedEvents from '../events/CreatedEvents'
import Profile from '../profil/Profile'
import AllGroupes from "../groupes/AllGroupes";
import AddGroupe from "../groupes/AddGroupe";
import UpdateGroupe from "../groupes/UpdateGroupe";
import ListMembres from "../groupes/ListMembres";
import EditProfil from '../profil/EditProfile'
import CancelEvent from '../events/CancelEvent'
import DeleteEvent from '../events/DeleteEvent'
import ParticipateEvents from '../events/ParticipateEvents'
import AddDanseType from '../events/AddDanseType'

const AppRouter = () => {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register} />
                    <PrivateRoute path="/addDanseType" component={AddDanseType}/>
                    <PrivateRoute path="/" exact component={Accueil} />
                    <PrivateRoute path="/allEvents" component={AllEvents} />
                    <PrivateRoute path="/profile/:userId" component={UsersProfile}/>
                    <PrivateRoute path="/createdEvents" component={CreatedEvents} />
                    <PrivateRoute path="/addEvent" component={AddEvent} />
                    <PrivateRoute path="/updateEvent/:eventId" component={UpdateEvent} />
                    <PrivateRoute path="/seeEvent/:eventId" component={SeeEvent} />
                    <PrivateRoute path="/cancelEvent/:eventId" component={CancelEvent} />
                    <PrivateRoute path="/deleteEvent/:eventId" component={DeleteEvent} />
                    <PrivateRoute path= "/editprofile" component={EditProfil}/>
                    <PrivateRoute path="/participateEvents" component={ParticipateEvents} />
                    <PrivateRoute path="/profile" component={Profile}/>
                    <PrivateRoute path="/groupes" component={AllGroupes}/>
                    <PrivateRoute path="/addGroupe" component={AddGroupe}/>
                    <PrivateRoute path="/updateGroupe/:groupeId" component={UpdateGroupe}/>
                    <PrivateRoute path="/listMembres/:groupeId" component={ListMembres}/>
                    <PrivateRoute component={MessgeError} />
                </Switch>
            </Router>
        </div>
    );
}

export default AppRouter;
