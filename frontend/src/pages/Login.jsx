import AuthLayout from "../components/layout/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

function Login() {
  return (
    <AuthLayout>
      <section className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
        <LoginForm />
      </section>
    </AuthLayout>
  );
}

export default Login;