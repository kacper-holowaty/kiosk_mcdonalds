import { Link, useLocation } from "react-router-dom";

function NotFound() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="text-3xl mb-4">
        Adres {location.pathname} nie istnieje...
      </div>
      <Link to="/">
        <button className="text-3xl bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none">
          Strona główna
        </button>
      </Link>
    </div>
  );
}

export default NotFound;
