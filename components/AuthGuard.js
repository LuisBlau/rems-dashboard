/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import UserContext from '../pages/UserContext'
import { AccessDenied } from './AccessDenied'

export const Guard = ({ children }) => {
  const context = useContext(UserContext)
  const softwareDistributionPages = [
    // Software Distribution Pages
    'DeployStatus', // Software Distribution
    'Upload', // Upload a File
    'DeployCreateComponent', // Create Deployment Configuration
    'DeploySchedule', // Schedule a Deployment
    'AgentSelect' // Select Agents (agent list)
  ]
  const docCollectionPages = [
    // Doc Collection Pages
    'DocCollectionComponent', // Doc Collection
    'DumpTableComponent', // Dumps
    'ExtractTableComponent', // Extract
    'DataCaptureComponent' // Data Capture
  ]
  const demoPages = [
    // pages for demo
    'EleraStats' // Elera Statistics Page
  ]

  let isAllowed = false
  console.log(context.currentPage)
  if (context.userRoles) {
    if (softwareDistributionPages.includes(context.currentPage)) {
      isAllowed = !!((context.userRoles.includes('admin') || context.userRoles.includes('devops')))
    } else if (docCollectionPages.includes(context.currentPage)) {
      isAllowed = !!((context.userRoles.includes('admin') || context.userRoles.includes('support')))
    } else if (demoPages.includes(context.currentPage)) {
      console.log(context.userRoles)
      isAllowed = !!((context.userRoles.includes('demo')))
    } else {
      isAllowed = true
    }
  }

  return (
        <>
        {
            isAllowed
              ? (children)
              : (<AccessDenied/>)
        }
        </>
  )
}
