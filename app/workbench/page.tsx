import { Metadata } from "next";
import WorkbenchClient from "./WorkbenchClient";

export const metadata: Metadata = {
  title: "Workbench | KaruviLab",
  description: "Multi-tab workbench for splitting and running multiple tools simultaneously.",
};

export default function WorkbenchPage() {
  return <WorkbenchClient />;
}
