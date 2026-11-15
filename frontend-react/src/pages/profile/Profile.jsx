import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  Globe,
  Calendar,
  CheckCircle,
  ArrowLeft,
  MessageSquare,
  Briefcase,
  DollarSign,
  Award,
  GraduationCap,
  Monitor,
  Languages,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@hooks';
import { userService } from '@services/api';

const formatLabel = (value) =>
  String(value || '')
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getInitials = (user) =>
  [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || user?.username?.slice(0, 2).toUpperCase() || 'CC';

const formatDate = (value, options = { month: 'short', year: 'numeric' }) => {
  if (!value) return 'Not provided';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not provided' : date.toLocaleDateString(undefined, options);
};

const getWebsiteUrl = (website) => {
  if (!website) return null;
  const candidate = /^https?:\/\//i.test(website) ? website : `https://${website}`;
  try {
    const url = new URL(candidate);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!id) {
        setError('A profile ID was not provided.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setProfile(null);

      try {
        const response = await userService.getUserById(id);
        const fetchedUser = response.data?.data?.user;
        if (!fetchedUser) throw new Error('The profile response was empty.');
        if (active) setProfile(fetchedUser);
      } catch (requestError) {
        if (active) {
          const status = requestError.response?.status;
          setError(
            status === 404
              ? 'This profile could not be found.'
              : requestError.response?.data?.message || 'We could not load this profile. Please try again.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [id]);

  const isOwnProfile = Boolean(currentUser?.id && profile?.id === currentUser.id);
  const isEditor = String(profile?.role || '').toUpperCase() === 'EDITOR';
  const websiteUrl = getWebsiteUrl(profile?.website);
  const skills = Array.isArray(profile?.skills) ? profile.skills : [];
  const portfolioItems = Array.isArray(profile?.portfolioItems) ? profile.portfolioItems : [];
  const reviews = Array.isArray(profile?.reviewsReceived) ? profile.reviewsReceived : [];
  const software = Array.isArray(profile?.software) ? profile.software : [];
  const languages = Array.isArray(profile?.languages) ? profile.languages : [];
  const education = Array.isArray(profile?.education) ? profile.education : [];
  const certifications = Array.isArray(profile?.certifications) ? profile.certifications : [];
  const ratingCount = Number(profile?.ratingCount || 0);
  const ratingAverage = Number(profile?.ratingAverage || 0);

  const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35 },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 pt-20 px-4">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-5 w-40 rounded bg-white/10" />
          <div className="h-52 rounded-2xl bg-white/5" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="h-64 rounded-2xl bg-white/5" />
            <div className="lg:col-span-2 h-64 rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-dark-900 pt-24 px-4">
        <div className="max-w-xl mx-auto glass-morphism rounded-2xl border border-white/5 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Profile unavailable</h1>
          <p className="text-gray-400 mb-6">{error || 'This profile could not be found.'}</p>
          <Link to="/marketplace" className="inline-flex items-center text-primary-400 hover:text-primary-300">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const stats = isEditor
    ? [
        { label: 'Completed projects', value: Number(profile.completedProjects || 0) },
        { label: 'Rating', value: ratingCount ? ratingAverage.toFixed(1) : 'New' },
        { label: 'Reviews', value: ratingCount },
      ]
    : [
        { label: 'Projects posted', value: Number(profile.postedProjects || 0) },
        { label: 'Rating', value: ratingCount ? ratingAverage.toFixed(1) : 'New' },
        { label: 'Reviews', value: ratingCount },
      ];

  return (
    <div className="min-h-screen bg-dark-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/marketplace" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Marketplace
        </Link>

        <motion.section
          {...fadeInUp}
          className="glass-morphism p-6 md:p-8 rounded-2xl border border-white/5 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gradient-to-r from-primary-500 to-accent-400 flex items-center justify-center flex-shrink-0">
              {profile.avatar ? (
                <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl md:text-5xl font-bold text-white">{getInitials(profile)}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-white">
                  {[profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.username}
                </h1>
                <span className="px-3 py-1 bg-primary-500/10 text-primary-400 text-sm font-medium rounded-full">
                  {isEditor ? 'Video Editor' : 'Client'}
                </span>
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" /> Verified
                  </span>
                )}
              </div>

              <p className="text-gray-400 mb-3">@{profile.username}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400 mb-4">
                {profile.location && (
                  <span className="inline-flex items-center"><MapPin className="w-4 h-4 mr-1" />{profile.location}</span>
                )}
                {websiteUrl && (
                  <a href={websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center hover:text-primary-400">
                    <Globe className="w-4 h-4 mr-1" /> Website <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
                <span className="inline-flex items-center">
                  <Calendar className="w-4 h-4 mr-1" /> Member since {formatDate(profile.createdAt)}
                </span>
              </div>
              {profile.bio ? (
                <p className="text-gray-300 max-w-3xl whitespace-pre-line">{profile.bio}</p>
              ) : (
                <p className="text-gray-500 italic">This member has not added a bio yet.</p>
              )}
            </div>

            {!isOwnProfile && currentUser?.id && (
              <Link
                to={`/chat/${profile.id}`}
                className="inline-flex items-center justify-center px-5 py-3 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors"
              >
                <MessageSquare className="w-5 h-5 mr-2" /> Message
              </Link>
            )}
          </div>
        </motion.section>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <motion.section {...fadeInUp} className="glass-morphism p-6 rounded-2xl border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-4">Profile stats</h2>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-dark-700/30 rounded-xl">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {isEditor && (
              <>
                <motion.section {...fadeInUp} className="glass-morphism p-6 rounded-2xl border border-white/5">
                  <h2 className="text-lg font-semibold text-white mb-4">Skills</h2>
                  {skills.length ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-primary-500/10 text-primary-400 text-sm rounded-full">
                          {formatLabel(skill)}
                        </span>
                      ))}
                    </div>
                  ) : <p className="text-gray-500 text-sm">No skills added yet.</p>}
                </motion.section>

                <motion.section {...fadeInUp} className="glass-morphism p-6 rounded-2xl border border-white/5">
                  <h2 className="text-lg font-semibold text-white mb-4">Rate & availability</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-400 inline-flex items-center"><DollarSign className="w-4 h-4 mr-2" /> Hourly rate</span>
                      <span className="text-white font-semibold">
                        {profile.hourlyRate != null ? `$${Number(profile.hourlyRate).toFixed(2)}/hr` : 'Not set'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-400 inline-flex items-center"><Award className="w-4 h-4 mr-2" /> Experience</span>
                      <span className="text-white font-semibold">{formatLabel(profile.experience) || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-400 inline-flex items-center"><Briefcase className="w-4 h-4 mr-2" /> Availability</span>
                      <span className={profile.availability ? 'text-green-400 font-semibold' : 'text-gray-400 font-semibold'}>
                        {profile.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </motion.section>
              </>
            )}

            {!isEditor && (profile.company || profile.industry || profile.companySize) && (
              <motion.section {...fadeInUp} className="glass-morphism p-6 rounded-2xl border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">Organization</h2>
                <div className="space-y-2 text-sm text-gray-300">
                  {profile.company && <p><span className="text-gray-500">Company:</span> {profile.company}</p>}
                  {profile.industry && <p><span className="text-gray-500">Industry:</span> {profile.industry}</p>}
                  {profile.companySize && <p><span className="text-gray-500">Size:</span> {formatLabel(profile.companySize)}</p>}
                </div>
              </motion.section>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.section {...fadeInUp} className="glass-morphism p-6 rounded-2xl border border-white/5">
              <h2 className="text-xl font-semibold text-white mb-5">Portfolio</h2>
              {portfolioItems.length ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {portfolioItems.map((item) => (
                    <article key={item.id} className="overflow-hidden rounded-xl bg-dark-700/40 border border-white/5">
                      <div className="aspect-video bg-dark-700 relative">
                        {item.thumbnailUrl ? (
                          <img src={item.thumbnailUrl} alt={item.title || 'Portfolio item'} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-accent-400/20">
                            <Briefcase className="w-10 h-10 text-white/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold">{item.title}</h3>
                        {item.category && <p className="text-xs text-primary-400 mt-1">{formatLabel(item.category)}</p>}
                        {item.description && <p className="text-sm text-gray-400 mt-2">{item.description}</p>}
                        {Array.isArray(item.tags) && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {item.tags.map((tag) => <span key={tag} className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">{tag}</span>)}
                          </div>
                        )}
                        {item.videoUrl && (
                          <a href={item.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm text-primary-400 hover:text-primary-300 mt-3">
                            View work <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : <p className="text-gray-500 text-sm">No portfolio items have been added yet.</p>}
            </motion.section>

            {(software.length > 0 || languages.length > 0) && (
              <motion.section {...fadeInUp} className="glass-morphism p-6 rounded-2xl border border-white/5">
                <div className="grid md:grid-cols-2 gap-6">
                  {software.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-3 flex items-center"><Monitor className="w-4 h-4 mr-2" /> Software</h2>
                      <div className="space-y-2">
                        {software.map((item) => <div key={item.id} className="flex justify-between gap-3 text-sm"><span className="text-gray-200">{item.name}</span><span className="text-gray-500">{formatLabel(item.level)}</span></div>)}
                      </div>
                    </div>
                  )}
                  {languages.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-3 flex items-center"><Languages className="w-4 h-4 mr-2" /> Languages</h2>
                      <div className="space-y-2">
                        {languages.map((item) => <div key={item.id} className="flex justify-between gap-3 text-sm"><span className="text-gray-200">{item.language}</span><span className="text-gray-500">{formatLabel(item.proficiency)}</span></div>)}
                      </div>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {(education.length > 0 || certifications.length > 0) && (
              <motion.section {...fadeInUp} className="glass-morphism p-6 rounded-2xl border border-white/5">
                {education.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-white mb-3 flex items-center"><GraduationCap className="w-4 h-4 mr-2" /> Education</h2>
                    <div className="space-y-3">
                      {education.map((item) => (
                        <div key={item.id} className="border-l-2 border-primary-500/40 pl-4">
                          <p className="text-white font-medium">{item.degree || 'Education'}{item.field ? ` · ${item.field}` : ''}</p>
                          {item.institution && <p className="text-sm text-gray-400">{item.institution}</p>}
                          <p className="text-xs text-gray-500 mt-1">{formatDate(item.startDate)} – {item.isCurrent ? 'Present' : formatDate(item.endDate)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {certifications.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-3 flex items-center"><Award className="w-4 h-4 mr-2" /> Certifications</h2>
                    <div className="space-y-3">
                      {certifications.map((item) => (
                        <div key={item.id}>
                          <p className="text-white font-medium">{item.name}</p>
                          {item.issuer && <p className="text-sm text-gray-400">{item.issuer}</p>}
                          {item.credentialUrl && <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="text-sm text-primary-400 hover:text-primary-300">View credential</a>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.section>
            )}
          </div>
        </div>

        <motion.section {...fadeInUp} className="mt-8 glass-morphism p-6 rounded-2xl border border-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 className="text-xl font-semibold text-white">Reviews</h2>
            <div className="flex items-center text-sm">
              <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
              <span className="text-white font-semibold">{ratingCount ? ratingAverage.toFixed(1) : 'No rating yet'}</span>
              <span className="text-gray-400 ml-2">({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})</span>
            </div>
          </div>
          {reviews.length ? (
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <article key={review.id} className="p-4 bg-dark-700/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-400 flex items-center justify-center text-white font-semibold">
                      {getInitials(review.reviewer)}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {[review.reviewer?.firstName, review.reviewer?.lastName].filter(Boolean).join(' ') || review.reviewer?.username || 'CLIP CONNECT member'}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(review.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <span className="ml-auto inline-flex items-center text-yellow-400 text-sm"><Star className="w-4 h-4 fill-current mr-1" />{Number(review.rating || 0).toFixed(1)}</span>
                  </div>
                  {review.comment ? <p className="text-sm text-gray-300">{review.comment}</p> : <p className="text-sm text-gray-500 italic">No written comment.</p>}
                </article>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm">No reviews yet. Completed projects can be reviewed here.</p>}
        </motion.section>
      </div>
    </div>
  );
};

export default Profile;
