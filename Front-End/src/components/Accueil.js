import React from 'react';
import {logout} from './services/auth.service'
import {useHistory} from 'react-router-dom'

const Accueil=(props)=> {
  
  const history = useHistory();

  const handleLogout = async(e)=>{
    e.preventDefault();
    try{
      logout()
      history.push('/login')
    }catch(e){
      console.log(e);
    }
  }

  return (
    <div className="App">
      <p> Bienvenue </p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}


export default Accueil;
