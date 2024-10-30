import React from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  genClothingList,
  navlist,
  secondaryNavlist,
  tertiaryNavlist,
} from "./navlist";
import Arrow from "../Icon/Arrow";
import { useCollectionContext } from "../../context/CollectionContextProvider";

const ExpandableButton = ({ labelText, children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      aria-haspopup="listbox"
      className="relative w-full h-full"
      onBlur={() => setOpen((p) => !p)}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="capitalize text-lg font-semibold w-full h-full text-start flex justify-between items-center"
      >
        {labelText}
        <Arrow direction={open ? "down" : "up"} />
      </button>
      <ul className={`${open ? "" : "scale-y-0 duration-300 origin-top"}`}>
        {children}
      </ul>
    </div>
  );
};

function Sidebar({ isShow, onClick }) {
  const { possibleCollectionList } = useCollectionContext();
  const [secondary, setSecondary] = React.useState(null);
  const [secPath, setSecPath] = React.useState(null);
  const [tertiary, setTertiary] = React.useState(null);
  const navigate = useNavigate();
  const { type } = useParams();
  React.useEffect(() => {
    if (!type) return;
    const cat = type.split("&")[0];
    const cur = navlist.find(({ path }) => path === cat);
    if (cur) setSecondary(cur.label);
    setSecPath(cat);
  }, [type]);
  return (
    <div
      className={`fixed top-0 left-0 right-0 h-screen bg-black bg-opacity-50 flex transition-all duration-300 z-20 ${
        isShow ? "" : "-translate-x-full"
      }`}
    >
      <div className="bg-white rounded-r-2xl pt-5">
        <div className="h-full relative">
          {/* primary sidebar */}
          <div
            aria-haspopup="listbox"
            className={`absolute duration-300 h-screen ${
              secondary || tertiary ? "-translate-x-full" : ""
            }`}
          >
            <button
              className="font-bold capitalize flex gap-8 items-center w-full px-4 h-12 text-lg"
              onClick={onClick}
            >
              <span className="text-lg ml-4">home</span>
            </button>
            <ul className="flex flex-col gap-2 text-lg font-semibold px-8 capitalize">
              {navlist.map(({ label, path }) => (
                <li className="w-64 flex items-center h-12" key={path}>
                  <button
                    onClick={() => {
                      setSecondary(label);
                      setSecPath(path);
                    }}
                    className="w-full h-full text-start capitalize"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* secondary sidebar */}
          <div
            aria-haspopup="listbox"
            className={`aboslute duration-300 h-screen ${
              secondary && !tertiary ? "" : "-translate-x-full"
            }`}
          >
            <button
              className="font-bold capitalize flex gap-8 items-center w-full px-4 h-12 border-b border-secondary-300 text-2xl"
              onClick={() => setSecondary(null)}
              aria-haspopup=""
            >
              <Arrow direction="left" />
              {secondary}
            </button>
            <ul className="flex flex-col gap-2 text-lg font-semibold px-8 capitalize">
              {secondaryNavlist(secondary)?.map(({ label, path }) => (
                <li key={path} className="listitem">
                  <NavLink
                    className="flex w-64 h-12 items-center justify-between font-normal"
                    to={genClothingList(path)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              <li className="px-2.5 h-12">
                <ExpandableButton labelText="Collections">
                  {possibleCollectionList.map(({ label, path }) => (
                    <li
                      key={path}
                      className="h-12 full flex items-center pl-4 hover:bg-none text-base font-normal"
                    >
                      <button
                        className="h-full w-full text-start"
                        onClick={() => {
                          setTertiary({ label, path });
                          navigate(genClothingList(`${secPath}&${path}`));
                        }}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ExpandableButton>
              </li>
            </ul>
          </div>
          {/* tertiary sidebar */}
          <div
            className={`aboslute duration-300 h-screen -translate-y-full ${
              tertiary ? "" : "-translate-x-full"
            }`}
          >
            <button
              className="font-bold capitalize flex gap-8 items-center w-full px-4 h-12 border-b border-secondary-300 text-2xl"
              onClick={() => setTertiary(null)}
            >
              <Arrow direction="left" />
              {tertiary?.label}
            </button>
            <ul className="flex flex-col gap-2 text-lg font-semibold px-8 capitalize">
              {tertiaryNavlist(tertiary?.path)?.map(({ label, path }) => (
                <li key={path} className="listitem">
                  <NavLink
                    className="flex w-64 h-12 items-center justify-between font-normal"
                    to={genClothingList(path)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button
        className="w-full h-full lg:hidden"
        onClick={onClick}
        aria-hidden
      ></button>
    </div>
  );
}

export default Sidebar;
