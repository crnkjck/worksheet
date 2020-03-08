import React from 'react';
import { NavLink} from 'react-router-dom';


const SignedInLinks = () => {
    return(
       <ul className="right">
           <li><NavLink to = '/todocreate'>New ToDo</NavLink></li>
           <li><NavLink to = '/'>Debts</NavLink></li>
           <li><NavLink to = '/' className="btn btn-floating pink lighten-1">PKMN</NavLink></li>

       </ul>
    )
}

export default SignedInLinks;