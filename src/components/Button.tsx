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
          ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
          : "border-2 border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
