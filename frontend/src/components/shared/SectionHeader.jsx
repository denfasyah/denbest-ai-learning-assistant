const SectionHeader = ({title, description}) => {
  return (
    <div>
      <h2 className="text-2xl font-black tracking-[-1px]">{title}</h2>

      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
};

export default SectionHeader;
