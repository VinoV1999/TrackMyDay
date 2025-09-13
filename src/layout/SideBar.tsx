import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { sidebarRoutes } from "../utils/common";
import { ChevronLeft } from "../utils/Icons";
import { sidebarType } from "../types/enums";
import { UseAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const { googleSignOut } = UseAuth();

  const toggleExpand = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const onClick = (operation: string) => {
    switch (operation) {
        case "logout":
            googleSignOut();
            break;
        default:
            break;

    }
  };

  return (
    <>
      <motion.div
        animate={{ width: isOpen ? 240 : 58 }}
        className="h-screen bg-brand-900 text-white shadow-lg flex-col hidden md:flex"
        {...({} as any)}
      >
        {/* Header with App name + Toggle */}
        <div className={`${isOpen ? "p-4" : "py-4 px-2.5"} flex items-center justify-between`}>
          {isOpen && (
            <span className="text-lg font-bold text-brand-200">JustFocus</span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-brand-700 hover:bg-brand-600"
          >
            <motion.div
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="text-brand-200" size={20} />
            </motion.div>
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col gap-1 px-2">
          {sidebarRoutes.map((item) => {
            const isActive =
              item.type === sidebarType.LINK && location.pathname === item.path;
            const hasChildren = !!item.children;

            return (
              <div key={item.title}>
                <div onClick={() => (hasChildren ? toggleExpand(item.id) : null)}>
                  {item.type === sidebarType.LINK ? (
                    <Link to={!hasChildren ? item.path : "#"}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors 
                          ${isActive ? "bg-brand-700" : "hover:bg-brand-800"}
                          `}
                        {...({} as any)}
                      >
                        <div className="flex items-center gap-3">
                          {item.Icon}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="whitespace-nowrap"
                                {...({} as any)}
                              >
                                {item.title}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Dropdown icon if children exist */}
                        {hasChildren && isOpen && (
                          <motion.div
                            animate={{ rotate: expanded[item.id] ? 90 : -90 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronLeft className="text-brand-200" size={16} />
                          </motion.div>
                        )}
                      </motion.div>
                    </Link>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      onClick={() => onClick(item.operation)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors 
                          ${isActive ? "bg-brand-700" : "hover:bg-brand-800"}
                          `}
                      {...({} as any)}
                    >
                      <div className="flex items-center gap-3">
                        {item.Icon}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="whitespace-nowrap"
                              {...({} as any)}
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Dropdown icon if children exist */}
                      {hasChildren && isOpen && (
                        <motion.div
                          animate={{ rotate: expanded[item.id] ? 90 : -90 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronLeft className="text-brand-200" size={16} />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Sub-routes (children) */}
                <AnimatePresence>
                  {item.children && expanded[item.id] && isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 flex flex-col gap-1 mt-1 overflow-hidden"
                      {...({} as any)}
                    >
                      {item.children.map((child) => {
                        const isChildActive =
                          child.type === sidebarType.LINK &&
                          location.pathname === child.path;
                        return child.type === sidebarType.LINK ? (
                          <Link to={child.path} key={child.title}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                                ${
                                  isChildActive
                                    ? "bg-brand-700"
                                    : "hover:bg-brand-800"
                                }
                              `}
                              {...({} as any)}
                            >
                              {child.Icon}
                              <span className="whitespace-nowrap">
                                {child.title}
                              </span>
                            </motion.div>
                          </Link>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            onClick={() => onClick(child.operation)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                                ${
                                  isChildActive
                                    ? "bg-brand-700"
                                    : "hover:bg-brand-800"
                                }
                              `}
                            {...({} as any)}
                          >
                            {child.Icon}
                            <span className="whitespace-nowrap">
                              {child.title}
                            </span>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </motion.div>
      <div className="flex md:hidden w-screen py-4 bg-brand-900 text-white">
          <nav className="flex gap-1 px-2 justify-evenly w-screen">
          {sidebarRoutes.map((item) => {
            const isActive =
              item.type === sidebarType.LINK && location.pathname === item.path;
            const hasChildren = !!item.children;

            return (
              <div key={item.title}>
                <div onClick={() => (hasChildren ? toggleExpand(item.id) : null)}>
                  {item.type === sidebarType.LINK ? (
                    <Link to={!hasChildren ? item.path : "#"}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors 
                          ${isActive ? "bg-brand-700" : "hover:bg-brand-800"}
                          `}
                        {...({} as any)}
                      >
                        <div className="flex items-center gap-3">
                          {item.Icon}
                        </div>
                      </motion.div>
                    </Link>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      onClick={() => onClick(item.operation)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors 
                          ${isActive ? "bg-brand-700" : "hover:bg-brand-800"}
                          `}
                      {...({} as any)}
                    >
                      <div className="flex items-center gap-3">
                        {item.Icon}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sub-routes (children) */}
                <AnimatePresence>
                  {item.children && expanded[item.id] && isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 flex flex-col gap-1 mt-1 overflow-hidden"
                      {...({} as any)}
                    >
                      {item.children.map((child) => {
                        const isChildActive =
                          child.type === sidebarType.LINK &&
                          location.pathname === child.path;
                        return child.type === sidebarType.LINK ? (
                          <Link to={child.path} key={child.title}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                                ${
                                  isChildActive
                                    ? "bg-brand-700"
                                    : "hover:bg-brand-800"
                                }
                              `}
                              {...({} as any)}
                            >
                              {child.Icon}
                              <span className="whitespace-nowrap">
                                {child.title}
                              </span>
                            </motion.div>
                          </Link>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            onClick={() => onClick(child.operation)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                                ${
                                  isChildActive
                                    ? "bg-brand-700"
                                    : "hover:bg-brand-800"
                                }
                              `}
                            {...({} as any)}
                          >
                            {child.Icon}
                            <span className="whitespace-nowrap">
                              {child.title}
                            </span>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
