import { AuthShell } from "@/components/auth/AuthShell";

export const metadata = {
  title: "Forgot Password | CodeAmbers",
  description: "Reset your CodeAmbers workspace password.",
};

export default function ForgotPasswordPage() {
  return <AuthShell mode="forgot-password" />;
}
