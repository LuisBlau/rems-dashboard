import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Title from '../Title'
import useSWR from 'swr'
import fetcher from '../../lib/lib'

export default function StoreWidget () {
  const { data, error } = useSWR(
    '/store-connection',
    fetcher
  )

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  else {
    return (
      <React.Fragment>
        <Title>Store-Connection</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Store</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>% up</TableCell>
              <TableCell>Connected</TableCell>
              <TableCell>Disconnected</TableCell>
              <TableCell align="right">Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .sort((store1, store2) => {
                const store1Total = store1.connected + store1.disconnected
                const store2Total = store2.connected + store2.disconnected
                return (store1.connected / store1Total) - (store2.connected / store2Total)
              })
              .slice(0, 20)
              .map((store) => (
                <TableRow key={store.store_num}>
                  <TableCell>{store.store_num}</TableCell>
                  <TableCell>{store.country}</TableCell>
                  <TableCell>
                    {(
                      (100 * store.connected) /
                      (store.connected + store.disconnected)
                    ).toFixed(2)}
                    %
                  </TableCell>
                  <TableCell>{store.connected}</TableCell>
                  <TableCell>{store.disconnected}</TableCell>
                  <TableCell align="right">{store.last_updated}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </React.Fragment>
    )
  }
}
