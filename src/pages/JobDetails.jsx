const JobDetails = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ovdje dodajte logiku za slanje podataka
    console.log("Forma poslata!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white min-h-screen">
      <img
        src="firma1.jpg"
        alt="Slika firme"
        className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
      />

      <div className="flex flex-wrap justify-around bg-federal-blue text-white p-4 rounded-lg mb-8">
        <p className="mx-2 font-medium">Pozicija</p>
        <p className="mx-2 font-medium">Lokacija</p>
        <p className="mx-2 font-medium">Plata</p>
        <p className="mx-2 font-medium">Podatak2</p>
        <p className="mx-2 font-medium">Podatak3</p>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="job-description md:w-7/10 bg-gray-50 p-6 rounded-lg shadow border border-gray-200">
            <p className="mb-4 text-gray-700">Ovdje ide opis pozicije posla. </p>
            <p className="font-semibold text-paynes-gray">Uslovi:</p>
            <p className="mb-4 text-gray-700">
              Ovdje ide opis pozicije posla. Ovdje ide opis pozicije posla. Ovdje ide opis pozicije
              posla. Ovdje ide opis pozicije posla.
            </p>
            <p className="font-semibold text-paynes-gray">Opis poslova:</p>
            <p className="mb-4 text-gray-700">
              Ovdje ide opis pozicije posla. Ovdje ide opis pozicije posla. Ovdje ide opis pozicije
              posla. Ovdje ide opis pozicije posla. Ovdje ide opis pozicije posla. Ovdje ide opis
              pozicije posla.
            </p>
          </div>
          <div className="job-side-details flex-1 bg-gray-100 p-6 rounded-lg shadow border border-gray-200">
            <div className="flex justify-start items-center mb-4">
              <p className="text-paynes-gray font-medium">Rok za prijavu:</p>
              <p className="text-gray-700 pl-1">10/10/2025</p>
            </div>
            <div className="flex justify-start items-center">
              <p className="text-paynes-gray font-medium">Mjesto rada:</p>
              <p className="text-gray-700 pl-1">Podgorica</p>
            </div>
          </div>
        </div>

        <div className="job-apply-form bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-center mb-4 text-federal-blue">
            Prijavi se na oglas
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Ime <span className="text-emerald">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  placeholder="Unesite vase ime"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Prezime <span className="text-emerald">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  placeholder="Unesite vase prezime"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-federal-blue mb-1">
                  Email adresa <span className="text-emerald">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="primjer@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="birthYear"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Godina rodjenja <span className="text-emerald">*</span>
                </label>
                <input
                  type="number"
                  id="birthYear"
                  required
                  min="1950"
                  max="2005"
                  placeholder="Godina rodjenja"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-federal-blue mb-1">
                  Broj telefona <span className="text-emerald">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  placeholder="+381 63 123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Lokacija <span className="text-emerald">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  required
                  placeholder="Gdje zivite?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-federal-blue mb-1"
              >
                Radno iskustvo (godine) <span className="text-emerald">*</span>
              </label>
              <input
                type="number"
                id="experience"
                required
                min="0"
                placeholder="Broj godina iskustva"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="education"
                className="block text-sm font-medium text-federal-blue mb-1"
              >
                Obrazovanje <span className="text-emerald">*</span>
              </label>
              <select
                id="education"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              >
                <option value="">Izaberite nivo</option>
                <option value="intern">Intern</option>
                <option value="junior">Junior</option>
                <option value="medior">Medior</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-federal-blue mb-1">
                Vjestine <span className="text-emerald">*</span>
              </label>
              <textarea
                id="skills"
                required
                rows="3"
                placeholder="Navedite vase vjestine (odvojite zarezom)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              ></textarea>
            </div>

            <div>
              <label htmlFor="cv" className="block text-sm font-medium text-federal-blue mb-1">
                Upload CV-a (PDF) <span className="text-emerald">*</span>
              </label>
              <input
                type="file"
                id="cv"
                accept=".pdf"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald file:text-white hover:file:bg-emerald/90"
              />
            </div>

            <div>
              <label
                htmlFor="coverLetter"
                className="block text-sm font-medium text-federal-blue mb-1"
              >
                Propratno pismo
              </label>
              <textarea
                id="coverLetter"
                rows="4"
                placeholder="Napisi kratko propratno pismo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald text-white py-3 px-4 rounded-md hover:bg-emerald/90 focus:outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2 transition-colors font-semibold text-base"
            >
              Posalji prijavu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
