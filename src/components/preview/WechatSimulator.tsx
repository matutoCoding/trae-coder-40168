import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface WechatSimulatorProps {
  content: string;
  versionName: string;
  versionColor: string;
}

const colorMap: Record<string, string> = {
  gentle: 'bg-gentle-500',
  primary: 'bg-primary-600',
  accent: 'bg-accent-500'
};

export function WechatSimulator({ content, versionName, versionColor }: WechatSimulatorProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    setDisplayedContent('');
    setIsTyping(true);
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent(content.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 20);
    
    return () => clearInterval(timer);
  }, [content]);
  
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-gray-100 rounded-[2.5rem] p-3 shadow-2xl">
        <div className="bg-black rounded-[2rem] overflow-hidden">
          <div className="h-6 bg-black flex items-center justify-center">
            <div className="w-20 h-5 bg-black rounded-b-xl flex items-end justify-center pb-1">
              <div className="w-12 h-1 bg-gray-800 rounded-full" />
            </div>
          </div>
          
          <div className="h-10 bg-[#EDEDED] flex items-center px-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full" />
              <span className="text-sm font-medium text-gray-800">企业微信</span>
            </div>
          </div>
          
          <div className="h-[480px] bg-[#EDEDED] overflow-y-auto scrollbar-thin p-4 space-y-4">
            <div className="text-center text-xs text-gray-400 py-2">
              今天 10:30
            </div>
            
            <div className="flex gap-3 animate-slide-in-left">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pharmacy%20logo%20professional%20medical%20cross%20blue%20green&image_size=square" 
                  alt="药店头像"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 max-w-[75%]">
                <p className="text-xs text-gray-500 mb-1">【门店名称】</p>
                <div className={cn(
                  'inline-block px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed',
                  'bg-white text-gray-800 shadow-sm'
                )}>
                  {displayedContent.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < displayedContent.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                  {isTyping && (
                    <span className="inline-block w-1.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-middle" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 opacity-60">
              <div className="text-xs text-gray-400 self-end">
                {versionName}
              </div>
              <div className={cn('w-2 h-2 rounded-full self-center', colorMap[versionColor])} />
            </div>
          </div>
          
          <div className="h-12 bg-white border-t border-gray-200 flex items-center px-4 gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-1 bg-gray-400 rounded-full" />
            </div>
            <div className="flex-1 h-8 bg-gray-100 rounded-lg" />
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-gray-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
