import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import PropTypes from "prop-types";

const ModalForm = ({ isVisible, onClose, onSave, initialData }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={"공통코드 수정"}
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          취소
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={() => form.submit()}
          style={{ backgroundColor: "#00bfff" }}
        >
          저장하기
        </Button>,
      ]}
      centered
    >
      <Form
        form={form}
        layout="vertical" // 라벨이 인풋 위로 가도록 설정
        onFinish={onSave}
        initialValues={{
          useYn: initialData.useYn === 1 ? "사용" : "미사용",
          groupCode: initialData.groupCode,
          groupCodeName: initialData.groupCodeName,
          commonCode: initialData.commonCode,
          commonCodeName: initialData.commonCodeName,
          commonCodeOrder: initialData.commonCodeOrder,
          commonCodeId: initialData.commonCodeId,
        }}
      >
        <Form.Item name="commonCodeId" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="그룹코드" name="groupCode">
          <Input disabled={true} placeholder="그룹코드" />
        </Form.Item>

        <Form.Item label="그룹코드명" name="groupCodeName">
          <Input disabled placeholder="그룹코드명" />
        </Form.Item>

        <Form.Item
          label="공통코드"
          name="commonCode"
          rules={[
            { required: true, message: "공통코드를 입력하세요!" },
            { min: 1, message: "공통코드는 1자 이상이여야 합니다!" },
            { max: 20, message: "공통코드는 20자 이하여야 합니다!" },
          ]}
        >
          <Input placeholder="공통코드" />
        </Form.Item>

        <Form.Item
          label="공통코드명"
          name="commonCodeName"
          rules={[
            { required: true, message: "공통코드명을 입력하세요!" },
            { min: 1, message: "공통코드명은 1자 이상이여야 합니다!" },
            { max: 100, message: "공통코드명은 100자 이하여야 합니다!" },
          ]}
        >
          <Input placeholder="공통코드명" />
        </Form.Item>

        <Form.Item
          label="정렬순번"
          name="commonCodeOrder"
          rules={[
            { required: true, message: "정렬 순번을 입력하세요." },
            {
              pattern: /^\d+$/,
              message: "0 이상의 정수만 입력 가능합니다.",
            },
          ]}
        >
          <Input type="number" placeholder="1" />
        </Form.Item>

        <Form.Item label="사용여부" name="useYn">
          <Select
            options={[
              { value: "1", label: "사용" },
              { value: "0", label: "미사용" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalForm;

ModalForm.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.object.isRequired,
};
