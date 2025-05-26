import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center p-6 bg-black/40">
      <SignIn>
        <h1>coustom</h1>
      </SignIn>
    </div>
  );
}
