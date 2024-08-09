import { FunctionComponent, ReactNode } from "react";

interface SideMenuItemProps {
  text: string;
  link: string;
  children?: ReactNode;
}

const SideMenuItem: FunctionComponent<SideMenuItemProps> = ({
  text,
  link,
  children,
}) => {
  return (
    <li>
      <a
        href={link}
        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        {children}
        <span className="ms-3">{text}</span>
      </a>
    </li>
  );
};

export default SideMenuItem;
