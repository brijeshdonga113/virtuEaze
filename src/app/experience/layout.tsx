import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VirtuEaze — Experience Tomorrow's Homes",
  description:
    "An immersive realtime 3D architectural experience — explore the tower from skyline to floor plan.",
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
