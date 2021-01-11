import React from 'react';
import {logout} from './services/auth.service'

function App(props) {
  const handleLogout =async()=>{
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


export default App;
