import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  Mail, 
  Globe,
  Calendar,
  CheckCircle,
  ArrowLeft,
  MessageSquare,
  Briefcase,
  DollarSign,
  Award
} from 'lucide-react';
import { useAuth } from '@hooks';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const isOwnProfile = !id || id === currentUser?._id;

  // Mock user data (replace with API call)
  const user = {
    _id: id || '1',
    username: 'sarahj',
    profile: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      bio: 'Professional video editor with 8+ years of experience. Specialized in commercial content, social media videos, and cinematic storytelling. Proficient in Adobe Premiere Pro, After Effects, and DaVinci Resolve.',
      location: 'Los Angeles, CA',
      website: 'www.sarahjohnson.media',
      avatar: null,
    },
    role: 'editor',
    ratings: 4.9,
    totalReviews: 127,
    memberSince: '2021',
    editorProfile: {
      skills: ['Video Editing', 'Color Grading', 'Motion Graphics', 'Sound Design', 'Adobe Premiere', 'After Effects'],
      hourlyRate: 75,
      experience: '8+ years',
      availability: 'Full-time',
    },
    portfolio: [
      { title: 'Brand Commercial', type: 'Commercial', thumbnail: null },
      { title: 'Music Video', type: 'Music', thumbnail: null },
      { title: 'Documentary Short', type: 'Documentary', thumbnail: null },
      { title: 'Social Media Campaign', type: 'Social', thumbnail: null },
    ],
    stats: {
      completedProjects: 156,
      onTimeDelivery: 98,
      repeatClients: 42,
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/marketplace" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Marketplace
        </Link>

        {/* Profile Header */}
        <motion.div 
          {...fadeInUp}
          className="glass-morphism p-8 rounded-2xl border border-white/5 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-4xl md:text-5xl font-bold text-white">
                {user.profile.firstName[0]}{user.profile.lastName[0]}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-white">
                  {user.profile.firstName} {user.profile.lastName}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary-500/10 text-primary-400 text-sm font-medium rounded-full">
                    {user.role === 'editor' ? 'Video Editor' : 'Client'}
                  </span>
                  <span className="flex items-center px-3 py-1 bg-green-500/10 text-green-400 text-sm font-medium rounded-full">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Available
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.profile.location}
                </span>
                <span className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  {user.profile.website}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Member since {user.memberSince}
                </span>
              </div>

              <p className="text-gray-300 max-w-2xl">{user.profile.bio}</p>
            </div>

            {/* Actions */}
            {!isOwnProfile && (
              <div className="flex flex-col gap-3">
                <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Hire Now
                </button>
                <button className="px-6 py-3 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-all duration-300 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Message
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Skills */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.1 }}
              className="glass-morphism p-6 rounded-2xl border border-white/5"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-dark-700/30 rounded-xl">
                  <p className="text-2xl font-bold text-white">{user.stats.completedProjects}</p>
                  <p className="text-sm text-gray-400">Projects</p>
                </div>
                <div className="text-center p-4 bg-dark-700/30 rounded-xl">
                  <p className="text-2xl font-bold text-white">{user.stats.onTimeDelivery}%</p>
                  <p className="text-sm text-gray-400">On-time</p>
                </div>
                <div className="text-center p-4 bg-dark-700/30 rounded-xl">
                  <p className="text-2xl font-bold text-white">{user.stats.repeatClients}</p>
                  <p className="text-sm text-gray-400">Repeat Clients</p>
                </div>
                <div className="text-center p-4 bg-dark-700/30 rounded-xl">
                  <p className="text-2xl font-bold text-white">{user.ratings}</p>
                  <p className="text-sm text-gray-400">Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="glass-morphism p-6 rounded-2xl border border-white/5"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.editorProfile.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-primary-500/10 text-primary-400 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Rate & Availability */}
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="glass-morphism p-6 rounded-2xl border border-white/5"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Rate & Availability</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Hourly Rate
                  </span>
                  <span className="text-white font-semibold">${user.editorProfile.hourlyRate}/hr</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Experience
                  </span>
                  <span className="text-white font-semibold">{user.editorProfile.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Availability
                  </span>
                  <span className="text-green-400 font-semibold">{user.editorProfile.availability}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Portfolio */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-morphism p-6 rounded-2xl border border-white/5"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Portfolio</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {user.portfolio.map((item, index) => (
                <div 
                  key={index}
                  className="group relative aspect-video bg-dark-700 rounded-xl overflow-hidden cursor-pointer"
                >
                  {/* Placeholder Thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-400/20 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white/10">{item.title[0]}</span>
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-dark-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                    <p className="text-white font-semibold text-center px-4">{item.title}</p>
                    <p className="text-sm text-gray-400 mt-1">{item.type}</p>
                    <button className="mt-4 px-4 py-2 bg-primary-500 text-white text-sm rounded-lg">
                      View Project
                    </button>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-dark-900/80 text-white text-xs rounded">
                    {item.type}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="mt-8 glass-morphism p-6 rounded-2xl border border-white/5"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Reviews</h3>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
              <span className="text-white font-semibold">{user.ratings}</span>
              <span className="text-gray-400 ml-1">({user.totalReviews} reviews)</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((review) => (
              <div key={review} className="p-4 bg-dark-700/30 rounded-xl">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">C{review}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">Client {review}</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  "Sarah delivered exceptional work on our commercial project. Professional, timely, and incredibly talented. Highly recommend!"
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
