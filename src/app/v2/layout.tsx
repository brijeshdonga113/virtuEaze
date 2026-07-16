import { Kanit } from "next/font/google";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${kanit.className} bg-[#0C0C0C] text-[#D7E2EA]`}
      style={{ overflowX: "clip" }}
    >
      {children}
    </div>
  );
}
