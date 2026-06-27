import Image from "next/image";
import { LoginForm } from "@/components/login-form";
import hero from "@/assets/hero.jpg";
import logo from "@/assets/riko-logo.png";

export default function AdminLoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-10 text-sand">
      <Image
        src={hero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-background/80" />
      <div className="absolute inset-0 ember-gradient animate-ember" />
      <div className="grain absolute inset-0" />

      <section className="relative w-full max-w-xl border border-border bg-card/55 p-8 shadow-2xl backdrop-blur-xl md:p-12">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-accent/25 bg-background/60 p-4 ember-glow">
          <Image src={logo} alt="RIKO" className="h-full w-full object-contain" priority />
        </div>

        <p className="text-center text-[10px] uppercase tracking-[0.55em] text-accent">
          RIKO operations
        </p>
        <h1 className="mt-5 text-center font-display text-5xl leading-none text-sand md:text-6xl">
          Admin <span className="font-serif italic text-accent">gateway</span>
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-center text-sm leading-7 text-sand/65">
          Secure access for reservations, menu updates, and service notes.
        </p>

        <LoginForm />
      </section>
    </main>
  );
}
