import { useState } from "react";
import { useTheme } from "./ThemeContext";
import { useAuth } from "./AuthContext";

export function AuthScreen() {
  const { colors } = useTheme();
  const { signIn, signUp, loading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [formError, setFormError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormError(''); // Clear form error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email || !formData.password) {
      setFormError('Email and password are required');
      return;
    }

    if (!isLogin && !formData.username) {
      setFormError('Username is required for registration');
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setFormError(error.message);
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.username);
        if (error) {
          setFormError(error.message);
        } else {
          setFormError('Please check your email to confirm your account');
        }
      }
    } catch (err) {
      setFormError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1
            className="font-['Archivo'] font-semibold text-[32px] mb-4"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
          >
            Welcome to Kinema Central
          </h1>
          <p
            className="font-['Archivo'] font-medium text-[16px] mb-8"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
          >
            Your ultimate movie and TV show rating community
          </p>
        </div>

        {/* Auth Form */}
        <div
          className="p-8 rounded-lg shadow-lg"
          style={{ backgroundColor: colors.background, borderColor: colors.secondary, border: '1px solid' }}
        >
          <div className="mb-6">
            <h2
              className="font-['Archivo'] font-semibold text-[20px] text-center"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label
                  className="block font-['Archivo'] font-medium text-[12px] mb-2"
                  style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full p-3 rounded border font-['Archivo'] text-[14px]"
                  style={{
                    fontVariationSettings: "'wdth' 100",
                    borderColor: colors.secondary,
                    backgroundColor: colors.background,
                    color: colors.primary
                  }}
                  placeholder="Enter your username"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label
                className="block font-['Archivo'] font-medium text-[12px] mb-2"
                style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
              >
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 rounded border font-['Archivo'] text-[14px]"
                style={{
                  fontVariationSettings: "'wdth' 100",
                  borderColor: colors.secondary,
                  backgroundColor: colors.background,
                  color: colors.primary
                }}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                className="block font-['Archivo'] font-medium text-[12px] mb-2"
                style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
              >
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full p-3 rounded border font-['Archivo'] text-[14px]"
                style={{
                  fontVariationSettings: "'wdth' 100",
                  borderColor: colors.secondary,
                  backgroundColor: colors.background,
                  color: colors.primary
                }}
                placeholder="Enter your password"
                required
              />
            </div>

            {(formError || error) && (
              <div
                className="p-3 rounded font-['Archivo'] text-[12px]"
                style={{
                  fontVariationSettings: "'wdth' 100",
                  backgroundColor: colors.tertiary,
                  color: '#d4183d'
                }}
              >
                {formError || error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 rounded font-['Archivo'] font-semibold text-[14px] transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{
                fontVariationSettings: "'wdth' 100",
                backgroundColor: colors.primary,
                color: colors.background
              }}
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormError('');
                setFormData({ email: '', password: '', username: '' });
              }}
              className="font-['Archivo'] text-[12px] hover:opacity-80 transition-opacity"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}