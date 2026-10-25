import Image from "next/image";

/** The official logo, exactly as supplied by the owner (public/logo-full.jpg). Its background is #070707, so always place it on bg-ink. */
export function LogoFull({ width = 360 }: { width?: number }) {
  return <Image src="/logo-full.jpg" alt="SHAH TECHNOSOFT - Ideas to Digital Solutions" width={width} height={Math.round((width * 888) / 904)} priority />;
}

export default function Logo() {
  return <LogoFull width={80} />;
}
