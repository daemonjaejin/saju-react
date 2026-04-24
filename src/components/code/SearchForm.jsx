import React, { useState, useEffect } from "react";
import { searchForm } from "@/hooks/code/searchForm";
import { Select, Input, Tag, Flex, DatePicker } from "antd";
import PropTypes from "prop-types";

const SearchFormCode = ({
  setSearchParams,
  searchParams,
  handlerSearch,
  handleInitSearch,
  setIsInsert,
  selectedTags,
  setSelectedTags,
  commonCodeNameHandler,
  dateSearchHandler,
}) => {
  const { RangePicker } = DatePicker;
  const { handlerChange, fetchData } = searchForm({ setSearchParams });
  const [groupOptions, setGroupOptions] = useState([
    { value: "", label: "선택하세요", name: "" },
  ]);
  const [options] = useState([
    { value: "", label: "선택" },
    { value: 1, label: "사용" },
    { value: 0, label: "미사용" },
  ]);
  const { CheckableTag } = Tag;
  const [tagsData, setTagsData] = useState([]);

  const handleChange = (tag, checked) => {
    let nextTags;
    if (tag === "전체") {
      nextTags = checked ? ["전체"] : [];
    } else {
      const baseTags = checked
        ? [...selectedTags, tag] // 선택 시 추가
        : selectedTags.filter((t) => t !== tag); // 해제 시 제거

      nextTags = baseTags.filter((t) => t !== "전체");
    }

    setSelectedTags(nextTags);

    setSearchParams((prev) => ({
      ...prev,
      groupCodeNameList: nextTags,
    }));
  };
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
        // 2. 칩/태그용 데이터 추출 (groupCodeName만 모으기)
        const newTags = ["전체", ...rawData.map((item) => item.groupCodeName)];

        // 3. 상태 업데이트 (이 시점에 화면이 다시 그려짐)
        setTagsData(newTags);

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
      {/* 칩/태그 필터 영역 */}
      <Flex gap="small" wrap>
        <label htmlFor="groupCodeNameList">그룹코드 필터</label>
        {tagsData.map((tag) => (
          <CheckableTag
            key={tag}
            checked={selectedTags.includes(tag)}
            onChange={(checked) => handleChange(tag, checked)}
          >
            {tag}
          </CheckableTag>
        ))}
      </Flex>
      <div className="input-group">
        <label htmlFor="commonCodeName">공통코드명 검색</label>
        <Select
          mode="tags"
          style={{
            flex: 1, // CSS 대신 인라인으로 줄 경우
            minWidth: "250px", // 최소 너비 보장
            width: "100%",
          }}
          maxCount={3} // 최대 5개까지만 생성 가능 (그 이상은 입력 안 됨)
          placeholder="태그를 입력하고 Enter를 누르세요."
          onChange={commonCodeNameHandler}
          tokenSeparators={[","]}
          value={searchParams.commonCodeNameList}
        />
      </div>
      <div className="input-group">
        <label htmlFor="dateSearch">기간 조회</label>
        <RangePicker
          style={{
            flex: 1, // CSS 대신 인라인으로 줄 경우
            minWidth: "250px", // 최소 너비 보장
          }}
          placeholder={["시작일", "종료일"]}
          onChange={dateSearchHandler}
          value={searchParams.dateRange}
        />
      </div>
      <button
        className="btn-red"
        onClick={() => {
          setIsInsert(true);
        }}
      >
        등록
      </button>
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
  setIsInsert: PropTypes.bool.isRequired,
  selectedTags: PropTypes.array.isRequired,
  setSelectedTags: PropTypes.array.isRequired,
  commonCodeNameHandler: PropTypes.func.isRequired,
  dateSearchHandler: PropTypes.func.isRequired,
};
