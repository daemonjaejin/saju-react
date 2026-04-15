import React, { useState, useEffect } from "react";
import { useCodeSearch } from "@/hooks/code/codeSearch";
import { Select, Input } from "antd";
import PropTypes from "prop-types";

const SearchFormCode = ({
  setSearchParams,
  searchParams,
  handlerSearch,
  handleInitSearch,
}) => {
  const { handlerChange, fetchData } = useCodeSearch({ setSearchParams });
  const [groupOptions, setGroupOptions] = useState([
    { value: "", label: "선택하세요", name: "" },
  ]);
  const [options] = useState([
    { value: "", label: "선택" },
    { value: 1, label: "사용" },
    { value: 0, label: "미사용" },
  ]);
  useEffect(() => {
    const getGroupList = async () => {
      try {
        const responseData = await fetchData(searchParams, "/group/list");
        const rawData = responseData.data.content || [];
        const formattedOptions = rawData.map((item) => ({
          value: item.groupCode,
          label: item.groupCodeName,
          name: item.groupCodeName,
        }));
        setGroupOptions([
          { value: "", label: "선택하세요" },
          ...formattedOptions,
        ]);
      } catch (error) {
        console.log("error: ", error);
      }
    };
    getGroupList();
  }, []);
  return (
    <div className="search-box">
      <div className="input-group">
        <label htmlFor="groupCode">그룹 코드</label>
        <Select
          name="groupCode"
          id="groupCode"
          value={searchParams.groupCode}
          onChange={(val) => handlerChange("groupCode", val)}
          options={groupOptions}
        ></Select>
      </div>
      <div className="input-group">
        <label htmlFor="groupCodeName">그룹 코드명</label>
        <Input
          type="text"
          name="groupCodeName"
          id="groupCodeName"
          value={searchParams.groupCodeName}
          onChange={handlerChange}
          placeholder="그룹코드명 입력"
        />
      </div>
      <div className="input-group">
        <label htmlFor="useYn">사용 유무</label>
        <Select
          name="useYn"
          id="useYn"
          value={searchParams.useYn}
          onChange={(val) => handlerChange("useYn", val)}
          options={options}
        />
      </div>
      <button
        className="btn-blue"
        onClick={() => {
          handlerSearch(searchParams);
        }}
      >
        검색
      </button>
      <button
        className="btn-gray"
        onClick={() => {
          setSearchParams({
            groupCode: "",
            groupName: "",
            useYn: "",
            page: 0,
            size: 10,
          });
          handleInitSearch();
        }}
      >
        초기화
      </button>
    </div>
  );
};
export default SearchFormCode;

SearchFormCode.propTypes = {
  setSearchParams: PropTypes.object.isRequired,
  searchParams: PropTypes.object.isRequired,
  handlerSearch: PropTypes.func.isRequired,
  handleInitSearch: PropTypes.func.isRequired,
};