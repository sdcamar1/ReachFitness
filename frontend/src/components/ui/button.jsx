import React from "react";
import { cn } from "../../lib/utils";

export function Button({ className, variant = "primary", ...props }) {
  return (
    <button
      className={cn(
        "button",
        variant === "outline" && "button-outline",
        variant === "quiet" && "button-quiet",
        className,
      )}
      {...props}
    />
  );
}

