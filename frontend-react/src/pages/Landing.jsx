import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Zap, 
  Shield, 
  Clock,
  Star,
  Users,
  CheckCircle
} from 'lucide-react';
import { useStats } from '@hooks';

const Landing = () => {
  const { stats, loading } = useStats();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-dark-900">
      {/* Hero Section */}
      <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-dark-900 px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-primary-500/20 blur-[120px]" />
          <div className="absolute -right-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-accent-400/15 blur-[130px]" />
          <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'linear-gradient(to bottom, black, transparent 85%)' }} />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.02fr_.98fr] lg:gap-10">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary-400/25 bg-primary-400/10 px-4 py-2 text-sm font-medium text-primary-300 shadow-inner-glow"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-300" />
              </span>
              A better way to bring video to life
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-heading text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[4.4rem]"
            >
              Great videos start with
              <span className="mt-2 block bg-gradient-to-r from-primary-300 via-primary-400 to-accent-300 bg-clip-text pb-2 text-transparent">
                the right connection.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mx-auto mt-7 max-w-xl text-base leading-8 text-gray-400 sm:text-lg lg:mx-0"
            >
              Find talented video editors, showcase your craft, and turn creative ideas into work worth sharing. Everything you need to collaborate, in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <Link
                to="/register?role=client"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-7 py-4 font-semibold text-white shadow-lg shadow-primary-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-500/30"
              >
                Find your editor
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/register?role=editor"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-4 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08]"
              >
                <Play className="h-4 w-4 fill-current" />
                Join as an editor
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-400 lg:justify-start"
            >
              <span className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent-300" /> Built for creators</span>
              <span className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent-300" /> Simple collaboration</span>
              <span className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent-300" /> Work your way</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 18 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="relative mx-auto w-full max-w-xl lg:ml-auto"
          >
            <div aria-hidden="true" className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-primary-500/20 via-transparent to-accent-400/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#101018]/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-xs font-medium tracking-wide text-gray-400">CLIPCONNECT STUDIO</span>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">Workspace</span>
              </div>

              <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#282044] via-[#17243b] to-[#101923] p-5 sm:p-7">
                <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-primary-400/20 blur-3xl" />
                <div className="relative flex min-h-48 flex-col justify-between sm:min-h-56">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-200/80">Creative collaboration</p>
                      <p className="mt-2 max-w-xs text-2xl font-semibold leading-tight text-white sm:text-3xl">Your next great edit starts here.</p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur"><Play className="h-5 w-5 fill-white text-white" /></div>
                  </div>
                  <div className="mt-8 flex items-end gap-1.5">
                    {[28, 44, 34, 58, 40, 72, 48, 64, 38, 82, 54, 68, 42, 76, 50, 62, 36, 70, 46, 58].map((height, index) => (
                      <span key={index} className="flex-1 rounded-sm bg-gradient-to-t from-primary-500/50 to-accent-300/90" style={{ height: height + 'px', opacity: 0.55 + (index % 4) * 0.12 }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-300">Project timeline</p>
                    <span className="text-[10px] text-gray-500">LIVE PREVIEW</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-primary-500 to-accent-400" /></div>
                    <div className="flex justify-between text-[10px] text-gray-500"><span>First cut</span><span>Review</span><span>Final</span></div>
                  </div>
                </div>
                <div className="flex min-w-28 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">
                  <div className="flex -space-x-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#101018] bg-primary-500 text-[10px] font-bold text-white">C</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#101018] bg-accent-500 text-[10px] font-bold text-white">E</span>
                  </div>
                  <span className="mt-2 text-[10px] font-medium text-gray-300">One team</span>
                  <span className="text-[10px] text-gray-500">One vision</span>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-5 top-1/4 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#171722]/95 p-3 shadow-xl shadow-black/30 backdrop-blur-xl sm:flex"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10"><Shield className="h-5 w-5 text-emerald-300" /></div>
              <div><p className="text-xs font-semibold text-white">Work with confidence</p><p className="mt-0.5 text-[10px] text-gray-400">A smoother workflow</p></div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-4 bottom-10 hidden rounded-2xl border border-white/10 bg-[#171722]/95 p-3 shadow-xl shadow-black/30 backdrop-blur-xl sm:block"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/15"><Star className="h-4 w-4 fill-primary-300 text-primary-300" /></div>
                <div><p className="text-xs font-semibold text-white">Made for creativity</p><p className="text-[10px] text-gray-400">From first cut to final</p></div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="relative mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4 sm:gap-8"
        >
          {!loading && (
            <>
              <div className="text-center"><div className="text-2xl font-bold text-white sm:text-3xl">{stats.totalUsers?.toLocaleString() || '0'}</div><div className="mt-1 text-xs text-gray-500 sm:text-sm">Community members</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-white sm:text-3xl">{stats.editors?.toLocaleString() || '0'}</div><div className="mt-1 text-xs text-gray-500 sm:text-sm">Creative editors</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-white sm:text-3xl">{stats.totalProjects?.toLocaleString() || '0'}</div><div className="mt-1 text-xs text-gray-500 sm:text-sm">Projects completed</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-white sm:text-3xl">4.9<span className="ml-1 text-base text-primary-300">★</span></div><div className="mt-1 text-xs text-gray-500 sm:text-sm">Creator rating</div></div>
            </>
          )}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.015] via-transparent to-primary-500/[0.035]" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div className="mx-auto mb-16 max-w-2xl text-center" {...fadeInUp}>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary-300">Everything in one place</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Why Choose ClipConnect?</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
              Everything you need to find, hire, and collaborate with professional video editors
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
            {[
              { icon: Users, title: 'Expert Editors', desc: 'Access thousands of vetted video editing professionals with proven portfolios.' },
              { icon: Shield, title: 'Secure Payments', desc: 'Your payments are protected. Release funds only when satisfied with the work.' },
              { icon: Clock, title: 'Fast Delivery', desc: 'Get your projects completed on time with our efficient workflow system.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="group rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/30 hover:bg-white/[0.055] hover:shadow-xl hover:shadow-primary-950/20 sm:p-8"
              >
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-300/15 bg-gradient-to-br from-primary-500/20 to-accent-400/10 transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold tracking-tight text-white">{feature.title}</h3>
                <p className="leading-7 text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative scroll-mt-24 overflow-hidden border-y border-white/[0.06] bg-white/[0.02] px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div className="mx-auto mb-16 max-w-2xl text-center" {...fadeInUp}>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary-300">A simple process</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">How It Works</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Post Your Project', desc: 'Describe your video editing needs, timeline, and budget.' },
              { step: '02', title: 'Choose Your Editor', desc: 'Review proposals and select the perfect editor for your project.' },
              { step: '03', title: 'Get Results', desc: 'Collaborate, review drafts, and receive your final video.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="relative mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-300/20 bg-gradient-to-br from-primary-500/20 to-accent-400/10 shadow-inner-glow">
                  <span className="font-heading text-xl font-bold text-primary-200">{item.step}</span>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mx-auto max-w-xs leading-7 text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div className="mx-auto mb-16 max-w-2xl text-center" {...fadeInUp}>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary-300">Community stories</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Loved by Creators</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Content Creator', text: 'Found an amazing editor within 24 hours. The quality exceeded my expectations!' },
              { name: 'Mike Chen', role: 'Video Editor', text: 'ClipConnect transformed my freelance career. Consistent high-quality projects.' },
              { name: 'Emma Wilson', role: 'Marketing Director', text: 'Our team\'s go-to platform for all video editing needs. Reliable and professional.' },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7 shadow-lg shadow-black/10 sm:p-8"
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="mb-7 min-h-20 text-base leading-7 text-gray-300">“{testimonial.text}”</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{testimonial.name[0]}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <motion.div
          {...fadeInUp}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#11111b] px-6 py-16 text-center shadow-2xl shadow-black/20 sm:px-12 lg:py-20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-accent-400/15" />
          <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-primary-500/20 blur-[100px]" />
          <div className="absolute -bottom-36 -right-20 h-80 w-80 rounded-full bg-accent-400/15 blur-[110px]" />
          <div className="relative z-10">
            <span className="mb-4 inline-flex rounded-full border border-primary-300/20 bg-primary-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">Make your next move</span>
            <h2 className="mx-auto mb-5 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Ready to Get Started?</h2>
            <p className="mx-auto mb-9 max-w-xl leading-7 text-gray-400">
              Join thousands of creators and editors already transforming video content on ClipConnect.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-primary-500/25 transition-all duration-300"
              >
                Create Free Account
              </Link>
              <Link
                to="/marketplace"
                className="px-8 py-4 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                Browse Editors
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#08080d] px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">ClipConnect</span>
              </div>
              <p className="text-gray-400 text-sm">
                The premier platform connecting video editors with clients worldwide.
              </p>
            </div>
            <div>
              <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">Platform</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/marketplace" className="transition-colors duration-200 hover:text-primary-300">Marketplace</Link></li>
                <li><Link to="/projects" className="hover:text-white">Projects</Link></li>
                <li><a href="#how-it-works" className="transition-colors duration-200 hover:text-primary-300">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">For creators</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/register?role=client" className="transition-colors duration-200 hover:text-primary-300">Hire an editor</Link></li>
                <li><Link to="/marketplace" className="transition-colors duration-200 hover:text-primary-300">Explore editors</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">For editors</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/register?role=editor" className="transition-colors duration-200 hover:text-primary-300">Join as an editor</Link></li>
                <li><Link to="/login" className="transition-colors duration-200 hover:text-primary-300">Sign in</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-7 text-center text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            © 2026 ClipConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
