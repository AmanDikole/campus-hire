'use client'

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function AnalyticsCharts({ branchData, placementData }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-10">
      
      {/* 1. Placement Distribution (Pie Chart) */}
      <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-sm h-[350px] sm:h-[400px]">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Placement Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={placementData}
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={5}
              dataKey="value"
            >
              {placementData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            {/* Legend behavior is now responsive: stacks on mobile */}
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Branch Performance (Bar Chart) */}
      <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-sm h-[350px] sm:h-[400px]">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Branch-wise Selections</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={branchData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="branch" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
              interval={0} // Forces all labels to show
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
            />
            <Tooltip 
              cursor={{ fill: '#f9fafb' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}