import React from "react";

import { useRouteError } from "react-router";

export default function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (error.status) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
