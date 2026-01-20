import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  CheckIcon,
  CodeIcon,
  HeartIcon,
  MenuIcon,
  CloseIcon,
  ZapIcon,
  SettingsIcon,
  ExternalLinkIcon
} from "../components/OptimizedIcons";
import SEOHead from "../components/SEOHead";
import {
  getOrganizationStructuredData,
  getWebsiteStructuredData,
  getSoftwareApplicationStructuredData,
  getFAQStructuredData,
  getHowToStructuredData
} from "../utils/structuredData";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleVideo = () => {
    const video = document.getElementById('demo-video');
    if (video) {
      if (isVideoPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleMute = () => {
    const video = document.getElementById('demo-video');
    if (video) {
      video.muted = !video.muted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const features = [
    {
      icon: ZapIcon,
      title: "Drag & Drop Builder",
      desc: "Create beautiful forms in minutes with our intuitive visual builder and pre-made templates.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: ZapIcon,
      title: "Real-time Analytics",
      desc: "Track form performance, conversion rates, and user behavior with detailed insights.",
      gradient: "from-blue-400 to-blue-500"
    },
    {
      icon: ZapIcon,
      title: "Smart Integrations",
      desc: "Connect with Slack, Google Sheets, Zapier, and 50+ tools to automate your workflow.",
      gradient: "from-blue-600 to-blue-700"
    },
    {
      icon: CheckIcon,
      title: "Enterprise Security",
      desc: "GDPR compliant with advanced spam protection and role-based access controls.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: SettingsIcon,
      title: "Smart Automation",
      desc: "Set up intelligent email responses, conditional logic, and workflow triggers.",
      gradient: "from-blue-400 to-blue-500"
    },
    {
      icon: ExternalLinkIcon,
      title: "Global Performance",
      desc: "Lightning-fast loading worldwide with 99.9% uptime and CDN optimization.",
      gradient: "from-blue-600 to-blue-700"
    },
  ];

  const testimonials = [

    {
      name: "Ridham Savaliya",
      role: "Full stack developer",
      content: "From idea to live form in 5 minutes. The analytics insights are game-changing.",
      avatar: "https://res.cloudinary.com/dsqpc6sp6/image/upload/v1757609151/yellow_black_bg_snaqd7.jpg"
    },
    {
      name: "Shashank Das",
      role: "Frontend Developer",
      content: "FormBoom helped us increase lead conversion by 40%. The integrations are seamless!",
      avatar: "https://res.cloudinary.com/dsqpc6sp6/image/upload/v1757609752/WhatsApp_Image_2025-09-11_at_22.25.02_3871f916_jzseqo.jpg"
    },
    {
      name: "Arya Shah",
      role: "Ai Engineer",
      content: "Best form builder i've used til now. Clean design, powerful features, amazing support.",
      avatar: "https://res.cloudinary.com/dsqpc6sp6/image/upload/v1757918282/Screenshot_2025-09-15_120750_mvbvsc.png"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Up to 5 forms",
        "100 submissions/month",
        "Basic form builder",
        "Email notifications",
        "Webhook integrations",
        "Basic analytics",
        "Community support",
        "FormBoom branding"
      ],
      cta: "Start Free",
      popular: false,
      available: true
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For growing businesses",
      features: [
        "Unlimited forms",
        "10,000 submissions/month",
        "Advanced form builder",
        "Custom branding",
        "Advanced integrations",
        "Detailed analytics",
        "Priority support",
        "Custom domains"
      ],
      cta: "Coming Soon",
      popular: true,
      available: false
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Unlimited submissions",
        "White-label solution",
        "API access",
        "SSO integration",
        "Advanced security",
        "Dedicated support",
        "Custom integrations"
      ],
      cta: "Coming Soon",
      popular: false,
      available: false
    }
  ];

  // Combined structured data for the landing page
  const combinedStructuredData = [
    getOrganizationStructuredData(),
    getWebsiteStructuredData(),
    getSoftwareApplicationStructuredData(),
    getFAQStructuredData(),
    getHowToStructuredData()
  ];

  return (
    <>
      <SEOHead
        title="FormBoom — Build Forms That Convert Like Crazy | #1 Form Builder 2024"
        description="Create stunning forms, collect valuable leads, and automate your entire workflow—all without writing a single line of code. Join 10,000+ teams already boosting their conversions with FormBoom. Free forever plan available!"
        keywords="formboom, form builder, online forms, lead generation, form automation, no-code forms, contact forms, survey builder, form analytics, workflow automation, form integrations, drag drop form builder, best form builder 2024"
        structuredData={combinedStructuredData}
        type="website"
      />
      <div className="min-h-screen bg-white">
        {/* Enhanced Header */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
          : 'bg-white/80 backdrop-blur-sm'
          }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-9 h-9 bg-[#0080FF] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                    <span className="text-white font-bold text-lg">F</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="font-bold text-xl text-gray-900">FormBoom</span>
                  <div className="text-xs text-gray-500 -mt-1">Build. Capture. Automate.</div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Features
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Reviews
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Pricing
                </a>
                <a href="#faq" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Help
                </a>
              </nav>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 bg-[#0080FF] text-white font-semibold rounded-xl hover:bg-[#0066CC] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Start Free
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 shadow-xl">
              <div className="px-4 py-6 space-y-4">
                <nav className="space-y-4">
                  <a href="#features" className="block text-gray-600 font-medium">Features</a>
                  <a href="#testimonials" className="block text-gray-600 font-medium">Reviews</a>
                  <a href="#pricing" className="block text-gray-600 font-medium">Pricing</a>
                  <a href="#faq" className="block text-gray-600 font-medium">Help</a>
                </nav>
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link to="/login" className="block w-full text-center py-3 text-gray-700 font-medium border border-gray-300 rounded-xl hover:bg-gray-50">
                    Sign in
                  </Link>
                  <Link to="/signup" className="block w-full text-center py-3 bg-[#0080FF] text-white font-semibold rounded-xl">
                    Start Free
                  </Link>
                </div>
              </div>
            </div>
          )}
        </header>

        <main>
          {/* Hero Section */}
          <section className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20" aria-label="Hero section">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-25 to-blue-50"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
              <div className="h-64 bg-[#0080FF]/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-[#0080FF] px-4 py-2 rounded-full text-sm font-medium">
                  <ZapIcon className="w-4 h-4" />
                  <span>New: Form optimization - Saves you data & hassle</span>
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                    <span className="block text-gray-900">Build forms that</span>
                    <span className="block text-[#0080FF]">
                      convert like crazy
                    </span>
                  </h1>
                  <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed">
                    Create stunning forms, collect valuable leads, and automate your entire workflow—all without writing a single line of code. Join 10,000+ teams already boosting their conversions.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto px-8 py-4 bg-[#0080FF] text-white font-semibold rounded-xl hover:bg-[#0066CC] transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                  >
                    <span>Start Building Free</span>
                    <ZapIcon className="w-5 h-5" />
                  </Link>
                  <a
                    href="#video-demo"
                    className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {/* <PlayIcon className="w-5 h-5" /> */}
                    <span>Watch Demo</span>
                  </a>
                </div>

                {/* Trust Indicators */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {testimonials.slice(0, 3).map((person, i) => (
                        <img key={i} src={person.avatar} alt={`${person.name} - ${person.role}`} className="w-8 h-8 rounded-full border-2 border-white" loading="lazy" />
                      ))}
                    </div>
                    <span>Trusted by many teams & individuals</span>
                  </div>
                  <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
                  <span>✨ No credit card required</span>
                  <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
                  <span>🚀 Setup in 2 minutes</span>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16">
                <div className="inline-block px-4 py-2 bg-blue-100 text-[#0080FF] rounded-full text-sm font-medium">
                  Why Choose FormBoom
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                  Everything you need to <br />
                  <span className="text-[#0080FF]">
                    supercharge your forms
                  </span>
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600">
                  From drag-and-drop building to advanced analytics, we've got every aspect of form creation covered.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group p-6 lg:p-8 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Video Demo Section */}
          <section id="video-demo" className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16">
                <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                  {/* <PlayIcon className="w-4 h-4" /> */}
                  <span>See Formboom in Action</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                  Watch how easy it is to
                  <br />
                  <span className="text-[#0080FF]">build converting forms</span>
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600">
                  See our drag-and-drop builder in action. From concept to live form in under 2 minutes.
                </p>
              </div>

              <div className="relative max-w-5xl mx-auto">
                {/* Video Container with Unique Design */}
                <div className="relative group">
                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 -left-12 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-30 animate-bounce"></div>
                  <div className="absolute top-1/4 -right-8 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-30 animate-bounce delay-500"></div>

                  {/* Main Video Container */}
                  <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 group-hover:shadow-3xl transition-all duration-500">
                    {/* Video Header Bar */}
                    <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          </div>
                          <div className="text-sm font-medium text-gray-700">Formboom Demo</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            ● LIVE
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video Content */}
                    <div className="relative aspect-video bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
                      {/* Placeholder Video - Replace with your actual video */}
                      <video
                        id="demo-video"
                        className="w-full h-full object-cover"
                        poster="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
                        muted={isVideoMuted}
                        autoPlay
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                      >
                        <source src="https://res.cloudinary.com/dsqpc6sp6/video/upload/v1768284663/Modern_Tech_Startup_Video_Creation_o8chjo.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>

                      {/* Video Overlay */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        {/* Play/Pause Button */}
                        <button
                          onClick={toggleVideo}
                          className="group/play w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300"
                        >
                          {/* {isVideoPlaying ? (
                        <PauseIcon className="w-8 h-8 text-[#0080FF] group-hover/play:scale-110 transition-transform" />
                      ) : (
                        <PlayIcon className="w-8 h-8 text-[#0080FF] ml-1 group-hover/play:scale-110 transition-transform" />
                      )} */}
                        </button>
                      </div>

                      {/* Video Controls */}
                      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                        <button
                          onClick={toggleMute}
                          className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-200"
                        >
                          {/* {isVideoMuted ? (
                        <VolumeXIcon className="w-5 h-5" />
                      ) : (
                        <Volume2Icon className="w-5 h-5" />
                      )} */}
                        </button>
                      </div>

                      {/* Progress Indicator */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                        <div className="h-full bg-[#0080FF] w-0 transition-all duration-300" id="video-progress"></div>
                      </div>
                    </div>

                    {/* Video Stats */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>2:34 Demo Length</span>
                          </div>
                          <div className="text-gray-400">|</div>
                          <div className="text-gray-600">Form Builder Walkthrough</div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <span>👀 10,000+ views</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Feature Cards */}
                  <div className="absolute -left-8 top-1/4 hidden lg:block">
                    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ZapIcon className="w-4 h-4 text-[#0080FF]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Drag & Drop</div>
                          <div className="text-xs text-gray-500">Visual Builder</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-8 top-3/4 hidden lg:block">
                    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckIcon className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Live Preview</div>
                          <div className="text-xs text-gray-500">Real-time Updates</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                      <ZapIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">2-Minute Setup</h3>
                    <p className="text-gray-600 text-sm">Watch how quickly you can build professional forms with our intuitive interface.</p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                      <SettingsIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Smart Features</h3>
                    <p className="text-gray-600 text-sm">See conditional logic, auto-responses, and integrations working seamlessly together.</p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                      <CheckIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Instant Results</h3>
                    <p className="text-gray-600 text-sm">From design to deployment - see your form go live and start collecting responses immediately.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16">
                <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  💰 Simple Pricing
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                  Start free, scale as you grow
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600">
                  Choose the perfect plan for your needs. Start with our generous free tier and upgrade when you're ready.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {pricingPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative p-6 lg:p-8 rounded-2xl border-2 transition-all duration-300 ${plan.popular
                      ? 'border-[#0080FF] bg-blue-50 shadow-xl scale-105'
                      : 'border-gray-200 bg-white hover:border-[#0080FF] hover:shadow-lg'
                      } ${!plan.available ? 'opacity-75' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-[#0080FF] text-white px-4 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className="text-center space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-baseline justify-center space-x-1">
                          <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                          <span className="text-gray-600">/{plan.period}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-3">
                            <CheckIcon className="w-5 h-5 text-[#0080FF] flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4">
                        {plan.available ? (
                          <Link
                            to="/signup"
                            className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${plan.popular
                              ? 'bg-[#0080FF] text-white hover:bg-[#0066CC] shadow-lg hover:shadow-xl'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                              }`}
                          >
                            {plan.cta}
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-500 cursor-not-allowed"
                          >
                            {plan.cta}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-gray-600">
                  All plans include our core features. Need something custom?
                  <a href="#contact" className="text-[#0080FF] hover:underline ml-1">Contact us</a>
                </p>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16">
                <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ⭐ Loved by thousands
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Don't just take our word for it
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="space-y-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-lg">★</span>
                        ))}
                      </div>
                      <p className="text-gray-700 italic leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                        <img
                          src={testimonial.avatar}
                          alt={`${testimonial.name} - ${testimonial.role} testimonial photo`}
                          className="w-12 h-12 rounded-full object-cover"
                          loading="lazy"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{testimonial.name}</div>
                          <div className="text-sm text-gray-600">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Developer Section */}
          <section className="py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16">
                <div className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  👨‍💻 Meet the Creator
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Built with passion by a developer who gets it
                </h2>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-12 border border-blue-100">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-[#0080FF] rounded-full flex items-center justify-center">
                            <CodeIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">Hey, I'm the Developer!</h3>
                            <p className="text-[#0080FF] font-medium">Full-Stack Engineer & Form Enthusiast</p>
                          </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed">
                          After years of building forms for countless projects and dealing with the frustration of
                          complex form builders, I decided to create something different. FormBoom is my vision
                          of what form building should be - simple, powerful, and developer-friendly.
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <ZapIcon className="w-5 h-5 text-[#0080FF]" />
                            <span>5+ years building web applications</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <ZapIcon className="w-5 h-5 text-[#0080FF]" />
                            <span>Passionate about clean code and great UX</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <HeartIcon className="w-5 h-5 text-red-500" />
                            <span>Built with love for the developer community</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <a
                          target="_blank"
                          href="https://github.com/Ridham-Savaliya"
                          className="flex items-center space-x-2 text-gray-600 hover:text-[#0080FF] transition-colors"
                        >
                          <ExternalLinkIcon className="w-5 h-5" />
                          <span>GitHub</span>
                        </a>
                        <a
                          href="https://www.linkedin.com/in/ridham-savaliya-a6b2b8251/"
                          target="_blank"
                          className="flex items-center space-x-2 text-gray-600 hover:text-[#0080FF] transition-colors"
                        >
                          <ExternalLinkIcon className="w-5 h-5" />
                          <span>LinkedIn</span>
                        </a>
                        <a
                          href="https://twitter.com/ridham_savaliya"
                          target="_blank"
                          className="flex items-center space-x-2 text-gray-600 hover:text-[#0080FF] transition-colors"
                        >
                          <ExternalLinkIcon className="w-5 h-5" />
                          <span>Twitter</span>
                        </a>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="aspect-square w-full max-w-sm mx-auto bg-gradient-to-br from-[#0080FF] to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                        <div className="text-center text-white space-y-4">
                          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                            <CodeIcon className="w-10 h-10" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold">FormBoom</div>
                            <div className="text-blue-100">Creator</div>
                          </div>
                          <div className="text-sm text-blue-100">
                            "Making forms simple,<br />one component at a time"
                          </div>
                        </div>
                      </div>

                      {/* Floating elements */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="py-16 sm:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16">
                <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  ❓ Frequently Asked Questions
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Everything you need to know about FormBoom
                </h2>
                <p className="text-lg text-gray-600">
                  Can't find the answer you're looking for? Reach out to our support team.
                </p>
              </div>

              <div className="space-y-6">
                <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900">What is FormBoom?</h3>
                    <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    FormBoom is a powerful form builder that allows you to create stunning forms, collect valuable leads, and automate your entire workflow—all without writing a single line of code. It's designed for businesses of all sizes who want to boost their conversion rates.
                  </p>
                </details>

                <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900">Is FormBoom free to use?</h3>
                    <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Yes! FormBoom offers a generous free plan that includes up to 5 forms, 100 submissions per month, basic form builder, email notifications, webhook integrations, and community support. No credit card required to get started.
                  </p>
                </details>

                <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900">What integrations does FormBoom support?</h3>
                    <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    FormBoom integrates with Slack, Google Sheets, Zapier, and 50+ other tools to automate your workflow. You can connect your forms to your favorite apps and streamline your data collection process without any technical knowledge.
                  </p>
                </details>

                <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900">Is FormBoom GDPR compliant?</h3>
                    <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Absolutely! FormBoom is fully GDPR compliant with advanced spam protection and role-based access controls. We take data privacy seriously and ensure your forms and submissions are secure and compliant with international data protection regulations.
                  </p>
                </details>

                <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900">How fast can I create a form with FormBoom?</h3>
                    <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    With FormBoom's intuitive drag-and-drop builder, you can create a professional form in just 2 minutes! Our pre-made templates and smart components make it incredibly fast to build forms that convert. No technical knowledge required.
                  </p>
                </details>

                <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900">Can I customize the look of my forms?</h3>
                    <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Yes! FormBoom offers extensive customization options including custom branding, colors, fonts, and layouts. Pro and Enterprise plans include advanced customization features and the ability to remove FormBoom branding completely.
                  </p>
                </details>

                <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900">Do you offer analytics and reporting?</h3>
                    <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Absolutely! FormBoom provides real-time analytics to track form performance, conversion rates, and user behavior. Get detailed insights into your form submissions, completion rates, and optimize for better results.
                  </p>
                </details>

                <details className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900">What support options are available?</h3>
                    <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    We offer community support for free users, priority support for Pro users, and dedicated support for Enterprise customers. Our team is committed to helping you succeed with FormBoom and achieve your conversion goals.
                  </p>
                </details>
              </div>

              <div className="text-center mt-12">
                <p className="text-gray-600 mb-4">Still have questions?</p>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-6 py-3 bg-[#0080FF] text-white font-semibold rounded-xl hover:bg-[#0066CC] transition-all duration-200"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[#0080FF] rounded-3xl"></div>
                <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
                <div className="relative px-6 sm:px-12 py-12 sm:py-16 text-center text-white">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                        Ready to boost your conversions?
                      </h2>
                      <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/90">
                        Join thousands of businesses already using FormBoom to capture more leads and automate their workflows.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
                      <Link
                        to="/signup"
                        className="w-full sm:w-auto px-8 py-4 bg-white text-[#0080FF] font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                      >
                        Start Your Free Account
                      </Link>
                      <Link
                        to="/login"
                        className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200"
                      >
                        Access Dashboard
                      </Link>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/80">
                      <span>✨ Free forever plan</span>
                      <span>🚀 No setup fees</span>
                      <span>💡 Cancel anytime</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="col-span-2 md:col-span-1">
                <Link to="/" className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-[#0080FF] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">F</span>
                  </div>
                  <span className="font-bold text-white">FormBoom</span>
                </Link>
                <p className="text-sm text-gray-400 max-w-xs">
                  Build beautiful forms, capture leads, and automate your workflow—all in one powerful platform.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">Product</h3>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block hover:text-white transition-colors">Features</a>
                  <a href="#" className="block hover:text-white transition-colors">Templates</a>
                  <a href="#pricing" className="block hover:text-white transition-colors">Pricing</a>
                  <a href="#" className="block hover:text-white transition-colors">Integrations</a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">Support</h3>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block hover:text-white transition-colors">Help Center</a>
                  <a href="#" className="block hover:text-white transition-colors">Contact</a>
                  <a href="#" className="block hover:text-white transition-colors">Community</a>
                  <a href="#" className="block hover:text-white transition-colors">API Docs</a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">Company</h3>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block hover:text-white transition-colors">About</a>
                  <a href="#" className="block hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="block hover:text-white transition-colors">Terms</a>
                  <a href="#" className="block hover:text-white transition-colors">Status</a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} FormBoom. Made with ❤️ for creators everywhere.
              </p>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;