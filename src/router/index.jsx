import MainLayout from "@/layout/MainLayout";
import Sample from "@/views/sample/Sample";
import Code from "@/views/code";
import Menu from "@/views/menu";
import LoginPage from "@/views/login";
import { Navigate } from "react-router-dom";

export const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <MainLayout />, // 공통 레이아웃
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />, // 루트 접속 시 로그인으로
      },
      {
        path: "/dashboard",
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
