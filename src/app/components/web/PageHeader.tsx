import Link from "next/link";

interface PageHeaderProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}

export default function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="bg-[#fff0ad] py-8 px-5 border-b border-[#d20b4f]/20">
      <div className="mx-auto max-w-[1100px] text-center">
        <h1 className="heading-font text-2xl sm:text-3xl font-bold text-[#d20b4f] mb-3">
          {title}
        </h1>
        <nav className="flex items-center justify-center gap-2 text-sm font-bold text-black">
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <span key={i} className="flex items-center gap-2">
                {isLast ? (
                  <span className="text-[#d20b4f]">{crumb.label}</span>
                ) : (
                  <>
                    <Link
                      href={crumb.href ?? "/"}
                      className="text-black hover:text-[#d20b4f] transition no-underline"
                    >
                      {crumb.label}
                    </Link>
                    <span className="text-black">/</span>
                  </>
                )}
              </span>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
