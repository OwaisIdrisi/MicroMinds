import { Link } from "react-router-dom";
import { Users, Lightbulb, Rocket } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12">
      /* Hero Section */
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">About MicroMinds</h1>
          <p className="mt-4 text-lg">
            Empowering minds through knowledge, collaboration, and innovation.
            At MicroMinds, we are dedicated to creating an inclusive environment
            where individuals from all backgrounds can come together to learn,
            share ideas, and drive technological advancements. Our platform is
            designed to support continuous growth and development, ensuring that
            everyone has the opportunity to reach their full potential and make
            meaningful contributions to the tech community.
          </p>
        </div>
      </section>
      {/* Our Mission */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Lightbulb className="text-5xl text-blue-500 mx-auto" />
          <h2 className="text-3xl font-semibold mt-4">Our Mission</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            At MicroMinds, we believe in fostering a community where creativity
            meets technology. Our mission is to provide a space where learners,
            developers, and thinkers come together to explore, innovate, and
            grow.
          </p>
        </div>
      </section>
      {/* Our Team */}
      <section className="bg-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Users className="text-5xl text-blue-500 mx-auto" />
          <h2 className="text-3xl font-semibold mt-4">Meet Our Team</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            We are a passionate team of developers, designers, and educators who
            are dedicated to making technology accessible for everyone.
          </p>
        </div>
      </section>
      {/* Our Vision */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Rocket className="text-5xl text-blue-500 mx-auto" />
          <h2 className="text-3xl font-semibold mt-4">Our Vision</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            Our vision is to create a future where learning and collaboration
            drive innovation. We strive to build a platform that enables
            individuals to push boundaries, solve real-world problems, and make
            an impact.
          </p>
        </div>
      </section>
      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold">Join Us on This Journey</h2>
          <p className="mt-4 text-lg">
            Whether you're a developer, designer, or enthusiast, there's a place
            for you at MicroMinds.
          </p>
          <Link to="/register">
            <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:opacity-90 transition">
              Get Started
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
