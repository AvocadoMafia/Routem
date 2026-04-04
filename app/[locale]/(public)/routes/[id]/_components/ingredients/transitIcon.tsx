"use client";

import { Footprints, TrainFront, Bus, Car, Navigation } from "lucide-react";
import { ReactNode } from "react";

export function getTransitIcon(mode: string): ReactNode {
  switch (mode) {
    case "WALK":
      return <Footprints className="w-5 h-5" />;
    case "TRAIN":
      return <TrainFront className="w-5 h-5" />;
    case "BUS":
      return <Bus className="w-5 h-5" />;
    case "CAR":
      return <Car className="w-5 h-5" />;
    default:
      return <Navigation className="w-5 h-5" />;
  }
}

type TransitIconProps = {
  mode: string;
  className?: string;
};

export default function TransitIcon({ mode, className = "w-5 h-5" }: TransitIconProps) {
  switch (mode) {
    case "WALK":
      return <Footprints className={className} />;
    case "TRAIN":
      return <TrainFront className={className} />;
    case "BUS":
      return <Bus className={className} />;
    case "CAR":
      return <Car className={className} />;
    default:
      return <Navigation className={className} />;
  }
}
