import React from "react"
import { useHistory } from 'react-router-dom'
import { logout } from './services/auth.service'
import image from '../images/logo.jpg'


const Header = () => {

    const history = useHistory();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            logout()
            history.push('/login')
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <div>
            <nav>
                <div className="nav-wrapper white">
                    <ul id="nav-mobile" className="left">
                        <a href="/allEvents">
                            <img className='imgLogo'
                                src={image} />
                        </a>
                    </ul>

                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a href="/profile">Account</a></li>
                        <li><a href="collapsible.html">Inbox</a></li>
                        <li><a onClick={handleLogout}>SignOut</a></li>
                    </ul>

                </div>
            </nav>
        </div>
    )
}

export default Header;