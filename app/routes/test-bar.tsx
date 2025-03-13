import { Link } from "@remix-run/react";

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Test Bar</h1>

      <br />
      <br />

      <Link to="/test-foo"></Link>
    </div>
  );
}
