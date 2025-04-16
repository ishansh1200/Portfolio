import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn, scrollTo } from "@/lib/utils";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import Preloader from "@/components/Preloader";
import styles from "@/styles/Container.module.css";

type IconProps = {
  ["data-hide"]: boolean;
};

type ContainerProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
};

type NavProps = {
  text: string;
  href: string;
  i: number;
  className?: string;
};

const variants = {
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.12 },
  }),
  hidden: { opacity: 0 },
};

const navLinks = [
  { href: "#Home", text: "Home" },
  { href: "#About", text: "About" },
  { href: "#projects", text: "Projects" },
  { href: "#services", text: "Services" },
];

function handleClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  const href = e.currentTarget.getAttribute("href");
  if (!href?.startsWith("#")) return;

  e.preventDefault();
  const section = document.querySelector(href);
  if (section) {
    const heading = section.querySelector("h2, h1");
    scrollTo(heading ?? section);
  }
}

function NavItem(props: NavProps) {
  return (
    <motion.li
      className={props.className}
      variants={variants}
      custom={props.i}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <a
        href={props.href}
        onClick={handleClick}
        className={cn(props.i === 0 && "nav-active", "nav-link")}
      >
        {props.text}
      </a>
    </motion.li>
  );
}

export default function Container(props: ContainerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { children, ...customMeta } = props;
  const router = useRouter();

  const meta = {
    title: "Ishan Sharma",
    description: "Full-stack developer and TypeScript enthusiast",
    image: "/assets/logo.webp",
    type: "website",
    ...customMeta,
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = "default";
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
      </Head>

      <nav
        className={cn(
          "fixed w-full z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/90 backdrop-blur shadow-sm"
            : "bg-transparent",
          styles.nav
        )}
      >
        <div className="container flex items-center justify-between h-16">
          <Link
            href="https://www.linkedin.com/in/ishan-sharma-b5b0982b2/"
            className="text-xl font-bold"
          >
            Ishan Sharma
          </Link>

          <ul className="hidden md:flex space-x-8">
            {navLinks.map((link, i) => (
              <NavItem key={link.href} {...link} i={i} />
            ))}
          </ul>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent"
          >
            <MenuIcon data-hide={isOpen} />
            <CrossIcon data-hide={!isOpen} />
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-background md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
            >
              <div className="container h-full flex flex-col">
                <div className="flex justify-between items-center h-16">
                  <span className="text-xl font-bold">Menu</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-accent"
                  >
                    <CrossIcon data-hide={false} />
                  </button>
                </div>

                <ul className="flex-1 space-y-6 py-8">
                  {navLinks.map((link, i) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          handleClick(e);
                          setIsOpen(false);
                        }}
                        className="text-2xl font-medium"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>

      <main className={cn("container", props.className)}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement<{ className?: string }>(child)) return child;

          return React.cloneElement(child, {
            className: cn(child.props.className, "py-24"),
          });
        })}
      </main>

      <Footer />
    </>
  );
}

const MenuIcon = ({ ...props }: IconProps) => (
  <svg
    {...props}
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CrossIcon = ({ ...props }: IconProps) => (
  <svg
    {...props}
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
