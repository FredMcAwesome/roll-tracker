import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

export default function IndexPage() {
  const maxSession = parseInt(process.env.SESSION_NUMBER || "1");

  const router = useRouter();
  const [route, setRoute] = useState();
  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/" + route);
  };
  return (
    <div>
      <h1>Go to session:</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="route"
          onChange={(e) => {
            setRoute(e.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
