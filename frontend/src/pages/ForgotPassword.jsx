import AuthLayout from "../components/layout/AuthLayout";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

function ForgotPassword() {
  return (
    <AuthLayout>
      <section className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
        <ForgotPasswordForm />
      </section>
    </AuthLayout>
  );
}

export default ForgotPassword;