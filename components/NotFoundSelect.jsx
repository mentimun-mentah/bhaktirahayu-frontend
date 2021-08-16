import { memo } from 'react'
import { Spin, Empty } from 'antd'

const NotFoundSelect = ({ loading }) => {
  if(loading) {
    return <Spin size="small" className="w-100 text-center" />
  }
  else {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="my-1 ant-empty-small" />
  }
}

export default memo(NotFoundSelect)
