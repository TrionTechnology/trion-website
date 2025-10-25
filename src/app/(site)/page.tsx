export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 hero-pattern opacity-10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
              Building the Future of{" "}
              <span className="text-gradient">Digital Innovation</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              From custom software solutions to AI-powered applications, we transform your ideas into 
              cutting-edge technology that drives business growth across Malaysia and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="btn-primary"
              >
                Start Your Project
              </a>
              <a 
                href="/services" 
                className="btn-secondary"
              >
                Our Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="text-gradient">Services</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive software development services to help your business thrive in the digital age.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">Custom Software Development</h3>
              <p className="text-gray-300 mb-6">Tailored web applications and desktop software built with modern technologies.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  Full-stack development
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  API integration
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  Database design
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">Odoo ERP Customization</h3>
              <p className="text-gray-300 mb-6">Comprehensive ERP solutions with Odoo customization and integration.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  Odoo implementation
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  Custom modules
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  Data migration
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">Mobile App Development</h3>
              <p className="text-gray-300 mb-6">Cross-platform mobile applications using Flutter for iOS and Android.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  Flutter development
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  iOS & Android
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  App store deployment
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">AI & Data Solutions</h3>
              <p className="text-gray-300 mb-6">Intelligent systems powered by machine learning and data analytics.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  LLM integration
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  Chatbot development
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  Data analytics
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">IoT & Hardware Integration</h3>
              <p className="text-gray-300 mb-6">Connected devices and IoT solutions using Arduino and Raspberry Pi.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  Arduino development
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  Raspberry Pi
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  Sensor integration
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">Cloud & DevOps Services</h3>
              <p className="text-gray-300 mb-6">Scalable cloud infrastructure and DevOps practices for reliable deployments.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  AWS/Azure setup
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  Docker containers
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                  CI/CD pipelines
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}