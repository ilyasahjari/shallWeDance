import '../../css/profil.css'
import React from "react"

const Header = () => {
    return (
        <div>
            <nav>
                <div className="nav-wrapper white">
                    {/* <a href="#">
                        <img style={{margin:"10px",height:'80%', height:'80%',borderRadius:"30px",borderWidth:"10px"}}
                        src={image}/>
                    </a> */}
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a href="sass.html">Account</a></li>
                        <li><a href="collapsible.html">Inbox</a></li>
                        <li><a href="collapsible.html">SignOut</a></li>

                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Header;