import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase";

type DbUser = {
  id: string;
  name: string | null;
  email: string | null;
  type: "admin" | "student";
  student_id: string | null;
  class: string | null;
  division: string | null;
  active: boolean;
  password_hash: string | null;
};

const adminLoginSchema = z.object({
  type: z.literal("admin"),
  email: z.string().trim().email(),
  password: z.string().min(6),
});

const studentLoginSchema = z.object({
  type: z.literal("student"),
  studentId: z
    .string()
    .trim()
    .min(4)
    .max(12)
    .regex(/^[a-zA-Z0-9]+$/, "Student ID must be alphanumeric"),
});

const baseSchema = z.object({
  type: z.enum(["admin", "student"]),
});

function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function getClientIp(request: Request) {
  const header =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "";
  return header.split(",")[0]?.trim() || undefined;
}

export async function POST(request: Request) {
  const payload = await request.json();
  const { type } = baseSchema.parse({ type: payload.type });

  try {
    if (type === "admin") {
      const { email, password } = adminLoginSchema.parse({
        ...payload,
        type,
      });

      const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("type", "admin")
        .eq("email", email.toLowerCase())
        .is("deleted_at", null)
        .single();
      const user = data as DbUser | null;

      if (error || !user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      if (!user.password_hash) {
        return NextResponse.json(
          { error: "Password not set for this account" },
          { status: 401 }
        );
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      return await createSessionResponse(request, user);
    }

    const { studentId } = studentLoginSchema.parse({
      ...payload,
      type,
    });
    const normalizedStudentId = studentId.trim().toUpperCase();

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("type", "student")
      .eq("student_id", normalizedStudentId)
      .is("deleted_at", null)
      .single();
    const user = data as DbUser | null;

    if (error || !user) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (!user.active) {
      return NextResponse.json(
        { error: "Student account is inactive" },
        { status: 403 }
      );
    }

    return await createSessionResponse(request, user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    console.error("Login failed:", err);
    return NextResponse.json(
      { error: "Unable to sign in right now" },
      { status: 500 }
    );
  }
}

async function createSessionResponse(request: Request, user: DbUser) {
  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

  const { error: sessionError } = await supabaseAdmin
    .from("auth_sessions")
    .insert({
      user_id: user.id,
      refresh_token_hash: hashToken(sessionToken),
      expires_at: expires.toISOString(),
      user_agent: request.headers.get("user-agent") ?? undefined,
      ip: getClientIp(request),
    });

  if (sessionError) {
    console.error("Session creation failed:", sessionError);
    return NextResponse.json(
      { error: "Unable to sign in right now" },
      { status: 500 }
    );
  }

  await supabaseAdmin
    .from("users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", user.id);

  const response = NextResponse.json(
    {
      user: {
        id: user.id,
        name: user.name,
        type: user.type,
        studentId: user.student_id,
      },
    },
    { status: 200 }
  );

  response.cookies.set("session_token", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  response.cookies.set("userType", user.type, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
