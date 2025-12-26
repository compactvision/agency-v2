import { useEffect, useState } from "react";

export default function ButtonToTop() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    // Nettoyer l'écouteur d'événements
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Défilement fluide
    });
  };

  return (
    <div
      className={isScrolled ? "progress-wrap active-progress" : "progress-wrap"}
      onClick={scrollToTop} // Ajout de l'événement click
      style={{ cursor: "pointer" }} // Changer le curseur pour indiquer que c'est cliquable
    >
      <svg
        className="progress-circle svg-content"
        width="10px"
        height="10px"
        viewBox="-1 -1 102 102"
      >
        <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
      </svg>
    </div>
  );
}
