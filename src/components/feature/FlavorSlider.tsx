import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FlavorSliderProps {
  labelLeft: string;
  labelRight: string;
  value: number; // 0 to 100
  onChange: (value: number) => void;
  className?: string;
}

export function FlavorSlider({
  labelLeft,
  labelRight,
  value,
  onChange,
  className,
}: FlavorSliderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
        <span
          className={cn(
            "transition-colors",
            value < 40 && "text-primary font-bold",
          )}
        >
          {labelLeft}
        </span>
        <span
          className={cn(
            "transition-colors",
            value > 60 && "text-primary font-bold",
          )}
        >
          {labelRight}
        </span>
      </div>
      <Slider
        defaultValue={[50]}
        value={[value]}
        max={100}
        step={1}
        onValueChange={(vals) => onChange(vals[0])}
        className="w-full"
      />
    </div>
  );
}
