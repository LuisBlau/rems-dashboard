/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useMsal } from '@azure/msal-react'

const RoleContext = React.createContext()

export const RoleContextProvider = (props) => {
  const [userRoles, setUserRoles] = useState(null)
  const [currentPage, setCurrentPage] = useState('')
  const { accounts } = useMsal()
  const username = accounts[0].username

  if (props.pageName !== currentPage) {
    setCurrentPage(props.pageName)
  }

  const getRoles = async () => {
    const u = await axios.get('/api/REMS/getRoleDetails?email=' + username).then(resp => resp.data.role || null)
    setUserRoles(u)
    setCurrentPage(props.pageName)
  }
  useEffect(() => {
    if (!userRoles) {
      getRoles()
    }
  }, [getRoles, userRoles])

  return (
    <RoleContext.Provider value={{ getRoles, userRoles, currentPage }}>
      {props.children}
    </RoleContext.Provider>
  )
}

export const RoleConsumer = RoleContext.Consumer
export default RoleContext
