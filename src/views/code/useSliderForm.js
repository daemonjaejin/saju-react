import api from "@/api/axios";

const useSliderForm = () => {
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
    fetchData,
  };
};

export default useSliderForm;
