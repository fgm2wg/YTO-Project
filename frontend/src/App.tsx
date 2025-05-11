import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/hello/")
      .then((res) => res.json())
      .then((data) => setMsg(data.msg))
      .catch(() =>
        setMsg(
          "Error fetching message! Make sure Django is running via: `python manage.py runserver 8000`"
        )
      );
  }, []);

  return (
    <div>
      <h1>{msg || "Loading…"}</h1>
    </div>
  );
}

export default App;
