type NewsItem = {
  id: number;
  headline: string;
  source: string;
  url: string;
  datetime: number;
};

export default function NewsList({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">No news available right now.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.slice(0, 10).map((item) => (
        <li key={item.id} className="border-b pb-3 last:border-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline"
          >
            {item.headline}
          </a>
          <div className="mt-1 text-xs text-gray-500">
            {item.source} ·{" "}
            {new Date(item.datetime * 1000).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
        </li>
      ))}
    </ul>
  );
}
