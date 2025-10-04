import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`rounded-lg border bg-white p-4 shadow-sm ${className ?? ""}`} />
  );
}
