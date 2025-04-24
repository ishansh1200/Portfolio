import Container from "@/components/Container";
import { useEffect, useRef, Suspense, useState } from "react";
import styles from "@/styles/Home.module.css";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Code2,
  Frame,
  SearchCheck,
  Eye,
  MonitorSmartphone,
} from "lucide-react";

import Spline from "@splinetool/react-spline";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import VanillaTilt from "vanilla-tilt";
import { motion } from "framer-motion";

// Define types for Spline and Locomotive Scroll
interface SplineApp {
  orbitControls?: {
    enabled: boolean;
  };
  enterFrame?: () => void;
  canvas?: HTMLCanvasElement & {
    style: CSSStyleDeclaration;
  };
}

// Define a type for Locomotive Scroll instance
type LocomotiveScrollType = {
  scrollTo: (target: HTMLElement | string | number, options?: { offset?: number; duration?: number; disableLerp?: boolean }) => void;
  destroy: () => void;
  on: (event: string, callback: () => void) => void;
  update: () => void;
};

const aboutStats = [
  { label: "Years of experience", value: "1+" },
  { label: "Technologies mastered", value: "5+" },
  { label: "Projects worked on", value: "5+" },
];

const projects = [
  {
    title: "Innovriti",
    description: "A promotional website for our college's annual Cultrual-technical fest.",
    image: "/assets/innovriti.webm",
    href: "https://innovriti.vercel.app/",
  },
  {
    title: "Youtube V2",
    description: "A fully functional youtube like website.",
    image: "/assets/youtube.webm",
    href: "https://youtube-clone-rho-plum.vercel.app/",
  },
  {
    title: "Apple iPhone 15",
    description: "A promotional website for the iPhone 15 pro",
    image: "/assets/apple.webm",
    href: "https://apple-clone-sandy-zeta.vercel.app/",
  },
];

const services = [
  {
    service: "Frontend Development",
    description:
      "Creating stellar user interfaces and web experiences using the latest technologies.",
    icon: Code2,
  },
  {
    service: "UI/UX Design",
    description:
      "Building intuitive, user-centric designs that drive engagement and conversion.",
    icon: Frame,
  },
  {
    service: "SEO Optimization",
    description:
      "Enhancing your website's visibility in search engines for increased organic traffic.",
    icon: SearchCheck,
  },
  {
    service: "Responsive Design",
    description:
      "Designing websites that look and perform equally well on all devices and screen sizes.",
    icon: MonitorSmartphone,
  },
  {
    service: "Backend Development",
    description:
      "Developing robust, scalable server-side logic for a wide range of web applications.",
    icon: Eye,
  },
];

export default function Home() {
  const refScrollContainer = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [locomotiveScroll, setLocomotiveScroll] = useState<LocomotiveScrollType | null>(null);
  const splineRef = useRef<SplineApp | null>(null);

  // Button hover states for all "Get in touch" buttons
  const [isIntroButtonHovered, setIsIntroButtonHovered] = useState(false);
  const [isContactButtonHovered, setIsContactButtonHovered] = useState(false);

  // Function to make the 3D model static
  const onSplineLoad = (splineApp: SplineApp) => {
    splineRef.current = splineApp;
    
    // Make the 3D model static by disabling interactions
    if (splineApp) {
      // Disable orbit controls safely
      if (splineApp.orbitControls) {
        splineApp.orbitControls.enabled = false;
      }
      
      // Disable events safely
      if (splineApp.canvas) {
        splineApp.canvas.style.pointerEvents = 'none';
      }
    }
  };

  // handle scroll
  useEffect(() => {
    // Fall back to native scrolling if Locomotive fails to initialize
    let usingNativeScroll = true;
    
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    async function getLocomotive() {
      try {
        // Dynamically import Locomotive Scroll
        const LocomotiveModule = await import("locomotive-scroll");
        const Locomotive = LocomotiveModule.default;
        
        // Create the Locomotive Scroll instance and properly type it
        const locoScroll = new Locomotive({
          el: refScrollContainer.current ?? undefined,
          smooth: true,
          offset: [0, 0],
          multiplier: 3, // Adjust scrolling speed (lower = slower)
          lerp: 0.08,    // Linear interpolation (lower = smoother)
        
        }) as unknown as LocomotiveScrollType;
        
        setLocomotiveScroll(locoScroll);
        usingNativeScroll = false;
        
        // Update Locomotive Scroll when content changes
        setTimeout(() => {
          if (locoScroll) {
            locoScroll.update();
          }
        }, 500);
        
        // Add event listener for hash changes
        document.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          
          // Check if clicked element is a navigation link
          if (target.classList.contains('nav-link')) {
            e.preventDefault();
            
            const href = target.getAttribute('href');
            if (href && href.startsWith('#')) {
              const targetId = href.substring(1);
              const targetSection = document.getElementById(targetId);
              
              if (targetSection && locoScroll) {
                // Scroll to section with offset
                locoScroll.scrollTo(targetSection, {
                  offset: 0,
                  duration: 1000,
                  disableLerp: false,
                });
              }
            }
          }
        });
      } catch (error) {
        console.error("Failed to load locomotive-scroll:", error);
        // Fall back to native scroll
        usingNativeScroll = true;
        
        // Make sure the container is scrollable
        if (refScrollContainer.current) {
          refScrollContainer.current.style.height = 'auto';
          refScrollContainer.current.style.overflow = 'visible';
        }
      }
    }

    function handleScroll() {
      let current = "";
      const scrollY = window.scrollY || window.pageYOffset;
      setIsScrolled(scrollY > 0);

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 250) {
          current = section.getAttribute("id") ?? "";
        }
      });

      navLinks.forEach((li) => {
        li.classList.remove("nav-active");

        if (li.getAttribute("href") === `#${current}`) {
          li.classList.add("nav-active");
        }
      });
    }

    void getLocomotive();
    window.addEventListener("scroll", handleScroll);

    // Set overflow to visible in case it's being blocked
    document.body.style.overflow = 'visible';
    if (refScrollContainer.current) {
      refScrollContainer.current.style.overflow = 'visible';
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Clean up locomotive scroll instance
      if (locomotiveScroll) {
        locomotiveScroll.destroy();
      }
    };
  }, []); // Remove locomotiveScroll from dependencies to avoid recreating on every state change

  useEffect(() => {
    if (!carouselApi) return;

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

  // card hover effect
  useEffect(() => {
    const tiltElements = Array.from(document.querySelectorAll<HTMLElement>("#tilt"));
    VanillaTilt.init(tiltElements, {
      speed: 300,
      glare: true,
      "max-glare": 0.1,
      gyroscope: true,
      perspective: 900,
      scale: 0.9,
    });
  }, []);

  return (
    <Container>
      <div 
        ref={refScrollContainer} 
        className="scroll-container"
        style={{ height: 'auto', overflow: 'visible' }}
      >
        <Gradient />

        {/* Intro - Reduced vertical spacing */}
        <section
          data-scroll-section
          id="Home"
          className="flex w-full flex-col items-center xl:mt-0 xl:min-h-[80vh] xl:flex-row xl:justify-between mt-10 mb-12"
        >
          <div className={styles.intro}>
            <div
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed=".09"
              className="flex flex-row items-center space-x-1.5"
            >
              <span className={styles.pill}>next.js</span>
              <span className={styles.pill}>tailwindcss</span>
              <span className={styles.pill}>typescript</span>
              <span className={styles.pill}>three.js</span>
              <span className={styles.pill}>next.js</span>
            </div>
            <div>
              <h1
                data-scroll
                data-scroll-speed=".06"
                data-scroll-direction="horizontal"
              >
                <span className="text-6xl tracking-tighter text-foreground 2xl:text-8xl">
                  Hello, I&apos;m
                  <br />
                </span>
                <span className="clash-grotesk text-gradient text-6xl 2xl:text-8xl">
                  Ishan Sharma.
                </span>
              </h1>
              <p
                data-scroll
                data-scroll-speed=".06"
                className="mt-1 max-w-lg tracking-tight text-muted-foreground 2xl:text-xl"
              >
                An aspiring full-stack developer with a passion for
                crafting unique digital experiences.
              </p>
            </div>
            <span
              data-scroll
              data-scroll-speed=".06"
              className="flex flex-row items-center space-x-1.5 pt-3"
            >
              <Button
                onMouseEnter={() => setIsIntroButtonHovered(true)}
                onMouseLeave={() => setIsIntroButtonHovered(false)}
                className="relative overflow-hidden transition-all duration-300"
              >
                <span className={`absolute inset-0 flex items-center justify-center text-[0.6rem] transition-opacity duration-300 ${isIntroButtonHovered ? 'opacity-100' : 'opacity-0'}`}>
                  sharma.ishan1910@gmail.com
                </span>
                <span className={`flex items-center transition-opacity duration-300 ${isIntroButtonHovered ? 'opacity-0' : 'opacity-100'}`}>
                  Get in touch <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </Button>
              <Link href="/assets/cv.pdf" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  Download CV
                </Button>
              </Link>
            </span>
          </div>
          <div
            data-scroll
            data-scroll-speed="-.01"
            id={styles["canvas-container"]}
            className="mt-4 h-full w-full xl:mt-0 pointer-events-none"
          >
            <Suspense fallback={<span>Loading...</span>}>
              <Spline 
                scene="/assets/scene.splinecode" 
                onLoad={onSplineLoad}
                style={{ pointerEvents: 'none' }}
              />
            </Suspense>
          </div>
        </section>

        {/* About - Reduced vertical spacing */}
        <section data-scroll-section className="mt-0" id="About">
          <div
            data-scroll
            data-scroll-speed=".4"
            data-scroll-position="top"
            className="flex max-w-6xl flex-col justify-start space-y-1"
          >
            <span className="text-6xl tracking-tighter text-foreground 2xl:text-6xl">
              ABOUT ME
            </span>
            <h2 className="py-2 text-3xl font-light leading-normal tracking-tighter text-foreground xl:text-[40px]">
              I am currently pursuing a degree in {' '}
              <span className="font-medium">BTech-Artificial Intelligence</span>, and I decided to pursue my passion for programming. I started taking online courses and reading documentation about {' '}
              <span className="font-medium">full-stack web development</span>.
              <span className="italic"> My favorite part of programming</span> is the problem-solving aspect. I love the feeling of finally figuring out a solution to a problem. The stack I am aiming towards is
              <span className="font-medium"> React, Next.js, Node.js, and MongoDB</span>.
              I am also familiar with C++, <span className="font-medium"> Python and JAVA </span>and am always looking to learn new technologies. I am also intersted in designing, with experience in <span className="font-medium"> Figma, Canva and Photoshop. </span>
            </h2>

            <h2 className="py-2 text-3xl font-light leading-normal tracking-tighter text-foreground xl:text-[40px]">
              <span className="italic">When I&apos;m not coding</span>, I enjoy playing board games, playing sports, mostly football, and playing guitar. I also enjoy {" "}
              <span className="font-medium">learning new things</span>. I am currently trying to learn {" "}
              <span className="font-medium">photo and video editing.</span>
            </h2>

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 mt-1">
              {aboutStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center xl:items-start xl:text-start"
                >
                  <span className="clash-grotesk text-gradient text-4xl font-semibold tracking-tight xl:text-6xl">
                    {stat.value}
                  </span>
                  <span className="tracking-tight text-muted-foreground xl:text-lg">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects section */}
        <section data-scroll-section className="mt-6" id="projects">
          {/* Gradient */}
          <div className="relative isolate">
            <div
              className="absolute inset-x-0 transform-gpu overflow-hidden blur-[100px]"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary via-primary to-secondary opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>
          <div data-scroll data-scroll-speed=".4" className="mt-4 mb-8">
            <span className="text-gradient clash-grotesk text-sm font-semibold tracking-tighter">
              ✨ Projects
            </span>
            <h2 className="mt-1 text-4xl font-semibold tracking-tight xl:text-6xl">
              Streamlined digital experiences.
            </h2>
            <p className="mt-1 text-base tracking-tight text-muted-foreground xl:text-lg">
              I&apos;ve worked on a variety of projects, from small websites to
              large-scale web applications. Here are some of my favorites:
            </p>

            {/* Carousel */}
            <div className="mt-4">
              <Carousel setApi={setCarouselApi} className="w-full">
                <CarouselContent>
                  {projects.map((project) => (
                    <CarouselItem key={project.title} className="md:basis-1/2">
                      <Card id="tilt">
                        <CardHeader className="p-0">
                          <Link href={project.href} target="_blank" passHref>
                            {project.image.endsWith(".webm") ? (
                              <video
                                src={project.image}
                                autoPlay
                                loop
                                muted
                                className="aspect-video h-full w-full rounded-t-md bg-primary object-cover"
                              />
                            ) : (
                              <Image
                                src={project.image}
                                alt={project.title}
                                width={600}
                                height={300}
                                quality={100}
                                className="aspect-video h-full w-full rounded-t-md bg-primary object-cover"
                              />
                            )}
                          </Link>
                        </CardHeader>
                        <CardContent className="absolute bottom-0 w-full bg-background/50 backdrop-blur">
                          <CardTitle className="border-t border-white/5 p-3 text-base font-normal tracking-tighter">
                            {project.description}
                          </CardTitle>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <div className="py-1 text-center text-sm text-muted-foreground">
                <span className="font-semibold">
                  {current} / {count}
                </span>{" "}
                projects
              </div>
            </div>
          </div>
        </section>

        {/* Services section */}
        <section data-scroll-section id="services">
          <div
            data-scroll
            data-scroll-speed=".4"
            data-scroll-position="top"
            className="mt-1 mb-6 flex flex-col justify-start space-y-3"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                staggerChildren: 0.5,
              }}
              viewport={{ once: true }}
              className="grid items-center gap-1 md:grid-cols-2 xl:grid-cols-3"
            >
              <div className="flex flex-col py-1 xl:p-2">
                <h2 className="text-5xl font-medium tracking-tight">
                  Need more info?
                  <br />
                  <span className="text-gradient clash-grotesk tracking-normal">
                    I got you.
                  </span>
                </h2>
                <p className="mt-1 tracking-tighter text-secondary-foreground">
                  Here are some of the services I offer. If you have any
                  questions, feel free to reach out.
                </p>
              </div>
              {services.map((service) => (
                <div
                  key={service.service}
                  className="flex flex-col items-start rounded-md bg-white/5 p-4 shadow-md backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-md"
                >
                  <service.icon className="my-1 text-primary" size={20} />
                  <span className="text-lg tracking-tight text-foreground">
                    {service.service}
                  </span>
                  <span className="mt-1 tracking-tighter text-muted-foreground">
                    {service.description}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact section */}
        <section id="contact" data-scroll-section className="mt-6 mb-8">
          <div
            data-scroll
            data-scroll-speed=".4"
            data-scroll-position="top"
            className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-primary/[6.5%] to-white/5 px-6 py-6 text-center xl:py-8"
          >
            <h2 className="text-4xl font-medium tracking-tighter xl:text-6xl">
              Let&apos;s work{" "}
              <span className="text-gradient clash-grotesk">together.</span>
            </h2>
            <p className="mt-1 text-base tracking-tight text-muted-foreground xl:text-lg">
              I&apos;m currently available for freelance work and open to
              discussing new projects.
            </p>
            <Button
              onMouseEnter={() => setIsContactButtonHovered(true)}
              onMouseLeave={() => setIsContactButtonHovered(false)}
              className="mt-3 relative overflow-hidden transition-all duration-300"
            >
              <span className={`absolute inset-0 flex items-center justify-center text-[0.55rem] transition-opacity duration-300 ${isContactButtonHovered ? 'opacity-100' : 'opacity-0'}`}>
                sharma.ishan1910@gmail.com
              </span>
              <span className={`flex items-center transition-opacity duration-300 ${isContactButtonHovered ? 'opacity-0' : 'opacity-100'}`}>
                Get in touch
              </span>
            </Button>
          </div>
        </section>
      </div>
    </Container>
  );
}

function Gradient() {
  return (
    <>
      {/* Upper gradient */}
      <div className="absolute -top-40 right-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <svg
          className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
            fillOpacity=".1"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#7980fe" />
              <stop offset={1} stopColor="#f0fff7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Lower gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <svg
          className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
            fillOpacity=".1"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9A70FF" />
              <stop offset={1} stopColor="#838aff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
}