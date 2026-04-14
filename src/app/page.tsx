import { FullscreenScroller } from "@/components/sections/FullscreenScroller";
import { servicesList } from "@/data/services";

export default function Home() {
  return <FullscreenScroller services={servicesList} />;
}
