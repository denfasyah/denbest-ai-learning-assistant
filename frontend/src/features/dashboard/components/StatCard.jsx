import React from 'react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, growth, icon: Icon, color = "blue" }) => {
  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-${color}-500/15`}>
          <Icon className={`h-7 w-7 text-${color}-400`} />
        </div>

        {growth && (
          <Badge variant="emerald" icon={ArrowUpRight}>
            {growth}
          </Badge>
        )}
      </div>

      <h2 className="mt-6 text-3xl md:text-4xl font-bold text-white">
        {value}
      </h2>

      <p className="mt-2 text-sm text-slate-400 font-medium">
        {title}
      </p>
    </Card>
  );
};

export default StatCard;
