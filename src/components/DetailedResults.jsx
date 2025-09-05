
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Brain, Scale, HeartHandshake, Bot } from 'lucide-react';

const DetailedResults = ({ results }) => {
  if (!results) return null;

  const { deepDive, savageTruth, silverLining, nextMove, hotTake, relationshipType } = results;

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <Tabs defaultValue="deep-dive" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 rounded-full h-12 p-1">
          <TabsTrigger value="deep-dive" className="rounded-full data-[state=active]:bg-purple-500/40 data-[state=active]:text-white">
            <Brain className="w-4 h-4 mr-2" /> Deep Dive
          </TabsTrigger>
          <TabsTrigger value="savage-truth" className="rounded-full data-[state=active]:bg-rose-500/40 data-[state=active]:text-white">
            <Flame className="w-4 h-4 mr-2" /> Hot Take
          </TabsTrigger>
          <TabsTrigger value="action-plan" className="rounded-full data-[state=active]:bg-green-500/40 data-[state=active]:text-white">
            <HeartHandshake className="w-4 h-4 mr-2" /> Action Plan
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-4 p-1 bg-black/20 rounded-2xl">
          <TabsContent value="deep-dive" className="mt-0">
            <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center text-xs text-white/50 mono-font">
                    <span>FULL ANALYSIS</span>
                    <span className="flex items-center"><Bot className="w-3 h-3 mr-1.5" /> {relationshipType}</span>
                </div>
                <p className="text-base text-white/90 leading-relaxed">{deepDive}</p>
            </div>
          </TabsContent>
          <TabsContent value="savage-truth" className="mt-0">
            <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-4">
                <h3 className="heading-font font-bold text-sm text-red-400 mb-1">SAVAGE TRUTH</h3>
                <p className="text-base text-white/90 italic">"{savageTruth}"</p>
                <div className="border-t border-white/10 my-3"></div>
                <h3 className="heading-font font-bold text-sm text-yellow-400 mb-1">HOT TAKE 🔥</h3>
                <p className="text-base text-white/90 italic">"{hotTake}"</p>
            </div>
          </TabsContent>
          <TabsContent value="action-plan" className="mt-0">
            <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-4">
              <div>
                <h3 className="heading-font font-bold text-sm text-green-400 mb-1">THE SILVER LINING</h3>
                <p className="text-base text-white/90">{silverLining}</p>
              </div>
              <div className="border-t border-white/10 my-3"></div>
              <div>
                <h3 className="heading-font font-bold text-sm text-cyan-400 mb-1">YOUR NEXT MOVE</h3>
                <p className="text-base text-white/90">{nextMove}</p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DetailedResults;
