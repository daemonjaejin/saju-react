import api from "@/api/axios";

export const useCodeSearch = ({ setSearchParams }) => {
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
      console.log("error: ", error);
      return error;
    } finally {
      console.log("finally");
    }
  };
  return {
    handlerChange,
    fetchData,
  };
};
