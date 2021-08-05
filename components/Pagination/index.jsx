import { Pagination } from "antd";

const itemRender = (_, type, originalElement) => {
  if (type === "prev") {
    return(
      <div className="prev-next-pagination">
        <i className="far fa-chevron-left va-1px" />
      </div>
    ) 
  }
  if (type === "next") {
    return(
      <div className="prev-next-pagination">
        <i className="far fa-chevron-right va-1px" />
      </div>
    ) 
  }
  return originalElement;
};

const PaginationContainer = ({ total = 1, pageSize = 10, goTo = () => {}, current, hideOnSinglePage = false, className }) => {
  return (
    <>
      <Pagination
        responsive
        className={className}
        current={current} //current page
        itemRender={itemRender}
        showSizeChanger={false}
        onChange={(e) => goTo(e)}
        pageSize={pageSize} //data per_page
        total={total} //max of iter_pages
        hideOnSinglePage={hideOnSinglePage}
      />
      <style jsx>{`
        :global(.prev-next-pagination){
          height: inherit;
          border-radius: .25rem;
          border: 1px solid #d9d9d9;
        }
        :global(.ant-pagination-item, .ant-pagination-prev .ant-pagination-item-link, .ant-pagination-next .ant-pagination-item-link){
          border-radius: .25rem;
        }
        :global(.ant-pagination-item-link-icon.anticon){
          vertical-align: 2px;
        }
        :global(.va-1px){
          vertical-align: 1px;
        }
      `}</style>
    </>
  );
};

export default PaginationContainer;
