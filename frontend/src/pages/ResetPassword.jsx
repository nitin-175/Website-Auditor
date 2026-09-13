import AuthLayout from "../components/layout/AuthLayout";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";

function ResetPassword() {
  return (
    <AuthLayout>
      <section className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
        <ResetPasswordForm />
      </section>
    </AuthLayout>
  );
}

export default ResetPassword;