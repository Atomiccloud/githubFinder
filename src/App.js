import './App.css'
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Component } from 'react'
import Navbar from './components/layout/Navbar'
import Users from './components/users/Users'
import axios from 'axios'
import Search from './components/users/Search'
import Alert from './components/layout/Alert'
import About from './components/pages/About'

class App extends Component {
  state = {
    users: [],
    loading: false,
    alert: null,
  }

  searchUsers = async (text) => {
    this.setState({ loading: true })

    const github = axios.create({
      baseURL: 'https://api/github.com',
      timeout: 1000,
      headers: { Authorization: process.env.REACT_APP_GITHUB_TOKEN },
    })

    const res = await github.get(
      `https://api.github.com/search/users?q=${text}`
    )
    this.setState({ users: res.data.items, loading: false })
  }

  clearUsers = () => {
    this.setState({ users: [], loading: false })
  }

  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } })
    setTimeout(() => this.setState({ alert: null }), 3000)
  }

  render() {
    const { users, loading } = this.state

    return (
      <Router>
        <div className='App'>
          <Navbar />
          <div className='container'>
            <Alert alert={this.state.alert} />
            <Switch>
              <Route
                exact
                path='/'
                render={(props) => (
                  <>
                    <Search
                      searchUsers={this.searchUsers}
                      clearUsers={this.clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={this.setAlert}
                    />
                    <Users loading={loading} users={users} />
                  </>
                )}
              />
              <Route exact path='/about' component={About} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App
