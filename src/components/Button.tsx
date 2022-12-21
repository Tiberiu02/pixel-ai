import { twMerge } from "tailwind-merge";

export function Button({
  children,
  onClick,
  className,
  special,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  special?: boolean;
}) {
  return (
    <div
      className={twMerge(
        "flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 font-semibold no-underline",
        special
          ? "bg-gradient-to-t from-yellow-600 to-yellow-300 text-black"
          : "bg-zinc-800",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
