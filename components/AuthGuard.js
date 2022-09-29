/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import RoleContext from '../pages/RoleContext'
import { AccessDenied } from './AccessDenied'

export const Guard = ({ children }) => {
  const context = useContext(RoleContext)
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

  let isAllowed = false
  if (context.userRoles) {
    if (softwareDistributionPages.includes(context.currentPage)) {
      isAllowed = !!((context.userRoles.includes('admin') || context.userRoles.includes('devops')))
    } else if (docCollectionPages.includes(context.currentPage)) {
      isAllowed = !!((context.userRoles.includes('admin') || context.userRoles.includes('support')))
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
