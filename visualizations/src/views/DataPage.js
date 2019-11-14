import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

// import {  } from '../../store/actions'
//
// import {  } from '../../components'
//
// import {  } from '../../styles'

class DataPage extends Component {

  componentDidMount() { }

  render() {

    return(
      <div>
        <h1>DataPage</h1>
      </div>
    )
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps, { })(withRouter(DataPage))
