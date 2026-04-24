import { useState } from "react";
import api from "@/api/axios";
import { message, Modal } from "antd";

const useCode = () => {
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
  const insertUpdate = async (params, url, msg) => {
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
        listData();
        message.success(msg + "되었습니다.");
      }
    } catch (error) {
      message.error("오류가 발생했습니다.", error);
    }
  };
  const updateData = async (params) => {
    Modal.confirm({
      title: "수정",
      content: "수정하시겠습니까?",
      okText: "수정",
      cancelText: "취소",
      onOk: async () => {
        await insertUpdate(params, "/code/update", "수정");
        setIsUpdate(false);
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
        await insertUpdate(params, "/code/insert", "저장");
        setIsInsert(false);
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
    const newParam = {
      ...searchParams,
      page: pagination.current,
      size: pagination.pageSize,
    };

    setSearchParams(newParam);
    listData(newParam);
  };
  return {
    listData,
    listResult,
    handlerSearch,
    handleInitSearch,
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

export default useCode;
