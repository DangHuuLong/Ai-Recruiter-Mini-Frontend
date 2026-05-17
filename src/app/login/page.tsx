import { Suspense } from 'react';

import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-slate-50">
      <section className="hidden flex-1 bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-lg font-bold">AI Recruiter</p>
          <p className="mt-2 max-w-md text-sm text-slate-300">
            Internal dashboard for AI-powered recruitment management.
          </p>
        </div>

        <div className="max-w-xl space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
            Recruit smarter
          </p>
          <h1 className="text-4xl font-bold leading-tight">
            Quản lý ứng viên, hồ sơ và đánh giá tuyển dụng trong một workspace.
          </h1>
          <p className="text-base leading-7 text-slate-300">
            Đăng nhập để tiếp tục theo dõi candidate, resume, job description,
            application và scoring flow của hệ thống.
          </p>
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:max-w-xl">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Welcome back
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              Đăng nhập hệ thống
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sử dụng tài khoản recruiter đã được backend cấp để truy cập dashboard.
            </p>
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
