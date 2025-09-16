export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-dark-purple to-federal-blue text-white text-center p-6">
      <h1 className="text-7xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Oops! Page not found</h2>
      <p className="text-base text-paynes-gray max-w-md mb-6">
        The page you’re looking for doesn’t exist or has been moved. Don’t worry, you can always
        head back to safety.
      </p>
      <a
        href="/"
        className="bg-emerald text-white px-6 py-3 rounded-lg font-medium shadow hover:opacity-90 transition"
      >
        Go back home
      </a>
    </div>
  );
}
