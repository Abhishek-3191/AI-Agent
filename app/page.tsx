import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import CreateAgentSection from "./dashboard/_components/CreateAgentSection";
import AiAgentTab from "./dashboard/_components/AiAgentTab";

export default function Home() {
  return (
   <h1>
    Hello world
    <UserButton></UserButton>
   </h1>
  );
}
