import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { IntelligenceOrb } from './IntelligenceOrb';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export interface OrbitNode {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  color: string;
  borderColor: string;
  link?: string;
  action?: 'route' | 'kisan_ai';
}

export const ORBIT_NODES: OrbitNode[] = [
  {
    id: 'crop-intelligence',
    title: 'Crop Intelligence',
    tagline: 'Vision Agmark quality grading & moisture analysis',
    emoji: '🌱',
    color: 'from-emerald-900/90 to-emerald-950/90 text-emerald-200',
    borderColor: 'border-emerald-500/50 hover:border-emerald-400',
    link: '/crop-analysis',
    action: 'route',
  },
  {
    id: 'kisan-ai',
    title: 'Kisan AI',
    tagline: 'Multilingual conversational agronomist with live voice',
    emoji: '🤖',
    color: 'from-amber-900/90 to-amber-950/90 text-amber-200',
    borderColor: 'border-amber-500/50 hover:border-amber-400',
    action: 'kisan_ai',
  },
  {
    id: 'market-intelligence',
    title: 'Market Intelligence',
    tagline: 'APMC mandi arrivals, prices & realization engine',
    emoji: '📊',
    color: 'from-blue-900/90 to-blue-950/90 text-blue-200',
    borderColor: 'border-blue-500/50 hover:border-blue-400',
    link: '/marketplace',
    action: 'route',
  },
  {
    id: 'smart-transport',
    title: 'Smart Transport',
    tagline: 'Freight deduction & logistics to verified buyers',
    emoji: '🚚',
    color: 'from-teal-900/90 to-teal-950/90 text-teal-200',
    borderColor: 'border-teal-500/50 hover:border-teal-400',
    link: '/marketplace/logistics',
    action: 'route',
  },
];

interface OrbitSystemProps {
  onNodeSelect?: (node: OrbitNode) => void;
}

export const OrbitSystem: React.FC<OrbitSystemProps> = ({ onNodeSelect }) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeNode, setActiveNode] = useState<OrbitNode>(ORBIT_NODES[0]);

  // Smooth orbital rotation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.3) % 360);
    }, 40);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNodeClick = (node: OrbitNode) => {
    setActiveNode(node);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
    if (node.action === 'kisan_ai') {
      window.dispatchEvent(new CustomEvent('open_kisan_ai'));
    }
  };

  // Orbital layout geometry
  const orbitRadiusDesktop = 180;
  const orbitRadiusMobile = 130;

  return (
    <div
      className="relative flex flex-col items-center justify-center my-6 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Container with defined stage dimensions */}
      <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] flex items-center justify-center">
        {/* Orbital Track: Outer Elliptical Ring */}
        <div className="absolute w-[290px] h-[290px] sm:w-[390px] sm:h-[390px] rounded-full border border-emerald-500/20 border-dashed animate-ring-spin-slow pointer-events-none" />

        {/* Secondary Spiral Accent Ring */}
        <div className="absolute w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] rounded-full border border-amber-500/15 pointer-events-none" />

        {/* Central Intelligence Orb */}
        <IntelligenceOrb
          activeLabel={activeNode.title}
          onOrbClick={() => handleNodeClick(activeNode)}
        />

        {/* 4 Orbiting Satellites */}
        {ORBIT_NODES.map((node, index) => {
          const angleStep = (360 / ORBIT_NODES.length) * index;
          const currentAngle = (rotationAngle + angleStep) % 360;
          const rad = (currentAngle * Math.PI) / 180;

          // Compute offsets for responsive radius
          const xOffsetDesktop = Math.cos(rad) * orbitRadiusDesktop;
          const yOffsetDesktop = Math.sin(rad) * orbitRadiusDesktop;
          const xOffsetMobile = Math.cos(rad) * orbitRadiusMobile;
          const yOffsetMobile = Math.sin(rad) * orbitRadiusMobile;

          const isSelected = activeNode.id === node.id;

          const nodeContent = (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-br ${node.color} backdrop-blur-md border ${node.borderColor} shadow-lg transition-all transform hover:scale-105 cursor-pointer ${
                isSelected ? 'ring-2 ring-amber-400 shadow-amber-500/30' : ''
              }`}
              onClick={() => handleNodeClick(node)}
            >
              <div className="w-7 h-7 rounded-xl bg-black/40 flex items-center justify-center text-sm shrink-0 border border-white/10">
                {node.emoji}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold leading-tight tracking-wide text-white">
                  {node.title}
                </p>
                <p className="text-[10px] text-white/70 font-medium truncate max-w-[110px]">
                  {node.id === 'kisan-ai' ? 'Live AI Voice' : 'Direct Access'}
                </p>
              </div>
              {node.link && (
                <ArrowUpRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white shrink-0 hidden sm:block" />
              )}
            </div>
          );

          return (
            <div
              key={node.id}
              className="absolute transition-transform duration-75 ease-linear pointer-events-auto"
              style={{
                transform: `translate3d(${
                  window.innerWidth < 640 ? xOffsetMobile : xOffsetDesktop
                }px, ${
                  window.innerWidth < 640 ? yOffsetMobile : yOffsetDesktop
                }px, 0)`,
              }}
            >
              {node.link ? (
                <Link to={node.link} title={`Go to ${node.title}`}>
                  {nodeContent}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNodeClick(node)}
                  title={`Launch ${node.title}`}
                  className="appearance-none bg-transparent border-none p-0 cursor-pointer"
                >
                  {nodeContent}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Active Module Capsule */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeNode.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-2 px-4 py-2 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-emerald-500/30 text-center max-w-sm"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300">
            <span>{activeNode.emoji}</span>
            <span>{activeNode.title}</span>
            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
          </div>
          <p className="text-[11px] text-stone-300 mt-0.5">{activeNode.tagline}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
