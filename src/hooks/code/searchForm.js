import api from "@/api/axios";
import { message } from "antd";

export const searchForm = ({ setSearchParams }) => {
  const handlerChange = (nameOrEvent, value) => {
    if (nameOrEvent.target) {
      const { name, value: val } = nameOrEvent.target;
      setSearchParams((prev) => ({ ...prev, [name]: val }));
    } else {
      setSearchParams((prev) => ({ ...prev, [nameOrEvent]: value }));
    }
  };
  const fetchData = async (params, url) => {
    try {
      const response = await api.post(url, params || {});
      return response;
    } catch (error) {
      message.error("오류가 발생했습니다.", error);
      return error;
    }
  };
  return {
    handlerChange,
    fetchData,
  };
};
