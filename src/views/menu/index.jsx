import React, { useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Tag,
  Row,
  Col,
  Empty,
  Space,
  Form,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import useMenu from "@/hooks/menu/menu";
import PropTypes from "prop-types";

const Menu = () => {
  const {
    fetchMenu,
    treeData,
    selectedMenu,
    insertFn,
    updateFn,
    cancelFn,
    updateInsertFn,
    topInsertFn,
  } = useMenu();
  useEffect(() => {
    fetchMenu();
  }, []);
  const columns = [
    {
      title: "메뉴명",
      dataIndex: "menuName",
      key: "menuName",
      onCell: (record) => ({
        onClick: () => {
          updateFn(record);
        },
      }),
    },
    {
      title: "메뉴ID",
      dataIndex: "menuId",
      key: "menuId",
      onCell: (record) => ({
        onClick: () => {
          updateFn(record);
        },
      }),
    },
    {
      title: "사용 여부",
      dataIndex: "useYn",
      key: "useYn",
      render: (useYn) => (
        <Tag color={useYn === 1 ? "green" : "red"}>
          {useYn === 1 ? "사용" : "미사용"}
        </Tag>
      ),
      onCell: (record) => ({
        onClick: () => {
          updateFn(record);
        },
      }),
    },
    {
      title: "작업",
      key: "action",
      render: () => (
        <Button type="link" size="small">
          + 하위
        </Button>
      ),
      onCell: (record) => ({
        onClick: () => {
          insertFn(record);
        },
      }),
    },
  ];

  const [form] = Form.useForm();
  const menuId = selectedMenu?.menuId;
  useEffect(() => {
    console.log("selectedMenu: ", selectedMenu);
    // 폼이 실제로 마운트 되었을 때만 작동하도록 보장하려면
    // 사실 가장 좋은 방법은 <Form>을 항상 렌더링하는 것입니다.
    if (selectedMenu) {
      form.setFieldsValue({
        menuName: selectedMenu.menuName,
        menuUrl: selectedMenu.menuUrl,
        useYn: selectedMenu.useYn,
      });
    }
  }, [menuId, selectedMenu, form]);
  return (
    <div className="admin-content">
      {/* 상단 브레드크럼 등 생략, 메인 레이아웃 시작 */}
      <Row gutter={16}>
        {/* --- 좌측 영역: 메뉴 목록 --- */}
        <Col span={14}>
          <Card
            title="메뉴 목록"
            extra={
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="btn-blue"
                  size="small"
                  onClick={topInsertFn}
                >
                  +최상위 메뉴 추가
                </Button>
                <Button icon={<ReloadOutlined />} size="small">
                  새로고침
                </Button>
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={treeData}
              pagination={false}
              size="middle"
              rowClassName={(record) =>
                selectedMenu?.menuId === record.menuId
                  ? "ant-table-row-selected"
                  : ""
              }
            />
          </Card>
        </Col>

        {/* --- 우측 영역: 상세 정보 --- */}
        <Col span={10}>
          <Card
            title="메뉴 상세 정보"
            extra={
              selectedMenu && (
                <Space>
                  <Button danger size="small">
                    삭제
                  </Button>
                  <Button size="small" onClick={cancelFn}>
                    취소
                  </Button>
                </Space>
              )
            }
          >
            {selectedMenu ? (
              <Form form={form}>
                <div className="menu-detail-form">
                  <div className="form-item">
                    <label>부모 메뉴 ID</label>
                    <Input
                      placeholder="자동으로 설정됩니다"
                      value={selectedMenu?.menuParentId}
                      disabled
                    />
                  </div>

                  <div className="form-item">
                    <label>메뉴 ID</label>
                    <Input value={selectedMenu?.menuId} disabled />
                  </div>

                  <div className="form-item">
                    <label>메뉴 이름</label>
                    <Form.Item
                      name="menuName"
                      rules={[
                        { required: true, message: "메뉴이름을 입력해주세요" },
                        {
                          min: 1,
                          message: "메뉴이름은 1자 이상이여야 합니다!",
                        },
                        {
                          max: 100,
                          message: "메뉴이름은 100자 이하여야 합니다!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="form-item">
                    <label>URL 경로</label>
                    <Form.Item
                      name="menuUrl"
                      rules={[
                        { required: true, message: "URL을 입력해주세요" },
                        {
                          min: 1,
                          message: "URL은 1자 이상이여야 합니다!",
                        },
                        {
                          max: 100,
                          message: "URL은 100자 이하여야 합니다!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="form-item">
                    <label>사용 여부</label>
                    <Form.Item name="useYn">
                      <Select>
                        <Select.Option value={1}>사용</Select.Option>
                        <Select.Option value={0}>미사용</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <Button
                    type="primary"
                    className="btn-blue"
                    block
                    style={{ marginTop: "10px" }}
                    onClick={() => updateInsertFn(form)}
                    htmlType="submit" // 타입을 submit으로 변경하면 더 좋습니다
                  >
                    변경사항 저장
                  </Button>
                </div>
              </Form>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="목록에서 메뉴를 선택해주세요"
                style={{ margin: "100px 0" }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Menu;

Menu.propTypes = {
  selectedMenu: PropTypes.object.isRequired,
};
