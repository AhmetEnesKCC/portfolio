import * as React from "react";

import { cn } from "@/src/lib/utils";

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-200",
        className,
      )}
      {...props}
    />
  );
}

