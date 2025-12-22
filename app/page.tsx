import SignOut from "@/components/sign-out";
import Client from "./client";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">Music Bingo</h1>
          <SignOut />
        </div>
      </header>
      <Client />
    </div>
  );
}
