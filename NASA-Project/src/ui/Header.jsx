import logo from '../../assets/img/logo.png'
function Header() {
  return (
    <header className='p-0 m-0 h-[8rem]'>
      <img src={logo} alt="logo " className='w-[10rem] p-0 m-0' />
    </header>
  );
}

export default Header;
