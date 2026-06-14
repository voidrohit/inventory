import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import { TextField } from "../../components/ui/Field";
import { useAuth } from "../../context/AuthContext";
import { extractErrorMessage } from "../../lib/apiClient";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(form);
      toast.success("Welcome back");
      navigate("/");
    } catch (error) {
      toast.error(extractErrorMessage(error, "Login failed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Inventory Manager</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 mb-2">Demo credentials</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Email</span>
              <span className="font-mono text-slate-800">admin@ethara.ai</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Password</span>
              <span className="font-mono text-slate-800">admin@12345</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
