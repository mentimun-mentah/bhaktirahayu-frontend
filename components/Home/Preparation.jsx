import { memo } from 'react'
import { Media } from 'react-bootstrap'
import { Image as AntImage } from 'antd'

import { preparation_list } from 'data/home'

const PreparationContainer = () => (
  <div className="d-flex justify-content-center flex-column w-100">
    <h5 className="mb-3">Persiapan dulu yuk 👌 </h5>

    <ul className="list-unstyled">
      {preparation_list.map((data, i) => (
        <Media as="li" className={`${i !== (data.length - 1) && 'mb-2'} user-select-none`} key={i}>
          <div className="mr-3">
            <AntImage
              width={90}
              height={90}
              src={data.image}
              alt="preparation"
            />
          </div>
          <Media.Body>
            <h6 className="mb-0 mt-3 text-muted font-weight-normal">{data.title}</h6>
          </Media.Body>
        </Media>
      ))}
    </ul>
  </div>
)

export default memo(PreparationContainer)
