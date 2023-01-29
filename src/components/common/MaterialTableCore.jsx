import React from 'react'
import MaterialTable, { MTableToolbar } from '@material-table/core'
import { ThemeProvider } from '@mui/material/styles'
import PropTypes from 'prop-types'

import materialTableTheme from '../../styles/materialTableTheme'

const MaterialTableCore = ({ columns, data, isLoading }) => {
  MaterialTableCore.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    isLoading: PropTypes.bool,
  }

  return (
    <ThemeProvider theme={materialTableTheme}>
      <MaterialTable
        title="Projects"
        columns={columns}
        data={data}
        isLoading={isLoading}
        // onRowClick={(evt, selectedRow) => {
        //   if (setSelectedInfo) setSelectedInfo(selectedRow)
        // }}
        options={{
          showTitle: false,
          draggable: false,
          headerStyle: {
            backgroundColor: '#f5f5f5',
            paddingTop: 12,
            paddingBottom: 11,
          },
          rowStyle: {
            fontSize: 14,
          },
          cellStyle: {
            padding: '6px 16px 5px',
          },
          pageSize: 5,
          searchFieldAlignment: 'left',
          searchFieldStyle: {
            fontSize: 14,
            padding: '14px 0',
          },
          // rowStyle: (rowData) => {
          //   return {
          //     background:
          //       selectedInfo && selectedInfo._id === rowData._id
          //         ? 'rgba(169, 124, 80, 0.5)'
          //         : 'inherit',
          //     color: selectedInfo && selectedInfo._id === rowData._id ? '#fff !important' : 'inherit',
          //   }
          // },
        }}
        localization={{
          body: {
            emptyDataSourceMessage: data.length === 0 && !isLoading && 'No records to display',
          },
          toolbar: {
            searchPlaceholder: 'Search...',
          },
        }}
        components={{
          Toolbar: (props) => <MTableToolbar {...props} />,
        }}
        style={{
          boxShadow: 'none',
          borderBottom: 0,
          marginBottom: 5,
          // maxWidth: '1920px',
        }}
      />
    </ThemeProvider>
  )
}

export default MaterialTableCore
