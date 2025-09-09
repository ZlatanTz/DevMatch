const HomePage = () => {
  return (
    <div className="container mx-auto p-6 grid gap-2 grid-cols-1 md:grid-cols-4">
      {/* Carousel */}
      <div className="col-span-1 md:col-span-3">
        <div className="bg-gray-200 h-90 flex items-center justify-center">Slider</div>
      </div>
      {/* Best */}
      <div className="col-span-1">
        <div className="bg-gray-200 h-40 flex items-center justify-center">Highest salary jobs</div>
      </div>
      {/* Top Rated */}
      <div className="col-span-1 md:col-span-4">
        <div className="bg-gray-200 h-80 flex items-center justify-center">Top rated jobs</div>
      </div>
    </div>
  );
};

export default HomePage;
