import { useRouteError } from "react-router-dom";
import { HomeButton } from "./NavButton";

export default function ErrorPage() {
  const error = useRouteError();
  if (error) console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {error ? <i>{error.statusText || error.message}</i> : null}
      </p>
      <HomeButton></HomeButton>
    </div>
  );
}