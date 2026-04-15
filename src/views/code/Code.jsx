import { useEffect } from "react";
import SearchForm from "@/components/code/SearchForm";
import { useCode } from "@/hooks/code/code";
import { Table } from "antd";

const Code = () => {
  const {
    listData,
    listResult,
    handlerSearch,
    handleInitSearch,
    columns,
    handleTableChange,
    searchParams,
    setSearchParams,
    totalCount,
  } = useCode();

  useEffect(() => {
    listData();
  }, []);

  columns.map((col) => {
    if (col.key === "useYn") {
      col.render = (val) => {
        return (
          <span style={{ color: val === 1 ? "blue" : "red" }}>
            {val === 1 ? "사용" : "미사용"}
          </span>
        );
      };
    }
    return col;
  });
  return (
    <div>
      <h1>Code</h1>
      <SearchForm
        handlerSearch={handlerSearch}
        handleInitSearch={handleInitSearch}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
      <Table
        columns={columns}
        dataSource={listResult}
        rowKey="commonCodeId"
        size="small"
        loading={false}
        onRow={(record) => ({
          onClick: () => {
            console.log("record: ", record);
          },
        })}
        pagination={{
          current: searchParams.page || 1, // 현재 페이지 (백엔드가 0부터 시작하면 +1)
          pageSize: searchParams.size || 10, // 한 페이지당 보여줄 개수
          total: totalCount, // 중요! 서버에서 받아온 전체 데이터 개수
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};
export default Code;
