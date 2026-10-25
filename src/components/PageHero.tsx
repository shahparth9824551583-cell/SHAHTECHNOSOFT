export default function PageHero({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="bg-gradient-to-br from-navy-900 via-navy to-navy-700 py-14 text-white">
      <div className="container-x">
        <h1 className="font-display text-3xl font-bold !text-white sm:text-4xl">{title}</h1>
        <div className="mt-2 h-1 w-16 rounded bg-gold" />
        {children && <p className="mt-4 max-w-2xl text-slate-200">{children}</p>}
      </div>
    </section>
  );
}
