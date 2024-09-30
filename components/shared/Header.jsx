
const Header = ({title,subtitle}) => {
  return (
    <>
    <h2 className="h2-bold text-dark-600 md:text-[36px]">{title}</h2>
    {subtitle && <p className="p-16-regular mt-4">{subtitle}</p>}
    </>
  );
}

export default Header