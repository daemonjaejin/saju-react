import { useEffect } from "react";
import SearchForm from "@/components/code/SearchForm";
import ModalForm from "@/components/code/ModalForm";
import SliderForm from "@/components/code/SliderForm";
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
    updateCodeData,
    setUpdateCodeData,
    isUpdate,
    setIsUpdate,
    updateData,
    isInsert,
    setIsInsert,
    insertData,
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
        setIsInsert={setIsInsert}
      />
      <Table
        columns={columns}
        dataSource={listResult}
        rowKey="commonCodeId"
        size="small"
        loading={false}
        onRow={(record) => ({
          onClick: () => {
            setUpdateCodeData(record);
            setIsUpdate(true);
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
      {isUpdate && (
        <ModalForm
          isVisible={isUpdate}
          onClose={() => {
            setIsUpdate(false);
          }}
          onSave={(param) => {
            console.log("param: ", param);
            // updateData(param);
          }}
          initialData={updateCodeData}
        />
      )}
      {isInsert && (
        <SliderForm
          isVisible={isInsert}
          onClose={() => {
            setIsInsert(false);
          }}
          onInsert={(param) => {
            insertData(param);
          }}
        />
      )}
    </div>
  );
};
export default Code;
