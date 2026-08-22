interface PageHeaderProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}

export default function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="container-fluid page-header py-5">
      <h1 className="text-center text-white display-6">{title}</h1>
      <ol className="breadcrumb justify-content-center mb-0">
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <li
              key={i}
              className={`breadcrumb-item${isLast ? " active text-white" : ""}`}
            >
              {isLast ? (
                crumb.label
              ) : (
                <a href={crumb.href ?? "#"}>{crumb.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
