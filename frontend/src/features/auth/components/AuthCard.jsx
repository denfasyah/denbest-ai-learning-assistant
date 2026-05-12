import Card from '../../../components/ui/Card';

const AuthCard = ({ title, description, children, footer }) => {
  return (
    <Card variant="glass" className="w-full max-w-md p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-slate-400 text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {children}
      </div>

      {footer && (
        <div className="mt-8 text-center text-sm text-slate-500">
          {footer}
        </div>
      )}
    </Card>
  );
};

export default AuthCard;
