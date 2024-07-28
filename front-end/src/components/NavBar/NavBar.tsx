import { Link } from "@tanstack/react-router";

const NavBar = () => {
  return (
    <>
      <div className="flex justify-between gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/create-expenses" className="[&.active]:font-bold">
          create-expenses
        </Link>
        <Link to="/logs" className="[&.active]:font-bold">
          Change logs
        </Link>
        <Link to="/analytics" className="[&.active]:font-bold">
          analytics
        </Link>
      </div>
    </>
  );
};

export default NavBar;
