import api from "@/api/axios";
import { use, useState, useMemo } from "react";
const useMenu = () => {
  const [menuList, setMenuList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const fetchMenu = async (params) => {
    const response = await api.post("/menu/list", params || {});
    setMenuList(response?.data?.content || []);
  };

  const insertFn = (record) => {
    setSelectedMenu({
      menuName: "",
      menuParentId: record.menuId,
      menuId: "자동으로 설정됩니다.",
      useYn: 1,
      menuUrl: "",
    });
  };
  const updateFn = (record) => {
    setSelectedMenu({
      ...record,
      menuParentId: record.menuParentId ?? "최상위 메뉴입니다.",
    });
  };
  const cancelFn = () => {
    setSelectedMenu(null);
  };

  const treeData = useMemo(() => {
    const list = menuList || [];
    if (list.length === 0) return [];

    // 1. 순수 JS로 GroupBy 구현 (부모 ID를 키로 그룹화)
    const grouped = list.reduce((acc, item) => {
      const pId = item.menuParentId ?? "root"; // null이나 undefined면 "root" 문자열로 관리
      if (!acc[pId]) acc[pId] = [];
      acc[pId].push(item);
      return acc;
    }, {});

    // 2. 재귀적으로 트리 구조 생성
    const transform = (pId) => {
      const children = grouped[pId] || [];
      return children.map((item) => {
        const nextChildren = transform(item.menuId);

        const node = {
          ...item,
          key: item.menuId, // antd 테이블 필수 키
        };

        // 자식이 있는 경우에만 children 속성 추가 (화살표 노출 제어)
        if (nextChildren.length > 0) {
          node.children = nextChildren;
        }

        return node;
      });
    };

    // 3. 최상위 노드 탐색 시작
    // DB 구조에 따라 null, "", "0" 등 최상위 기준이 다를 수 있으므로 순차적 시도
    let result = transform("root"); // 우선 null/undefined 그룹 탐색

    if (result.length === 0) {
      result = transform(""); // 빈 문자열인 경우 시도
    }

    if (result.length === 0) {
      result = transform("0"); // "0" 문자열인 경우 시도
    }

    return result;
  }, [menuList]);

  return {
    fetchMenu,
    treeData,
    selectedMenu,
    setSelectedMenu,
    insertFn,
    updateFn,
    cancelFn,
  };
};
export default useMenu;
