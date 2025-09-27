// import Logo from "../assets/devmatch.svg";
import ProfileIcon from "../assets/profileIcon.jpg";
const About = () => {
  return (
    <section id="about-us" className="py-16 px-6 lg:px-20 bg-background text-foreground">
      <div className="max-w-5xl mx-auto">
        {/* <div className="flex justify-center mb-12">
          <img
            src={Logo}
            alt="Contact illustration"
            className="w-1/2 max-w-md  rounded-xl shadow-md p-8"
          />
        </div> */}

        <h2 className=" text-4xl font-bold text-center mb-12 text-emerald">About Us</h2>

        <div className="space-y-10">
          <div className="bg-card text-card-foreground rounded-xl shadow-md p-8 hover:shadow-lg transition">
            <p className="text-lg leading-relaxed">
              <span className="font-semibold text-emerald">Dev-Match</span> is a modern online
              platform that connects IT professionals with companies seeking top talent. Founded as
              a fresh initiative, our mission is to provide the tech job market with a faster, more
              precise, and more efficient hiring solution. Our team brings together young
              professionals with backgrounds in technology, HR, and digital platforms, all driven by
              the same vision – to redefine how talent and employers connect.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card text-card-foreground rounded-xl shadow-md p-8 hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold text-emerald mb-4">Our Mission</h3>
              <p className="text-lg leading-relaxed">
                Our mission is to create a reliable and transparent community for all participants
                in the IT job market. We empower employers with an intuitive system to discover
                professionals that match their needs, while providing candidates a space to showcase
                their skills, experience, and ambitions – and find opportunities that will help them
                grow.
              </p>
            </div>

            <div className="bg-card text-card-foreground rounded-xl shadow-md p-8 hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold text-emerald mb-4">Our Vision</h3>
              <p className="text-lg leading-relaxed">
                We want <span className="font-semibold text-emerald">Dev-Match</span> to become the
                go-to name for IT hiring – not just a job board, but a bridge between talent and
                opportunity. Our vision is to contribute to the growth of the IT industry on both
                regional and global levels through innovation, community, and quality connections.
              </p>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-xl shadow-md p-8 hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-emerald mb-6">Why Dev-Match?</h3>
            <ul className="list-disc list-inside space-y-3 text-lg leading-relaxed">
              <li>
                <span className="font-semibold text-federal-blue">IT specialization</span> – focused
                exclusively on developers, designers, administrators, and other tech professionals.
              </li>
              <li>
                <span className="font-semibold text-federal-blue">Speed & efficiency</span> – our
                system enables quick and accurate matches between talent and companies.
              </li>
              <li>
                <span className="font-semibold text-federal-blue">Transparency</span> – we believe
                in clear and fair communication between employers and candidates.
              </li>
              <li>
                <span className="font-semibold text-federal-blue">Community growth</span> – building
                a network of professionals and companies who share values and strive for progress.
              </li>
            </ul>
          </div>

          <div className="bg-card text-card-foreground rounded-xl shadow-md p-8 mb-4 hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-emerald mb-4">Our Plans</h3>
            <p className="text-lg leading-relaxed">
              While still a young platform, we are already working on advanced features such as
              smart matching algorithms, skill-based recommendation systems, and tools to streamline
              the hiring process. Our goal is for{" "}
              <span className="font-semibold text-emerald">Dev-Match</span> to grow alongside the
              community it serves, becoming not just a job platform, but a trusted partner in
              building careers and teams.
            </p>
          </div>
        </div>

        <section id="founders" className="pt-8 lg:px-20 bg-background text-foreground">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-emerald">Founders</h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
              {/* Founder 1 */}
              <div className="bg-card text-card-foreground rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition">
                <img
                  src={ProfileIcon}
                  alt="Founder 1"
                  className="w-32 h-32 rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl text-emerald font-semibold mb-2">Zlatan Tuzović</h3>
                <p className="text-center text-lg">
                  Lead Developer and co-founder. Passionate about building efficient and scalable
                  platforms.
                </p>
              </div>

              {/* Founder 2 */}
              <div className="bg-card text-card-foreground rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition">
                <img
                  src={ProfileIcon}
                  alt="Founder 2"
                  className="w-32 h-32 rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl text-emerald font-semibold mb-2">Đorđe Marojević</h3>
                <p className="text-center text-lg">
                  Product Designer and co-founder. Focused on user experience and interface design.
                </p>
              </div>

              {/* Founder 3 */}
              <div className="bg-card text-card-foreground rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition">
                <img
                  src={ProfileIcon}
                  alt="Founder 3"
                  className="w-32 h-32 rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl text-emerald font-semibold mb-2">Eris Šutković</h3>
                <p className="text-center text-lg">
                  CTO and co-founder. Expert in cloud infrastructure and scalable architectures.
                </p>
              </div>

              {/* Founder 4 */}
              <div className="bg-card text-card-foreground rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition">
                <img
                  src={ProfileIcon}
                  alt="Founder 4"
                  className="w-32 h-32 rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl text-emerald font-semibold mb-2">Luka Vučinić</h3>
                <p className="text-center text-lg">
                  Marketing Lead and co-founder. Drives growth strategies and brand awareness.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default About;
