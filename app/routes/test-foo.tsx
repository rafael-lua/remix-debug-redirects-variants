/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ActionFunctionArgs,
  json as jsonServer,
  redirect as redirectServer,
} from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  useFetcher,
  useSubmit,
  redirect,
  json,
} from "@remix-run/react";
import { useEffect } from "react";

export const loader = async () => {
  return jsonServer({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const actionPayload = (await request.clone().json()) as {
    intent?:
      | "clientRedirect"
      | "clientRedirectThrow"
      | "serverRedirect"
      | "serverRedirectThrow";
  };

  console.log("actionPayload", actionPayload);

  if (actionPayload.intent === "serverRedirect") {
    console.log("serverRedirect");
    return redirectServer("/test-bar");
  }

  if (actionPayload.intent === "serverRedirectThrow") {
    console.log("serverRedirectThrow");
    throw redirectServer("/test-bar");
  }

  return json({});
};

export async function clientAction({
  request,
  serverAction,
}: ClientActionFunctionArgs) {
  const actionPayload = (await request.clone().json()) as {
    intent?:
      | "clientRedirect"
      | "clientRedirectThrow"
      | "serverRedirect"
      | "serverRedirectThrow";
  };

  console.log("client action");

  // Erro: "redirect" é um import de servidor, não é válido aqui.
  if (actionPayload.intent === "clientRedirect") {
    console.log("clientRedirect");
    return redirect("/test-bar");
  }

  // Erro: "redirect" é um import de servidor, não é válido aqui.
  if (actionPayload.intent === "clientRedirectThrow") {
    console.log("clientRedirectThrow");
    throw redirect("/test-bar");
  }

  if (actionPayload.intent === "serverRedirect") {
    console.log("serverRedirect");
    // Redirect acontece como esperado no fetcher.
    return await serverAction();
  }

  if (actionPayload.intent === "serverRedirectThrow") {
    console.log("serverRedirectThrow");

    // Throw acontece, se der catch aqui via ser pego. Se não der throw, o redirect acontece como esperado no fetcher.
    return await serverAction();
  }

  return json({});
}

export default function Index() {
  const fetcher = useFetcher();
  const submit = useSubmit();

  const submitRedirect = (intent: string) => {
    submit({ intent }, { method: "post", encType: "application/json" });
  };

  const fetcherRedirect = (intent: string) => {
    fetcher.submit({ intent }, { method: "post", encType: "application/json" });
  };

  useEffect(() => {
    console.log(fetcher.state);
  }, [fetcher]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Test Foo</h1>

      <div style={{ display: "flex", gap: "5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p>submits (form style)</p>

          <button onClick={() => submitRedirect("clientRedirect")}>
            clientRedirect
          </button>

          <button onClick={() => submitRedirect("clientRedirectThrow")}>
            clientRedirectThrow
          </button>

          <button onClick={() => submitRedirect("serverRedirect")}>
            serverRedirect
          </button>

          <button onClick={() => submitRedirect("serverRedirectThrow")}>
            serverRedirectThrow
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p>fetchers (fetch style)</p>

          <button onClick={() => fetcherRedirect("clientRedirect")}>
            clientRedirect
          </button>

          <button onClick={() => fetcherRedirect("clientRedirectThrow")}>
            clientRedirectThrow
          </button>

          <button onClick={() => fetcherRedirect("serverRedirect")}>
            serverRedirect
          </button>

          <button onClick={() => fetcherRedirect("serverRedirectThrow")}>
            serverRedirectThrow
          </button>
        </div>
      </div>
    </div>
  );
}
