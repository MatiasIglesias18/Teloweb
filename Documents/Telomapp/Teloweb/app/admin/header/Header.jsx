import MenuButton from "./MenuButton";

const Header = () => {
  return <header className="px-4 py-2 h-14 bg-primary text-white flex flex-row justify-between items-center"><span className="font-semibold text-lg">Mi Dashboard</span><MenuButton /></header>;
};

export default Header;
