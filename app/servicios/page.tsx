import Image from "next/image";

export const metadata = {
  title: "Servicios - Vigotsky Reynosa",
  description: "Descubre nuestros programas educativos integrales diseñados para cada estudiante.",
};

export default function ServicesPage() {
  const services = [
    {
      number: "01.",
      title: "Holistic Academic Curriculum",
      description: "Our Holistic Academic Curriculum is designed to nurture young minds through a blend of traditional and innovative teaching methods. We focus on critical thinking, creativity, and emotional intelligence, ensuring that each student develops essential skills for the future. Tailored to meet diverse learning styles, our curriculum creates an engaging environment where students thrive academically and socially. With focused subjects ranging from arts to sciences, we foster a love for learning and encourage lifelong exploration. Our dedicated educators are committed to guiding each child on their educational journey, laying a strong foundation for future success.",
      imagePosition: "left",
    },
    {
      number: "02.",
      title: "Extracurricular Activities",
      description: "At Vigotsky Reynosa, our Extracurricular Activities program enriches students' educational experience beyond the classroom. We offer a wide range of clubs and classes, including sports, arts, and music, allowing students to explore their passions and develop new skills. Participation in these activities encourages teamwork, leadership, and social interaction, fostering a sense of community among students. Guided by experienced instructors, children gain confidence and creativity while balancing academics with enjoyable pursuits. These programs are crucial for personal growth, ensuring that each child develops holistically as an individual.",
      imagePosition: "right",
    },
    {
      number: "03.",
      title: "After-School Care",
      description: "Our After-School Care program provides a secure and nurturing environment for students after school hours. We prioritize safety while ensuring that children engage in fun and educational activities. Our dedicated staff supervises students, offering homework assistance, creative projects, and recreational playtime. This program not only supports working families but also fosters social interactions among peers. We encourage self-expression and collaboration through various group activities that stimulate learning. With a focus on well-being, our After-School Care ensures that students feel valued and supported in a community setting.",
      imagePosition: "left",
    },
    {
      number: "04.",
      title: "Progressive Teaching Methods",
      description: "At Vigotsky Reynosa, we embrace Progressive Teaching Methods that prioritize student engagement and active learning. Our approach combines hands-on experiences with collaborative projects, allowing students to take ownership of their education. By integrating technology and real-world applications, we make learning relevant and exciting. Our educators are trained in innovative techniques that cater to various learning styles, ensuring that every child can thrive. We believe in fostering critical thinking and problem-solving skills, preparing students for the challenges of tomorrow. This commitment to progressive education empowers students to become lifelong learners and responsible global citizens.",
      imagePosition: "right",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full text-center">
          <p className="text-white text-sm md:text-base font-medium tracking-wider mb-4 uppercase">
            EMPOWERING EDUCATION
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Discover Our Comprehensive Learning Programs
          </h1>
        </div>
      </section>

      {/* Services Sections */}
      <div className="bg-white">
        {services.map((service, index) => (
          <section
            key={index}
            className={`py-16 sm:py-24 ${index % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
          >
            <div className="container mx-auto px-6 lg:px-8">
              <div
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  service.imagePosition === "right" ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Image */}
                <div
                  className={`flex justify-center ${
                    service.imagePosition === "right" ? "lg:col-start-2" : ""
                  }`}
                >
                  <div className="w-full max-w-md aspect-square">
                    {/* Placeholder */}
                    <div className="w-full h-full rounded-[50%] overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <div className="text-center p-8">
                        <svg
                          className="w-24 h-24 text-blue-600 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <p className="text-blue-800 font-semibold">
                          Imagen {service.number}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`text-center lg:text-left ${
                    service.imagePosition === "right" ? "lg:col-start-1 lg:row-start-1" : ""
                  }`}
                >
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    {service.number}
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                    {service.title}
                  </h2>
                  <div className="w-20 h-1 bg-green-600 mb-6 mx-auto lg:mx-0"></div>
                  <p className="text-base text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
