import React from "react";
import { Outlet, Link } from "react-router-dom";

const MainLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* 좌측 메뉴 영역 */}
      <nav
        style={{
          width: "250px",
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "20px",
        }}
      >
        <h3>ADMIN MENU</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "10px" }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
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
            <Link to="/code" style={{ color: "white", textDecoration: "none" }}>
              Code 관리페이지
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link to="/menu" style={{ color: "white", textDecoration: "none" }}>
              Menu 관리페이지
            </Link>
          </li>
        </ul>
      </nav>

      {/* 우측 본문 영역 */}
      <main style={{ flex: 1, padding: "20px", backgroundColor: "#f4f7f6" }}>
        {/* Vue의 <router-view /> 와 같은 역할입니다. */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
