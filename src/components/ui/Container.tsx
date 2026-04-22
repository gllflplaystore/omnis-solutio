import type { ContainerProps } from "@/helpers/types";

const containerStyles = `
.responsive-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  max-width: 640px;
}
@media (min-width: 640px) {
  .responsive-container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    max-width: 640px;
  }
}
@media (min-width: 768px) {
  .responsive-container {
    padding-left: 2rem;
    padding-right: 2rem;
    max-width: 768px;
  }
}
@media (min-width: 1024px) {
  .responsive-container {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
    max-width: 1024px;
  }
}
@media (min-width: 1280px) {
  .responsive-container {
    max-width: 1280px;
  }
}
@media (min-width: 1536px) {
  .responsive-container {
    max-width: 1440px;
  }
}
@media (min-width: 1700px) {
  .responsive-container {
    max-width: 1600px;
  }
}
`;

const Container = ({
  className = "",
  children,
  variant,
  ...props
}: ContainerProps) => {
  const base =
    variant === "fluid"
      ? "w-full px-4 sm:px-6 md:px-8 lg:px-10"
      : "responsive-container";

  return (
    <>
      <style>{containerStyles}</style>
      <div className={`${base} ${className}`} {...props}>
        {children}
      </div>
    </>
  );
};

export default Container;
