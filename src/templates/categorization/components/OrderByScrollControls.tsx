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

const OrderByScrollControls: React.FC<Props> = ({
  wrapperRef,
  innerRef,
  shiftX,
  onShift,
  setShift,
  leftAriaLabel = "Mover orden a la izquierda",
  rightAriaLabel = "Mover orden a la derecha",
}) => {
  // estado local: si la fila de opciones excede el ancho del contenedor
  const [canScroll, setCanScroll] = useState<boolean>(false);

  // efecto: comprobar overflow y clamar el shift si está fuera de rango
  useEffect(() => {
    function checkOrderByOverflow() {
      const wrapper = wrapperRef.current;
      const inner = innerRef.current;
      if (!wrapper || !inner) {
        setCanScroll(false);
        return;
      }
      const fits = inner.scrollWidth > wrapper.clientWidth;
      setCanScroll(fits);
      const maxNegative = Math.min(0, wrapper.clientWidth - inner.scrollWidth);
      if (shiftX < maxNegative && setShift) setShift(maxNegative);
      if (shiftX > 0 && setShift) setShift(0);
    }
    checkOrderByOverflow();
    window.addEventListener("resize", checkOrderByOverflow);
    return () => window.removeEventListener("resize", checkOrderByOverflow);
  }, [shiftX, wrapperRef, innerRef, setShift]);

  // calcular límites y decidir si mostrar flechas
  const wrapper = wrapperRef.current;
  const inner = innerRef.current;
  const maxNegative =
    wrapper && inner ? Math.min(0, wrapper.clientWidth - inner.scrollWidth) : 0;
  const showLeft = shiftX < 0;
  const showRight = shiftX > maxNegative;

  if (!canScroll || (!showLeft && !showRight)) return null;

  return (
    <>
      {showLeft && (
        <button
          aria-label={leftAriaLabel}
          className="orderby-scroll-btn orderby-scroll-left"
          onClick={() => onShift(1)}
        >
          <svg
            className="icon-module_icon__Cn42w"
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
          className="orderby-scroll-btn orderby-scroll-right"
          onClick={() => onShift(-1)}
        >
          <svg
            className="icon-module_icon__Cn42w"
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

export default OrderByScrollControls;
