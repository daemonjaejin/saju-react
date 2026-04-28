import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/api/axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  userId: z.string().min(1, "ID 입력하세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    register, // input에 연결 (Vue의 v-model과 유사)
    handleSubmit, // submit 처리
    formState: { errors, isSubmitting }, // 에러 상태, 제출 중 여부
  } = useForm({
    resolver: zodResolver(loginSchema), // zod를 유효성 검사기로 등록
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await api.post("/auth/login", data);
      const { accessToken } = response.data;
      const { refreshToken } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      navigate("/code"); // MainLayout의 index로 이동
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message ?? "로그인에 실패했습니다");
      }
    }
  };

  return (
    <div className="login-container">
      {/* handleSubmit이 유효성 검사 통과 후 onSubmit 실행 */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label>유저ID</label>
          {/* register로 input을 form에 등록 */}
          <input
            type="userId"
            {...register("userId")}
            placeholder="ID를 입력해주세요."
          />
          {/* errors 객체에서 해당 필드 에러 메시지 표시 */}
          {errors.userId && <p className="error">{errors.userId.message}</p>}
        </div>

        <div className="field">
          <label>비밀번호</label>
          <input
            type="password"
            {...register("password")}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
