import React, { useEffect, useState } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Select,
  Radio,
  Space,
  InputNumber,
} from "antd";
import PropTypes from "prop-types";
import useSliderForm from "@/views/code/useSliderForm";

const SliderForm = ({ isVisible, onClose, onInsert }) => {
  const [form] = Form.useForm();
  const fetchData = useSliderForm();
  const [groupOptions, setGroupOptions] = useState([
    { value: "", label: "선택하세요", name: "" },
  ]);

  // 폼이 닫힐 때 입력값 초기화
  const handleClose = () => {
    form.resetFields();
    onClose();
  };
  useEffect(() => {
    const getGroupList = async () => {
      try {
        const responseData = await fetchData.fetchData({}, "/group/list");
        const rawData = responseData.data.content || [];
        const formattedOptions = rawData.map((item) => ({
          value: item.groupCode,
          label: item.groupCodeName,
        }));
        setGroupOptions(formattedOptions);
      } catch (error) {
        console.log("error: ", error);
      }
    };
    getGroupList();
  }, []);

  return (
    <Drawer
      title={"공통코드 등록"}
      onClose={handleClose}
      open={isVisible}
      styles={{
        body: { paddingBottom: 80 },
        width: 600,
      }}
      extra={
        <Space>
          <Button onClick={handleClose}>취소</Button>
          <Button
            onClick={() => form.submit()}
            type="primary"
            style={{ backgroundColor: "#00bfff" }}
          >
            저장
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onInsert}
        onFinishFailed={(errorInfo) => {
          console.log("errorInfo: ", errorInfo);
        }}
        initialValues={{ useYn: "1", commonCodeOrder: 1 }}
      >
        <Form.Item
          label="그룹코드"
          name="groupCode"
          rules={[{ required: true, message: "그룹코드를 선택해주세요" }]}
        >
          <Select
            name="groupCode"
            id="groupCode"
            options={groupOptions}
            placeholder="선택해주세요."
          />
        </Form.Item>

        <Form.Item
          label="공통코드"
          name="commonCode"
          rules={[
            { required: true, message: "공통코드를 입력해주세요" },
            { min: 1, message: "공통코드는 1자 이상이여야 합니다!" },
            { max: 20, message: "공통코드는 20자 이하여야 합니다!" },
          ]}
        >
          <Input placeholder="공통코드를 입력하세요 (예: GENDER)" />
        </Form.Item>

        <Form.Item
          label="공통코드명"
          name="commonCodeName"
          rules={[
            { required: true, message: "공통코드명을 입력해주세요" },
            { min: 1, message: "공통코드명은 1자 이상이여야 합니다!" },
            { max: 100, message: "공통코드명은 100자 이하여야 합니다!" },
          ]}
        >
          <Input placeholder="공통코드명을 입력하세요 (예: M or F)" />
        </Form.Item>

        <Form.Item
          label="순번"
          name="commonCodeOrder"
          rules={[
            {
              validator: (_, value) => {
                if (!value || Number(value) > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("1 이상의 정수만 입력 가능합니다."),
                );
              },
            },
          ]}
        >
          <InputNumber
            min={1}
            keyboard={true}
            style={{ width: "100%" }}
            placeholder="1"
          />
        </Form.Item>

        <Form.Item label="사용여부" name="useYn">
          <Radio.Group>
            <Radio value="1">사용</Radio>
            <Radio value="0">미사용</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

SliderForm.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
};

export default SliderForm;
