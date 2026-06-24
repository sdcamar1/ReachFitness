import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { api, setAuthToken } from "../lib/api";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api("/auth/me").then(() => navigate("/admin")).catch(() => {});
  }, [navigate]);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(result.access_token);
      navigate("/admin");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-page page-section">
      <div>
        <p className="eyebrow">ADMIN ACCESS</p>
        <h1>
          Studio
          <br />
          <em>sign in.</em>
        </h1>
      </div>
      <form onSubmit={submit}>
        <label>
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            data-testid="login-email"
          />
        </label>
        <label>
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            data-testid="login-password"
          />
        </label>
        <Button type="submit" disabled={loading} data-testid="login-submit">
          {loading ? "Signing in..." : "Sign in"} <ArrowRight size={18} />
        </Button>
      </form>
    </section>
  );
}
