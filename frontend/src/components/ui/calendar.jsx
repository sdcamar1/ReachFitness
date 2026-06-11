import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "../../lib/utils";

export function Calendar({ className, classNames, ...props }) {
  return (
    <DayPicker
      className={cn("reach-calendar", className)}
      classNames={{
        months: "calendar-months",
        month: "calendar-month",
        month_caption: "calendar-caption",
        caption_label: "calendar-caption-label",
        nav: "calendar-nav",
        button_previous: "calendar-nav-button",
        button_next: "calendar-nav-button",
        month_grid: "calendar-table",
        weekdays: "calendar-weekdays",
        weekday: "calendar-weekday",
        week: "calendar-week",
        day: "calendar-day",
        day_button: "calendar-day-button",
        selected: "calendar-selected",
        today: "calendar-today",
        outside: "calendar-outside",
        disabled: "calendar-disabled",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft size={16} />
          ) : (
            <ChevronRight size={16} />
          ),
      }}
      {...props}
    />
  );
}

