import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";

import AuthContext from "../../context/auth-context";

const mainNavigation = props => {
  return (
    <AuthContext.Consumer>
      {context => {
        return (
          <header className="main-navigation">
            <div className="main-navitagion__logo">
              <h1>EasyEvent</h1>
            </div>
            <nav className="main-navigation__items">
              <ul>
                {!context.token && (
                  <li>
                    <NavLink to="/auth">Login</NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/events">Events</NavLink>
                </li>
                {context.token && (
                  <>
                    <li>
                      <NavLink to="/bookings">Bookings</NavLink>
                    </li>
                    <li>
                      <button onClick={context.logout}>Logout</button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default mainNavigation;
