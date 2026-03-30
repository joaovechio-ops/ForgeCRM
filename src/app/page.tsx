import { redirect } from "next/navigation";

export default function Root() {
  redirect("/dashboard"); // Redirect to the new dashboard route for consistency
}
