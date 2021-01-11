import React from 'react';
import {logout} from './services/auth.service'

const Accueil=(props)=> {
  
  const handleLogout = async(e)=>{
    e.preventDefault();
    try{
       logout()
      props.history.push('/login');
      window.location.reload();
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
