import imgTeaching11 from "figma:asset/01290d24115f39bd7d51541a98643fc045a3b087.png";
import imgProblem11 from "figma:asset/7221d865f7eeb15f5ea2f584822eb2f910f7bdac.png";
import imgIdea11 from "figma:asset/17f9aa6b4dc25aef2d2be502ab9b14c0e29dacfb.png";

export default function InteracOverlay() {
  return (
    <div className="bg-[rgba(255,173,77,0.27)] relative rounded-[50px] size-full" data-name="Interac overlay">
      <div className="absolute left-[42.19px] size-[124.722px] top-[134.81px]" data-name="teaching (1) 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgTeaching11} />
      </div>
      <div className="absolute left-[233.85px] size-[123.805px] top-[134.81px]" data-name="problem (1) 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgProblem11} />
      </div>
      <div className="absolute h-[122.874px] left-[406.26px] top-[134.81px] w-[123.805px]" data-name="idea (1) 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgIdea11} />
      </div>
      <p className="absolute font-['Fresca:Regular',sans-serif] h-[47.688px] leading-[19.74px] left-[42.19px] not-italic text-[71.532px] text-black top-[51.36px] tracking-[-3.5766px] w-[528.235px]">Interactive Method</p>
      <div className="absolute font-['Unna:Regular',sans-serif] h-[261.366px] leading-[13.042px] left-[32.1px] not-italic text-[29.346px] text-black top-[309.97px] w-[526.401px]">
        <p className="mb-[32.09762954711914px]">{`The interactive approach focuses on making `}</p>
        <p className="mb-[32.09762954711914px]">{`the learning experience more enjoyable for `}</p>
        <p className="mb-[32.09762954711914px]">children. Their eagerness to learn and self-</p>
        <p className="mb-[32.09762954711914px]">{`study develops, while they are being `}</p>
        <p>prepared for better grades at school</p>
      </div>
    </div>
  );
}