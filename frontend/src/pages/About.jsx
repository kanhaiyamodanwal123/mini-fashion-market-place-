import { Link } from 'react-router-dom';


const About = () => {
  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '500+', label: 'Partner Brands' },
    { value: '100+', label: 'Countries Served' },
    { value: '24/7', label: 'Customer Support' },
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', image: '👩‍💼' },
    { name: 'Michael Chen', role: 'Head of Operations', image: '👨‍💼' },
    { name: 'Emily Davis', role: 'Head of Marketing', image: '👩‍💻' },
    { name: 'James Wilson', role: 'Head of Technology', image: '👨‍💻' },
  ];

  const values = [
    { icon: '🎯', title: 'Customer First', desc: 'We prioritize our customers in everything we do' },
    { icon: '💎', title: 'Quality Assured', desc: 'Every product is carefully curated for quality' },
    { icon: '🤝', title: 'Trust & Transparency', desc: 'Building lasting relationships through honesty' },
    { icon: '🚀', title: 'Innovation', desc: 'Continuously improving our platform and services' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            About MarketNest
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Your premier destination for curated fashion from world's top brands
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2020, MarketNest started with a simple mission: to make quality fashion accessible to everyone, everywhere. What began as a small startup has grown into a global marketplace connecting millions of customers with their favorite brands.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We believe that great style shouldn't be complicated. Our platform brings together curated collections from established and emerging brands, ensuring that every product meets our high standards of quality and style.
              </p>
              <Link 
                to="/contact" 
                className="inline-block px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors"
              >
                Get in Touch
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl p-8">
                <div className="text-9xl text-center">🛍️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-y">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-gray-900 text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center text-6xl mx-auto mb-4">
                  {member.image}
                </div>
                <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want to Partner With Us?
          </h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Join our growing network of brands-300 mb- and start reaching millions of customers worldwide.
          </p>
          <Link 
            to="/contact" 
            className="inline-block px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 MarketNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;

