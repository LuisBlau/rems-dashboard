/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useMsal } from '@azure/msal-react'

const UserContext = React.createContext()

export const UserContextProvider = (props) => {
  const [userRoles, setUserRoles] = useState(null)
  const [userRetailers, setUserRetailers] = useState(null)
  const [currentPage, setCurrentPage] = useState('')
  const { accounts } = useMsal()
  const username = accounts.length > 0 ? accounts[0].username : ''

  const getRoles = async () => {
    const u = await axios.get('/api/REMS/getUserDetails?email=' + username).then(resp => resp.data.role || null)
    if (u) {
      setUserRoles(u)
    }
    setUserRoles(u)
    setCurrentPage(props.pageName)
  }

  const getRetailers = async () => {
    const u = await axios.get('/api/REMS/getUserDetails?email=' + username).then(resp => resp.data.retailer || null)
    if (u) {
      setUserRetailers(u)
    }
    setCurrentPage(props.pageName)
  }

  useEffect(() => {
    if (!userRoles) {
      getRoles()
    }
    if (!userRetailers) {
      getRetailers()
    }
  }, [getRoles, getRetailers, userRoles])

  if (props.pageName !== currentPage) {
    setCurrentPage(props.pageName)
  }

  return (
    <UserContext.Provider value={{ getRoles, userRoles, currentPage, userRetailers }}>
      {props.children}
    </UserContext.Provider>
  )
}

export const UserConsumer = UserContext.Consumer
export default UserContext
