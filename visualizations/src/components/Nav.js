import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

// import { } from './components';
//
// import { } from './styles';
//
// import { } from './store/actions';

class Nav extends Component {

  componentDidMount() { }

  clickHandler = async () => { };

  render() {

    return (
        <div>
          <nav>
            <NavLink to='/'>LandingPage</NavLink>
            <NavLink to='/data'>DataPage</NavLink>
          </nav>
        </div>
    );
  }
}

const mapStateToProps = state => ({ });

export default connect(mapStateToProps,{  })(withRouter(Nav));
