import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export default function SignOut() {
  return (
    <a
      href={`/api/auth/sign-out`}
      className={cn(buttonVariants({ variant: "destructive" }))}
    >
      Sign Out
    </a>
  );
}
