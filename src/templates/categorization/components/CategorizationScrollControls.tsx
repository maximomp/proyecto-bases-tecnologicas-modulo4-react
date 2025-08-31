import React, { useEffect, useState } from "react";

interface Props {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  innerRef: React.RefObject<HTMLDivElement | null>;
  shiftX: number;
  onShift: (dir: number) => void;
  setShift?: React.Dispatch<React.SetStateAction<number>>;
  leftAriaLabel?: string;
  rightAriaLabel?: string;
}

// Controles de desplazamiento para la barra de categorización.
// Comprueba overflow, corrige el desplazamiento si queda fuera de rango
// y muestra las flechas izquierda/derecha cuando procede.
const CategorizationScrollControls: React.FC<Props> = ({
  wrapperRef,
  innerRef,
  shiftX,
  onShift,
  setShift,
  leftAriaLabel = "Mover categorias a la izquierda",
  rightAriaLabel = "Mover categorias a la derecha",
}) => {
  // indica si el contenido excede el ancho del wrapper
  const [canScroll, setCanScroll] = useState<boolean>(false);

  // efecto: comprobar overflow y clampeo del shift
  useEffect(() => {
    function checkOverflow() {
      const wrapper = wrapperRef.current;
      const inner = innerRef.current;
      if (!wrapper || !inner) {
        setCanScroll(false);
        return;
      }
      const fits = inner.scrollWidth > wrapper.clientWidth;
      setCanScroll(fits);
      const maxNegative = Math.min(0, wrapper.clientWidth - inner.scrollWidth);
      // si el shift está fuera de rango, corregirlo a través de setShift si se proporcionó
      if (shiftX < maxNegative && setShift) setShift(maxNegative);
      if (shiftX > 0 && setShift) setShift(0);
    }
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [shiftX, wrapperRef, innerRef, setShift]);

  // límites y decisión de mostrar flechas
  const wrapper = wrapperRef.current;
  const inner = innerRef.current;
  const maxNegative =
    wrapper && inner ? Math.min(0, wrapper.clientWidth - inner.scrollWidth) : 0;
  const showLeft = shiftX < 0; // no está totalmente a la izquierda
  const showRight = shiftX > maxNegative; // no está totalmente a la derecha

  if (!canScroll || (!showLeft && !showRight)) return null;

  return (
    <>
      {showLeft && (
        <button
          aria-label={leftAriaLabel}
          className="categorization-scroll-btn categorization-scroll-left"
          onClick={() => onShift(1)}
        >
          <svg
            className="icon-module_icon__Cn42w icon-module_big__8nlaM"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            enableBackground="new 0 0 24 24"
          >
            <path d="M15.5 20.4L7.1 12l8.4-8.4L16.9 5l-7 7 7 7z"></path>
          </svg>
        </button>
      )}
      {showRight && (
        <button
          aria-label={rightAriaLabel}
          className="categorization-scroll-btn categorization-scroll-right"
          onClick={() => onShift(-1)}
        >
          <svg
            className="icon-module_icon__Cn42w icon-module_big__8nlaM"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            enableBackground="new 0 0 24 24"
          >
            <path d="M8.5 20.4l8.4-8.4-8.4-8.4L7.1 5l7 7-7 7z"></path>
          </svg>
        </button>
      )}
    </>
  );
};

export default CategorizationScrollControls;
