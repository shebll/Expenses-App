import Logo from "./components/Logo";
import Logout from "./components/Logout";
import { Theme } from "./components/Theme";

const Header = () => {
  return (
    <header className="flex justify-between items-center">
      <Theme />
      <Logo />
      <Logout />
    </header>
  );
};

export default Header;
