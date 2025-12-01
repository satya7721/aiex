"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LoginFormProps {
  userType: "admin" | "student";
  onSuccess?: () => void;
}

export default function LoginForm({ userType, onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          type: userType,
          email: formData.email.toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Unable to sign in");
        return;
      }

      if (userType === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      onSuccess?.();
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to sign in right now");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {userType === "admin" ? "Admin Login" : "Student Login"}
        </CardTitle>
        <CardDescription>
          {userType === "admin"
            ? "Login to access the admin dashboard"
            : "Login to access your exams"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={
                userType === "admin"
                  ? "admin@example.com"
                  : "student@student.com"
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          {userType === "student" && (
            <p className="text-sm text-muted-foreground text-center">
              Don&apos;t have an account? Contact your administrator
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
} 