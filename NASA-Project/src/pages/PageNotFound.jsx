import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <main className="not-found">
      <h1 className="normalTittle">Lost in space</h1>
      <p className="normalText">This page does not exist.</p>
      <Link to="/" className="btn normalText">
        Back to home
      </Link>
    </main>
  );
}

export default PageNotFound;
