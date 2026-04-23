import { useState } from "react";
import api from "@/api/axios";
import { message, Modal } from "antd";

export const useCode = () => {
  const [searchParams, setSearchParams] = useState({
    groupCode: "",
    groupName: "",
    useYn: "",
    page: 0,
    size: 10,
    groupCodeNameList: [],
    commonCodeNameList: [],
    dateRange: [],
  });
  const [updateCodeData, setUpdateCodeData] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const [isInsert, setIsInsert] = useState(false);
  const [selectedTags, setSelectedTags] = useState(["전체"]);
  const commonCodeNameHandler = (value) => {
    setSearchParams((prev) => ({
      ...prev,
      commonCodeNameList: value,
    }));
  };
  const dateSearchHandler = (value) => {
    setSearchParams((prev) => ({
      ...prev,
      dateRange: value,
    }));
  };
  const columns = [
    {
      title: "그룹코드",
      dataIndex: "groupCode", // 데이터 키값
      key: "groupCode",
      width: 120,
    },
    {
      title: "그룹명",
      dataIndex: "groupCodeName",
      key: "groupCodeName",
    },
    {
      title: "공통코드",
      dataIndex: "commonCode",
      key: "commonCode",
    },
    {
      title: "공통코드명",
      dataIndex: "commonCodeName",
      key: "commonCodeName",
    },
    {
      title: "공통코드순번",
      dataIndex: "commonCodeOrder",
      key: "commonCodeOrder",
    },
    {
      title: "사용유무",
      dataIndex: "useYn",
      key: "useYn",
    },
    {
      title: "수정자",
      dataIndex: "updateUserId",
      key: "updateUserId",
    },
    {
      title: "수정일",
      dataIndex: "updateDate",
      key: "updateDate",
    },
  ];

  const [searchParam, setSearchParam] = useState({
    groupCode: "",
    groupCodeName: "",
    useYn: "",
    commonCode: "",
    commonCodeName: "",
  });

  const handlerSearch = (params) => {
    listData(params);
  };

  const [listResult, setListResult] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const listData = async (params) => {
    try {
      const response = await api.post("/code/list", params || {});
      setListResult(response?.data?.content || []);
      setTotalCount(response?.data?.totalCount || 0);
      setSearchParams((prev) => ({
        ...prev,
        page: response?.data?.page || 0,
        size: response?.data?.size || 10,
      }));
    } catch (error) {
      console.log("error: ", error);
    } finally {
      console.log("finally");
    }
  };
  const insertUpdate = async (params, url) => {
    try {
      const response = await api.put(url, params || {});
      if (response?.status === 200 && response?.data === 1) {
        setSearchParams({
          groupCode: "",
          groupName: "",
          useYn: "",
          page: 0,
          size: 10,
          groupCodeNameList: [],
          commonCodeNameList: [],
          dateRange: [],
        });
        setSelectedTags(["전체"]);
        setIsUpdate(false);
        listData();
      }
    } catch (error) {
      message.error("오류가 발생했습니다.", error);
    } finally {
      console.log("finally");
    }
  };
  const updateData = async (params) => {
    Modal.confirm({
      title: "수정",
      content: "수정하시겠습니까?",
      okText: "수정",
      cancelText: "취소",
      onOk: async () => {
        insertUpdate(params, "/code/update");
        message.success("수정되었습니다.");
      },
    });
  };
  const insertData = async (params) => {
    Modal.confirm({
      title: "저장",
      content: "저장하시겠습니까?",
      okText: "저장",
      cancelText: "취소",
      onOk: async () => {
        insertUpdate(params, "/code/insert");
        message.success("저장되었습니다.");
      },
    });
  };
  const handleInitSearch = () => {
    setSearchParams({
      groupCode: "",
      groupName: "",
      useYn: "",
      page: 0,
      size: 10,
      groupCodeNameList: [],
      commonCodeNameList: [],
      dateRange: [],
    });
    setSelectedTags(["전체"]);
    listData();
  };
  const handleTableChange = (pagination) => {
    const newPage = pagination.current;
    setSearchParam((prev) => ({
      ...prev,
      page: newPage,
      size: pagination.pageSize,
    }));
    listData({ ...searchParam, page: newPage, size: pagination.pageSize });
  };
  return {
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
    selectedTags,
    setSelectedTags,
    commonCodeNameHandler,
    dateSearchHandler,
  };
};
