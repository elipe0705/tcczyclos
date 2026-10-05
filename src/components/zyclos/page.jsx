export function Page({ title, eyebrow, description, actions, children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-col justify-between gap-5 border-b pb-7 md:flex-row md:items-end">
        <div>
          {eyebrow && <p className="mb-2 text-xs font-bold uppercase text-secondary">{eyebrow}</p>}
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
