"use client";

import Link from "next/link";
import headerNavLinks from "../../data/headerNavLinks";
import {
  Menu,
  Transition,
  MenuItems,
  MenuItem,
  MenuButton,
} from "@headlessui/react";
import { Fragment } from "react";

const MobileNav = () => {
  return (
    <Menu as="div" className="relative inline-block text-left sm:hidden">
      <div>
        <MenuButton
          className="inline-flex justify-center px-2 text-sm font-medium"
          aria-label="Navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-zinc-500 dark:text-zinc-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9h16.5m-16.5 6.75h16.5"
            />
          </svg>
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute rounded-md bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-lg z-50 w-20 px-2">
          <div className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-300 text-sm divide-y divide-zinc-50 dark:divide-zinc-700">
            {headerNavLinks.map((link) => {
              return (
                <div key={link.title} className="py-2">
                  <MenuItem>
                    <Link href={link.href} className="">
                      {link.title}
                    </Link>
                  </MenuItem>
                </div>
              );
            })}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default MobileNav;
