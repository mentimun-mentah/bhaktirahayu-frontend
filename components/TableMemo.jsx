import { memo } from 'react'
import { Table } from 'antd'

const TableMemo = ({ ...rest }) => {
  return <Table {...rest} />
}

export default memo(TableMemo)
