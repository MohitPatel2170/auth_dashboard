import { Link, useNavigate } from 'react-router-dom';
import logo from "../images/autoit.svg";


function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-black">
      <div className="container">
<Link className="navbar-brand d-flex align-items-center text-white" to="/">
  <img
    src={logo}
    alt="Logo"
    style={{ width: "28px", height: "28px", marginRight: "8px" }}
  />
  Auth App

</Link>

        <div className="ml-auto">
          {token ? (
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
              <Link className="btn btn-outline-success" to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
