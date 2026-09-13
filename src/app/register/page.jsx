import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { RegisterForm } from '@/components/register-form';
import { getCurrentUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { UserPlus } from 'lucide-react';

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-neo-bg">
      <Card bg="bg-white" className="w-full max-w-md shadow-neo-lg border-4 border-black">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center items-center">
            <div className="bg-neo-pink border-4 border-black p-3 rounded-none shadow-neo-sm mb-2">
              <UserPlus className="h-6 w-6 text-black stroke-[3]" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight">
              Create Account
            </h1>
            <p className="font-semibold text-zinc-600 text-sm">
              Sign up to start organizing developer logs.
            </p>
          </div>

          <RegisterForm />

          <div className="text-center font-bold text-sm border-t-4 border-black pt-4">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-neo-yellow">
              Log in instead
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
