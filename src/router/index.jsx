import MainLayout from "@/layout/MainLayout";
import Sample from "@/views/sample/Sample";
import Code from "@/views/code";
import Menu from "@/views/menu"

export const routes = [
  {
    path: "/",
    element: <MainLayout />, // 공통 레이아웃
    children: [
      {
        index: true,
        element: (
          <div>
            <h2>대시보드 (Home)</h2>
          </div>
        ),
      },
      {
        path: "/sample",
        element: <Sample />,
      },
      {
        path: "/code",
        element: <Code />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
    ],
  },
];
