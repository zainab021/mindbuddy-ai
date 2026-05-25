export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh flex items-center justify-center px-4 bg-[#060610]">
      {/* Ambient orbs */}
      <div className="orb orb-violet w-[500px] h-[500px] -top-40 left-1/4 opacity-10" />
      <div className="orb orb-blue w-[400px] h-[400px] bottom-0 right-1/4 opacity-10" />
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
