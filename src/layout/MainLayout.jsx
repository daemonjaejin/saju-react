// 파일명: src/layouts/MainLayout.jsx
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

const MainLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* 좌측 메뉴 영역 */}
      <nav
        style={{
          width: "250px",
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // 메뉴와 버튼을 위아래로 분리
        }}
      >
        <div>
          <h3>ADMIN MENU</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/dashboard"
                style={{ color: "white", textDecoration: "none" }}
              >
                홈 (Dashboard)
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/sample"
                style={{ color: "white", textDecoration: "none" }}
              >
                Sample 페이지
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/code"
                style={{ color: "white", textDecoration: "none" }}
              >
                Code 관리페이지
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/menu"
                style={{ color: "white", textDecoration: "none" }}
              >
                Menu 관리페이지
              </Link>
            </li>
          </ul>
        </div>

        {/* 로그아웃 버튼 - 메뉴 하단 */}
        <button
          onClick={logout}
          style={{
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          로그아웃
        </button>
      </nav>

      {/* 우측 본문 영역 */}
      <main style={{ flex: 1, padding: "20px", backgroundColor: "#f4f7f6" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
