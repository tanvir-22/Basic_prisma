"use client";

import { useActionState } from "react";
import { registerUser } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <div className="bg-neo-pink border-4 border-black p-3 font-bold text-sm shadow-neo-sm flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-black shrink-0 stroke-[3]" />
          <span>{state.error}</span>
        </div>
      )}

      <Input
        label="Full Name"
        name="name"
        placeholder="e.g. Tanvir Rahman"
        required
      />

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="e.g. tanvir123@gmail.com"
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        required
      />

      <Button
        type="submit"
        variant="pink"
        className="w-full mt-2"
        loading={isPending}
      >
        Register
      </Button>
    </form>
  );
}
