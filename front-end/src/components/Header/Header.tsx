import Avatar from "./components/Avatar";
import Logo from "./components/Logo";
import { Theme } from "./components/Theme";

const Header = () => {
  return (
    <header className="flex items-center justify-between">
      <Theme />
      <Logo />
      <Avatar />
    </header>
  );
};

export default Header;
