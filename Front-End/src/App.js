import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import AddEvent from './AddEvent'
import Accueil  from './Accueil'
import UpdateEvent from './UpdateEvent'


function App() {
  return (
    <div className="App">
    <Router>
      <Route path="/" exact component={Accueil}/> 
      <Route path="/addEvent" exact component={AddEvent}/> 
      <Route path="/updateEvent/:eventId" exact component={UpdateEvent}/>     
    </Router>
  </div>
  );
}

export default App;
