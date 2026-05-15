// shared/components/AuthLayout.tsx

import { Clapperboard } from "lucide-react";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  description: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  description,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-light px-6 py-10">
      <div className="grid min-h-[650px] w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
        
        {/* Panel izquierdo */}
        <section className="hidden flex-col justify-between bg-primary px-14 py-12 text-white lg:flex">
          
          {/* Header */}
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/10">
              <Clapperboard size={40} />
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                ReelClips
              </h1>

              <p className="mt-2 text-base font-medium text-white/80">
                Plataforma de videos cortos
              </p>
            </div>
          </div>

          {/* Hero */}
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold leading-[1.15] tracking-tight">
              {title}
            </h2>

            <p className="mt-6 max-w-md text-base leading-7 text-white/80">
              {description}
            </p>
          </div>

          {/* Decorative dots */}
          <div className="flex gap-3">
            <div className="h-3 w-3 rounded-full bg-light" />
            <div className="h-3 w-3 rounded-full bg-accent" />
            <div className="h-3 w-3 rounded-full bg-soft" />
          </div>
        </section>

        {/* Content */}
        <section className="flex items-center justify-center bg-white px-8 py-10 sm:px-14">
          <div className="w-full max-w-md">
            
            {/* Mobile logo */}
            <div className="mb-8 flex flex-col items-center text-center lg:hidden">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-white shadow-lg">
                <Clapperboard size={40} />
              </div>

              <h1 className="mt-4 text-4xl font-bold text-primary">
                ReelClips
              </h1>

              <p className="mt-2 text-sm text-secondary">
                Plataforma de videos cortos
              </p>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold leading-tight tracking-tight text-primary">
                {subtitle}
              </h2>
            </div>

            {/* Dynamic content */}
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}