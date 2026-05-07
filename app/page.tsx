import { FadeIn } from "../components/ui/MotionWrapper";
export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6">
      <FadeIn delay={0.1}>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-center text-matteBlack leading-tight">
          Welcome to <span className="text-accentBlue">Ferixo</span>
        </h1>
      </FadeIn>
      
      <FadeIn delay={0.3}>
        <p className="mt-6 text-lg md:text-xl text-matteBlack/70 max-w-2xl text-center leading-relaxed">
          A lightning-fast, premium e-commerce ecosystem built for seamless performance.
        </p>
      </FadeIn>

      <FadeIn delay={0.5}>
        <button className="mt-10 px-8 py-4 bg-accentBlue text-white text-lg font-semibold rounded-full hover:bg-accentBlue/90 transition-all shadow-lg shadow-accentBlue/20 focus:ring-4 focus:ring-accentBlue/50 outline-none active:scale-95">
          Explore Ecosystem
        </button>
      </FadeIn>
    </section>
  );
}