import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import AddEvent from './AddEvent'
import Accueil  from './Accueil'
import UpdateEvent from './UpdateEvent'
import AllEvents from './AllEvents'
import SeeEvent from './SeeEvent'


function App() {
  return (
    <div className="App">
    <Router>
      <Route path="/" exact component={Accueil}/> 
      <Route path="/allEvents" exact component={AllEvents}/>
      <Route path="/addEvent" exact component={AddEvent}/> 
      <Route path="/updateEvent/:eventId" exact component={UpdateEvent}/>
      <Route path="/seeEvent/:eventId" exact component={SeeEvent}/>
    </Router>
  </div>
  );
}

export default App;
